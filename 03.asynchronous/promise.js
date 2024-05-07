import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { asyncRun, asyncGet } from "./async_methods.js";

const db = new sqlite3.Database(":memory:");

// エラーなしのプログラム
asyncRun(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    asyncRun(db, "INSERT INTO books (title) VALUES (?)", "Book Title"),
  )
  .then((statement) => {
    console.log("id: " + statement.lastID);
    return asyncGet(db, "SELECT * FROM books");
  })
  .then((row) => {
    console.log(row.id + ": " + row.title);
    asyncRun(db, "DROP TABLE books");
  });

// エラーなしとエラーありのプログラムを正しく続けて実行させるため、0.1秒待機する。
await timers.setTimeout(100);

// エラーありのプログラム
asyncRun(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    asyncRun(db, "INSERT INTO books (author) VALUES (?)", "Book Author"),
  )
  .catch((err) => {
    console.error(err.message);
    return asyncGet(db, "SELECT author FROM books");
  })
  .catch((err) => {
    console.error(err.message);
    asyncRun(db, "DROP TABLE books");
  });
