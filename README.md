Dump Mojang Username History
===

A simple tool to dump the username history of a list of Mojang UUIDs.

To use, compile the project and then run this command to automatically scrape UUIDs from server files:

> Note: In these examples, `dump-mojang-username-history` is an alias for `node lib/dump-mojang-username-history.js`

```bash
dump-mojang-username-history path/to/server/world/playerdata
```

Alternatively, you can provide a list of UUIDs:

```bash
dump-mojang-username-history c51d8b85-2a55-4aee-b690-2406a568b883 504e35e4-ee36-45e0-b1d3-7ad419311644 026cd66c-62c4-4dc8-8caa-5fae54769c11 
```

Data will be available in the `output-json` folder. Each file will look like this:

```json
{"names":[{"name":"Seboff"},{"name":"_xwpx_","changedToAt":1563378122000},{"name":"test6","changedToAt":1584448081000}],"profile":{"id":"026cd66c62c44dc88caa5fae54769c11","name":"test6","properties":[{"name":"textures","value":"ewogICJ0aW1lc3RhbXAiIDogMTY2MjYxODA1NzAzMCwKICAicHJvZmlsZUlkIiA6ICIwMjZjZDY2YzYyYzQ0ZGM4OGNhYTVmYWU1NDc2OWMxMSIsCiAgInByb2ZpbGVOYW1lIiA6ICJ0ZXN0NiIsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS9kODVkYzJlY2IzNDZlYTc2N2Q3ZTU3ZDQyODNkYWNlYWZiOTBlOGQ2NDA4NGQwMmVkMWYxZTAzZWVjZmUxZTMwIgogICAgfQogIH0KfQ=="}]}}
```

### Alternative formats

When this tool finishes downloading data, it will also write two files representing username changes in chronological order. The timestamp `1970-01-01T00:00:00.000Z` represents the username the account originally had.

#### `output-csv.csv`

Comma-separated values, can be opened by spreadsheet software

Example:
```csv
time,time_unix,uuid,username
1970-01-01T00:00:00.000Z,0,c51d8b85-2a55-4aee-b690-2406a568b883,BubzBubblez
1970-01-01T00:00:00.000Z,0,504e35e4-ee36-45e0-b1d3-7ad419311644,Den40208
1970-01-01T00:00:00.000Z,0,026cd66c-62c4-4dc8-8caa-5fae54769c11,Seboff
2015-02-04T20:05:43.000Z,1423080343000,c51d8b85-2a55-4aee-b690-2406a568b883,TestUser
2015-02-04T23:16:46.000Z,1423091806000,504e35e4-ee36-45e0-b1d3-7ad419311644,Testing
2015-04-11T02:35:53.000Z,1428719753000,c51d8b85-2a55-4aee-b690-2406a568b883,WhatThePeck
2016-07-17T02:25:03.000Z,1468722303000,c51d8b85-2a55-4aee-b690-2406a568b883,CheechMarin
2019-07-17T15:42:02.000Z,1563378122000,026cd66c-62c4-4dc8-8caa-5fae54769c11,_xwpx_
2020-03-17T12:28:01.000Z,1584448081000,026cd66c-62c4-4dc8-8caa-5fae54769c11,test6
2020-03-19T10:02:33.000Z,1584612153000,c51d8b85-2a55-4aee-b690-2406a568b883,Foocas
```

#### `output-coreprotect-sql.sql`

This represents the format for CoreProtect's builtin username log. If you hadn't been using this feature, you can use this tool to seed such a database. Please take backups before modifying any production database! ❤️

Example:
```sql
insert into co_username_log (time, uuid, user) values
(0, 'c51d8b85-2a55-4aee-b690-2406a568b883', 'BubzBubblez'),
(0, '504e35e4-ee36-45e0-b1d3-7ad419311644', 'Den40208'),
(0, '026cd66c-62c4-4dc8-8caa-5fae54769c11', 'Seboff'),
(1423080343, 'c51d8b85-2a55-4aee-b690-2406a568b883', 'TestUser'),
(1423091806, '504e35e4-ee36-45e0-b1d3-7ad419311644', 'Testing'),
(1428719753, 'c51d8b85-2a55-4aee-b690-2406a568b883', 'WhatThePeck'),
(1468722303, 'c51d8b85-2a55-4aee-b690-2406a568b883', 'CheechMarin'),
(1563378122, '026cd66c-62c4-4dc8-8caa-5fae54769c11', '_xwpx_'),
(1584448081, '026cd66c-62c4-4dc8-8caa-5fae54769c11', 'test6'),
(1584612153, 'c51d8b85-2a55-4aee-b690-2406a568b883', 'Foocas');
```

Building
---

`npm install` - **Install dependencies and compile everything**

`npm run build` - Compile everything

`npm run ts` - Compile typescript

---

`npm run watch` - Automatically compile Typescript as you edit

License
---

This source code is licensed under the terms of AGPL version 3 or later. You MUST provide source code when hosting it on a server.

**Contributing**

By making a contribution to this project, I certify that:

- (a) The contribution was created in whole or in part by me and I have the right to submit it under a suitable open source license; or

- (b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or

- (c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.

- I understand and agree that this project and the contribution are public and that a record of the contribution is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.

- (d) I understand that this project is currently licensed as AGPLv3+, and that my contributions must be compatible with this.

Additionally, I agree:

- To fulfill (d), I hereby grant the leadership of this project (lordpipe) a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license that is compatible with AGPLv3+, [as defined by the Free Software Foundation](https://www.gnu.org/licenses/license-list.en.html#GPLCompatibleLicenses)
