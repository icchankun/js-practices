#!/usr/bin/env node

import minimist from "minimist";
import DB from "./lib/db.js";
import MemoCli from "./lib/memo-cli.js";

const options = minimist(process.argv.slice(2));
const db = new DB();
const memoCli = new MemoCli(db);

try {
  await db.createTable();
  await memoCli.fetchMemos();
  await memoCli.exec(options);
} catch (err) {
  console.log(err);
}
