#!/usr/bin/env node

import minimist from "minimist";
import sqlite3 from "sqlite3";
import MemoCli from "./lib/memo-cli.js";

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("db.sqlite3");
const memoCli = new MemoCli(db);

try {
  await memoCli.createTable();
  await memoCli.fetchMemos();
  await memoCli.exec(options);
} catch (err) {
  console.log(err);
}
