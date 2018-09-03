const WebSocketClient = require('websocket').client;
const {spawn} = require('child_process');

const myId = 1;

const child = spawn('./client/wrapped.js');

let wsConnection = null;

child.stdout.on('data', (data) => {
  const strData = data.toString('utf8').trim();
  try {
    const json = JSON.parse(strData);
    console.log('json from child parsed', json);
    wsConnection.send(JSON.stringify({id: myId, answer: json}));
  } catch (e) {
    console.log('non-json msg from child:', strData);
  }
});

const client = new WebSocketClient();
client.on('connect', (connection) => {
  console.log('client: connection connected', connection.remoteAddress);
  wsConnection = connection;
  connection.on('message', (message) => {
    try {
      if (message.type === 'utf8') {
        console.log('message from server');
        child.stdin.write(message.utf8Data);
        console.log('message sent to child');
      }
    } catch (e) {
      console.log('error when sent to child', e.message);
    }
  });
  connection.send(JSON.stringify({id: myId, answer: []}));
});
client.on('connectFailed', (err) => {
  console.log('client: connect failed', err);
});
client.connect('ws://localhost:3000');
