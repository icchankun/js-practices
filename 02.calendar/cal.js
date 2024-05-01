#!/usr/bin/env node

import minimist from "minimist";
import dayjs from "dayjs";

const options = minimist(process.argv.slice(2));

let date = dayjs();
if (options.m) {
  date = date.set("month", options.m - 1);
}
if (options.y) {
  date = date.set("year", options.y);
}

const firstDate = date.startOf("month");
const lastDate = date.endOf("month");

const calHeading = `${date.month() + 1}月 ${date.year()}`;
console.log(calHeading.padStart(13));
console.log("日 月 火 水 木 金 土");

const ADDITIONAL_INDENT = 3;
const addCount = firstDate.day();
const indent = ADDITIONAL_INDENT * addCount;
process.stdout.write("".padStart(indent));

const datesInMonth = Array.from(Array(lastDate.date()).keys()).map((i) =>
  firstDate.add(i, "day"),
);
const SATURDAY_INDEX = 6;
const isSaturday = (date) => {
  if (date.day() === SATURDAY_INDEX) {
    return true;
  }
  return false;
};

datesInMonth.forEach((date) => {
  const formattedDate = String(date.date()).padStart(2);

  if (isSaturday(date)) {
    console.log(formattedDate);
  } else {
    process.stdout.write(formattedDate);
    process.stdout.write("".padStart(1));
  }
});

console.log("");

const countSaturday = () => {
  return datesInMonth.filter((date) => {
    return isSaturday(date);
  }).length;
};

if (countSaturday() <= 4) {
  console.log("");
}
