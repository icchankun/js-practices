import timers from "timers/promises";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

// エラーなしのプログラム
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (?)", "Book Title", function () {
      console.log(`id: ${this.lastID}`);
      db.get("SELECT * FROM books", (_, row) => {
        console.log(`${row.id}: ${row.title}`);
        db.run("DROP TABLE books");
      });
    });
  },
);

// エラーなしとエラーありのプログラムを正しく続けて実行させるため、0.1秒待機する。
await timers.setTimeout(100);

// エラーありのプログラム
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (author) VALUES (?)", "Book Author", (err) => {
      console.error(err.message);
      db.get("SELECT author FROM books", (err) => {
        console.error(err.message);
        db.run("DROP TABLE books");
      });
    });
  },
);
