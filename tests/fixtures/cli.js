#!/usr/bin/env node

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function ask(question) {
  return new Promise((resolve) => {
    readline.question(question, resolve);
  });
}

async function main() {
  await wait(500);
  const answer = await ask(`Answer?: `);
  await wait(500);
  console.log(`Your answer is ${answer}!`);

  readline.close();
}

main();
