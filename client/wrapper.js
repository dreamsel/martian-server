const WebSocketClient = require('websocket').client;
const {spawn} = require('child_process');

const myId = 1;

const child = spawn('node', ['wrapped.js']);
let wsConnection = null;

child.stdout.on('data', (data) => {
  const strData = data.toString('utf8').trim();
  try {
    const json = JSON.parse(strData);
    console.log('json parsed', json);
    wsConnection.send(JSON.stringify({id: myId, answer: json}));
  } catch (e) {
    console.log('failed to parse json', e.message);
  }
});

const client = new WebSocketClient();
client.on('connect', (connection) => {
  console.log('client: connection connected', connection.remoteAddress);
  wsConnection = connection;
  connection.on('message', (message) => {
    console.log('message from server', message);
    child.stdin.write(message);
  });
  connection.send(JSON.stringify({msg: 'json'}));
});
client.on('connectFailed', (err) => {
  console.log('client: connect failed', err);
});
client.connect('ws://localhost:3000');
