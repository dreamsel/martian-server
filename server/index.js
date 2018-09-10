const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocketServer = require('websocket').server;
const deepcopy = require('deepcopy');

const fieldFactory = require('./fields/field');
const worker = require('./worker');
const ROVER = require('./constants/rover');
const RESOURCES = require('./constants/resources');
const OBJECTS = require('./constants/objects');
const TERRAIN = require('./constants/terrain');

const generateFields = process.argv[2] === 'generate';
const level = !generateFields ? (process.argv[2] || 1) : 1;
const commonFieldData = generateFields ? fieldFactory.generate(12) : fieldFactory.predefined(level);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'some strange and long string to be served as secret',
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
}));
app.use(cors({credentials: true, origin: true}));

app.get('/', (req, res, next) => res.send('year'));

app.get('/commonfield', (req, res, next) => {
  const fieldData = commonFieldData;
  const field = [];
  for (let y = 0; y < fieldData.FIELD_SIZE; y++) {
    field[y] = [];
    for (let x = 0; x < fieldData.FIELD_SIZE; x++) {
      field[y][x] = {terrain: fieldData.field[y][x], resource: fieldData.resources[y][x], objects: []};
    }
  }
  // put rovers on map
  const playersData = players.map(player => ({
    id: player.id,
    name: player.name,
    points: player.points,
    resources: player.resources,
    rovers: player.rovers.length
  }));
  players.forEach(player => {
    field[player.base.y][player.base.x].objects.push(OBJECTS.BASE);
    player.rovers.forEach(rover => field[rover.y][rover.x].objects.push(OBJECTS.ROVER));
  });
  return res.json({success: true, field, players: playersData});
});

app.get('/field/:playerid', (req, res, next) => {
  const playerid = req.params.playerid;
  const foundPlayer = players.find(player => player.id == playerid); // eslint-disable-line eqeqeq
  if (foundPlayer) {
    const fieldData = foundPlayer.fieldData;
    const field = [];
    for (let y = 0; y < fieldData.FIELD_SIZE; y++) {
      field[y] = [];
      for (let x = 0; x < fieldData.FIELD_SIZE; x++) {
        field[y][x] = {terrain: fieldData.field[y][x], resource: fieldData.resources[y][x], objects: []};
      }
    }
    // put rovers on map
    const playerData = {
      id: foundPlayer.id,
      name: foundPlayer.name,
      points: foundPlayer.points,
      resources: foundPlayer.resources,
      rovers: foundPlayer.rovers.map(rover => ({id: rover.id, energy: rover.energy, load: rover.load}))
    };
    field[foundPlayer.base.y][foundPlayer.base.x].objects.push(OBJECTS.BASE);
    foundPlayer.rovers.forEach(rover => field[rover.y][rover.x].objects.push(OBJECTS.ROVER));

    return res.json({success: true, field, player: playerData});
  } else {
    res.json({success: false, message: 'no player found for this playerid'});
  }
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, () => console.log('listening successfully'));

const wsServer = new WebSocketServer({
  httpServer: server
});

const clients = {};

const field = generateFields ? fieldFactory.generate(12) : fieldFactory.predefined(level);
const base = {};
for (let y = 0; y < field.field.length; y++) {
  for (let x = 0; x < field.field[y].length; x++) {
    if (field.field[y][x] === TERRAIN.BASE) {
      base.x = x;
      base.y = y;
    }
  }
}
const players = [
  { id: 10,
    name: 'team1',
    base,
    rovers: [{id: 1, x: base.x, y: base.y, energy: ROVER.MAX_ENERGY, load: [], processed: false}],
    points: 0,
    max_rovers: 1,
    resources: {
      [RESOURCES.RAREEARTH]: 0,
      [RESOURCES.METAL]: 0,
      [RESOURCES.HYDRATES]: 0,
      [RESOURCES.URANIUM]: 0,
    },
    fieldData: deepcopy(field)
  },
  { id: 2,
    name: 'team2',
    base,
    rovers: [{id: 1, x: base.x, y: base.y, energy: ROVER.MAX_ENERGY, load: [], processed: false}],
    points: 0,
    max_rovers: 1,
    resources: {
      [RESOURCES.RAREEARTH]: 0,
      [RESOURCES.METAL]: 0,
      [RESOURCES.HYDRATES]: 0,
      [RESOURCES.URANIUM]: 0,
    },
    fieldData: deepcopy(field)
  }
];

// worker(players, clients, fieldData);
worker(players, clients);

wsServer.on('request', (req) => {
  console.log('new request', req.remoteAddress);
  const connection = req.accept(null, req.origin);
  if (connection) {
    clients[req.remoteAddress] = {connection, clientAnswer: null};
    // add connection to pool
    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        console.log('server: got message from client', message);
        try {
          const json = JSON.parse(message.utf8Data);
          if (players.some(el => el.id == json.id)) { // eslint-disable-line eqeqeq
            clients[connection.remoteAddress].id = json.id;
            clients[connection.remoteAddress].clientAnswer = json.answer;
          } else {
            connection.send(JSON.stringify({error: `Wrong id ${json.id}`}));
          }
        } catch (e) {
          console.log('server faild to parse json', message.utf8Data);
        }
      }
    });
    connection.on('close', (reason, descr) => {
      console.log('connection closed', reason, descr, connection.remoteAddress);
      // remove connection from pool
      clients[connection.remoteAddress] = null;
      delete clients[connection.remoteAddress];
    });
    connection.on('error', (err) => {
      console.log('connection err', err.message, connection.remoteAddress);
      // remove connection from pool
      clients[connection.remoteAddress] = null;
      connection.drop(connection.CLOSE_REASON_PROTOCOL_ERROR);
      delete clients[connection.remoteAddress];
    });
  }
});

module.exports = app;
