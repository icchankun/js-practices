import enquirer from "enquirer";
import { asyncRun, asyncAll } from "./async-sqlite3-functions.js";
import Memo from "./memo.js";

export default class MemoCli {
  #db;
  #memos;
  constructor(db) {
    this.#db = db;
    this.#memos = [];
  }
  async createTable() {
    await asyncRun(
      this.#db,
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
    ).catch((err) => {
      throw new Error(err);
    });
  }
  async fetchMemos() {
    this.#memos = await asyncAll(this.#db, "SELECT * FROM memos")
      .then((rows) => rows.map((row) => new Memo(row.content, row.id)))
      .catch((err) => {
        throw new Error(err);
      });
  }
  async exec(options) {
    if (options.l) {
      this.#listMemos();
    } else if (options.r) {
      await this.#referMemo();
    } else if (options.d) {
      await this.#destroyMemo();
    } else {
      this.#createMemo();
    }
  }
  #hasNoMemos() {
    return this.#memos.length === 0;
  }
  #listMemos() {
    if (this.#hasNoMemos()) {
      console.error("表示できるメモがありません。");
    } else {
      this.#memos.forEach((memo) => console.log(memo.contentFirstLine()));
    }
  }
  async #referMemo() {
    try {
      const memo = await this.#selectMemo("see");
      console.log(memo.content);
    } catch {
      console.error("参照できるメモがありません。");
    }
  }
  async #destroyMemo() {
    try {
      const memo = await this.#selectMemo("delete");
      memo.destroy(this.#db);
    } catch {
      console.error("削除できるメモがありません。");
    }
  }
  #createMemo() {
    let content = "";

    process.stdin.on("data", (inputText) => {
      content += inputText;
    });

    process.stdin.on("end", () => {
      const memo = new Memo(content);
      memo.create(this.#db);
    });
  }
  #createPrompt(promptWord) {
    const { Select } = enquirer;
    return new Select({
      name: "memo",
      message: `Choose a note you want to ${promptWord} :`,
      choices: this.#memos.map((memo) => ({
        name: memo.contentFirstLine(),
        value: memo,
      })),
      result() {
        return this.focused.value;
      },
    });
  }
  async #selectMemo(promptWord) {
    if (this.#hasNoMemos()) {
      return;
    }

    const prompt = this.#createPrompt(promptWord);
    return await prompt
      .run()
      .then(() => prompt.result())
      .catch((err) => console.error(err));
  }
}
