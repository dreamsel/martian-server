const idController = require('./controllers/id-controller');
const moveController = require('./controllers/move-controller');

process.stdin.on('data', (data) => {
  try {
    const input = JSON.parse(data.toString('utf8').trim());
    let result = {success: false, msg: 'unknown command'};

    if (input.command === 'id') result = idController(input);
    else if (input.command === 'move') result = moveController(input.data);

    console.log(JSON.stringify(result));
  } catch (e) {
    console.error('failed to parse ', data.toString('utf8'));
  }
});
