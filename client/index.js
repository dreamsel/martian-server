const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const idController = require('./controllers/id-controller');
const moveController = require('./controllers/move-controller');

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


app.get('/', idController);
app.post('/move', moveController);

const port = process.env.PORT || 8081;
app.listen(port, () => console.log('listening successfully'))


module.exports = app;
