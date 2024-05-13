import { asyncRun } from "./async-sqlite3-functions.js";

export default class Memo {
  #id;
  constructor(content, id = "") {
    this.content = content;
    this.#id = id;
  }
  contentFirstLine() {
    return this.content.split("\n")[0];
  }
  async create(db) {
    await asyncRun(
      db,
      "INSERT INTO memos (content) VALUES (?)",
      this.content,
    ).catch((err) => console.error(err));
  }
  async destroy(db) {
    await asyncRun(db, "DELETE FROM memos WHERE id = (?)", this.#id).catch(
      (err) => console.error(err),
    );
  }
}
