#!/usr/bin/env node

import minimist from "minimist";
import MemoDB from "./lib/db.js";
import MemoCli from "./lib/memo-cli.js";

const options = minimist(process.argv.slice(2));
const memoDB = new MemoDB();
const memoCli = new MemoCli(memoDB);

try {
  await memoDB.createTable();
  await memoCli.fetchMemos();
  await memoCli.exec(options);
} catch (err) {
  console.log(err);
}
