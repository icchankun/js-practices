import sqlite3 from "sqlite3";
import timers from "timers/promises";
const db = new sqlite3.Database(":memory:");

const asyncRun = async (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

const asyncGet = async (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// エラーなしのプログラム
(async () => {
  await asyncRun(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    const table = await asyncRun(
      db,
      "INSERT INTO books (title) VALUES (?)",
      "Book Title",
    );
    console.log("id: " + table.lastID);
  } catch (err) {
    console.error(err.message);
  }

  try {
    const row = await asyncGet(db, "SELECT * FROM books");
    console.log(row.id + ": " + row.title);
  } catch (err) {
    console.error(err.message);
  }

  asyncRun(db, "DROP TABLE books");
})();

// エラーなしとエラーありのプログラムを正しく続けて実行させるため、0.1秒待機する。
await timers.setTimeout(100);

// エラーありのプログラム
(async () => {
  await asyncRun(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    const table = await asyncRun(
      db,
      "INSERT INTO books (author) VALUES (?)",
      "Book Author",
    );
    console.log("id: " + table.lastID);
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

  asyncRun(db, "DROP TABLE books");
})();
