const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const fieldFactory = require('./field');
const worker = require('./worker');
const ROVER = require('./constants/rover');
const RESOURCES = require('./constants/resources');

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
app.get('/field', (req, res, next) => res.json(fieldData));
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('listening successfully'));

const players = [
  { id: 1,
    url: 'http://localhost:8081',

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

    base: {x: 10, y: 10},
    rovers: [],
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
