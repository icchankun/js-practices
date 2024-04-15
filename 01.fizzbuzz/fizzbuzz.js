#!/usr/bin/env node

const DISPLAY_COUNT = 20;
const fizzbuzz = (num) => {
  if (num % 3 === 0 && num % 5 === 0) {
    console.log("FizzBuzz");
  } else if (num % 3 === 0) {
    console.log("Fizz");
  } else if (num % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(String(num));
  }
};

Array.from(Array(DISPLAY_COUNT).keys(), (x) => x + 1).forEach((num) =>
  fizzbuzz(num),
);
