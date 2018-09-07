#!/usr/bin/env node

const idController = require('./controllers/id-controller');
const moveController = require('./controllers/move-controller');
const fs = require('fs');

const log = fs.createWriteStream('child.log');
process.stdin.on('data', (data) => {
  try {
    const input = JSON.parse(data.toString('utf8').trim());
    let result = {success: false, msg: 'unknown command'};
    log.write(`input command=${input.command}\n`);
    if (input.command === 'id') result = idController(input);
    else if (input.command === 'move') result = moveController(input.data);
    log.write(`command result ${JSON.stringify(result)}\n`);

    console.log(JSON.stringify(result)); // output, process.stdout.write or smth alike
  } catch (e) {
    log.write(`failed to parse ${data.toString('utf8')}\n`);
    console.log(JSON.stringify({success: false, error: e.message})); // output, process.stdout.write or smth alike
  }
});
