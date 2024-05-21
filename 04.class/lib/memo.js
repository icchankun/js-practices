export default class Memo {
  #id;
  constructor(content, id = "") {
    this.content = content;
    this.#id = id;
  }
  contentFirstLine() {
    return this.content.split("\n")[0];
  }
  create(db) {
    db.insert(this.content);
  }
  destroy(db) {
    db.delete(this.#id);
  }
}
