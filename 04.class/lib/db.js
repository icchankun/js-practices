import sqlite3 from "sqlite3";
import { asyncRun, asyncAll } from "./async-sqlite3-functions.js";

export default class DB {
  #sqlite;
  constructor() {
    this.#sqlite = new sqlite3.Database("db.sqlite3");
  }
  async createTable() {
    await asyncRun(
      this.#sqlite,
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
    ).catch((err) => {
      throw new Error(err);
    });
  }
  async selectAll() {
    return await asyncAll(this.#sqlite, "SELECT * FROM memos").catch((err) => {
      throw new Error(err);
    });
  }
  async insert(content) {
    await asyncRun(
      this.#sqlite,
      "INSERT INTO memos (content) VALUES (?)",
      content,
    ).catch((err) => console.error(err));
  }
  async delete(id) {
    await asyncRun(this.#sqlite, "DELETE FROM memos WHERE id = (?)", id).catch(
      (err) => console.error(err),
    );
  }
}
