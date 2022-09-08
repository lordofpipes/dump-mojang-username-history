import * as fs from "node:fs/promises";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import axiosRetry from "axios-retry";
import sqlstring from "sqlstring";

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const http = rateLimit(axios.create({}), { maxRPS: 1 });
axiosRetry(http, { retries: 15 });

const ARGS = process.argv.slice(2);

interface UsernameChange {
    uuid: string;
    name: string;
    changedToAt: number;
}

const usernameHistory: UsernameChange[] = [];

const couldNotFind: string[] = [];

async function main() {
    const uuids: Set<string> = new Set();
    for (const arg of ARGS) {
        const match = arg.match(UUID_REGEX);

        if (match != null) {
            uuids.add(match[0]);
            continue;
        }

        const dir = await fs.readdir(arg);
        for (const file of dir) {
            const match = file.match(UUID_REGEX);
            if (match != null) uuids.add(match[0]);
        }
    }

    if (uuids.size === 0) {
        console.error("No valid UUIDs can be found");
        process.exit(1);
    }

    try {
        await fs.mkdir("output-json");
    } catch (err) {
        // folder already exists
    }
    await promiseAllInBatches((uuid) => lookup(uuid), [...uuids], 16);

    console.error("Finished writing data to output-json/");

    usernameHistory.sort((a, b) => a.changedToAt - b.changedToAt);

    if (couldNotFind.length !== 0)
        console.error(
            "Writing list of UUIDs that could not be found on the Mojang API to output-could-not-find.json. You will have to identify these accounts yourself",
        );
    await fs.writeFile("output-could-not-find.json", JSON.stringify(couldNotFind));

    console.error("Creating CoreProtect SQL file output-coreprotect-sql.sql...");
    const coreProtectSqlFile = await fs.open("output-coreprotect-sql.sql", "w");
    await coreProtectSqlFile.write("insert into co_username_log (time, uuid, user) values\n");

    console.error("Creating CSV file output-csv.csv...");
    const csvFile = await fs.open("output-csv.csv", "w");
    await csvFile.write("time,time_unix,uuid,username\n");

    let first = true;
    for (const nameChange of usernameHistory) {
        if (!first) await coreProtectSqlFile.write(",\n");
        first = false;

        await coreProtectSqlFile.write(
            sqlstring.format("(?, ?, ?)", [
                Math.floor(nameChange.changedToAt / 1000),
                nameChange.uuid,
                nameChange.name,
            ]),
        );

        await csvFile.write(
            [
                new Date(nameChange.changedToAt).toISOString(),
                nameChange.changedToAt,
                nameChange.uuid,
                nameChange.name,
            ].join(",") + "\n",
        );
    }

    await coreProtectSqlFile.write(";");
    await coreProtectSqlFile.close();
    await csvFile.close();

    console.error("Finished");
}

async function lookup(uuid: string): Promise<any | null> {
    const names = await http.get(`https://api.mojang.com/user/profiles/${uuid}/names`);
    if (names.status === 204) {
        couldNotFind.push(uuid);
        return null;
    }

    for (const nameChange of names.data) {
        usernameHistory.push({
            uuid,
            name: nameChange.name,
            changedToAt: nameChange.changedToAt || 0,
        });
    }

    const profile = await http.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    console.error(`Downloading data for ${uuid} (${profile.data.name})...`);
    await fs.writeFile(`output-json/${uuid}.json`, JSON.stringify({ names: names.data, profile: profile.data }));

    return { names: names.data, profile };
}

async function promiseAllInBatches<T, R>(task: (input: T) => R, items: T[], batchSize: number) {
    let position = 0;
    let results: R[] = [];
    while (position < items.length) {
        const itemsForBatch = items.slice(position, position + batchSize);
        results = [...results, ...(await Promise.all(itemsForBatch.map((item) => task(item))))];
        position += batchSize;
    }
    return results;
}

main();
