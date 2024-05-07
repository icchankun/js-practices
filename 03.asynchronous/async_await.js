import sqlite3 from "sqlite3";
import { asyncRun, asyncGet } from "./async_methods.js";

const db = new sqlite3.Database(":memory:");

// エラーなしのプログラム
await asyncRun(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

try {
  const statement = await asyncRun(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "Book Title",
  );
  console.log("id: " + statement.lastID);
} catch (err) {
  console.error(err.message);
}

try {
  const row = await asyncGet(db, "SELECT * FROM books");
  console.log(row.id + ": " + row.title);
} catch (err) {
  console.error(err.message);
}

await asyncRun(db, "DROP TABLE books");

// エラーありのプログラム
await asyncRun(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

try {
  const statement = await asyncRun(
    db,
    "INSERT INTO books (author) VALUES (?)",
    "Book Author",
  );
  console.log("id: " + statement.lastID);
} catch (err) {
  if (err.code === "SQLITE_ERROR") {
    console.error(err.message);
  }
}

try {
  const row = await asyncGet(db, "SELECT author FROM books");
  console.log(row.id + ": " + row.title);
} catch (err) {
  if (err.code === "SQLITE_ERROR") {
    console.error(err.message);
  }
}

await asyncRun(db, "DROP TABLE books");
