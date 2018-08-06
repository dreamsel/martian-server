const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const fieldFactory = require('./field');
const worker = require('./worker');
const ROVER = require('./constants/rover');
const RESOURCES = require('./constants/resources');
const OBJECTS = require('./constants/objects');

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

const fieldData = fieldFactory(12);

app.get('/', (req, res, next) => res.send('year'));

app.get('/field', (req, res, next) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening successfully'));

const players = [
  { id: 1,
    url: 'http://localhost:8081',
    name: 'team1',
    base: {x: 5, y: 5},
    rovers: [{id: 1, x: 5, y: 5, energy: ROVER.MAX_ENERGY, load: [], processed: false}],
    points: 0,
    max_rovers: 1,
    resources: {
      [RESOURCES.RAREEARTH]: 0,
      [RESOURCES.METAL]: 0,
      [RESOURCES.HYDRATES]: 0,
    }
  },
  { id: 2,
    url: 'http://localhost:8082',
    name: 'team2',
    base: {x: 10, y: 10},
    rovers: [{id: 1, x: 10, y: 10, energy: ROVER.MAX_ENERGY, load: [], processed: false}],
    points: 0,
    max_rovers: 1,
    resources: {
      [RESOURCES.RAREEARTH]: 0,
      [RESOURCES.METAL]: 0,
      [RESOURCES.HYDRATES]: 0,
    }
  }
];

worker(players, fieldData);

module.exports = app;
