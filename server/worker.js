const processPlayerMove = require('./process-player');
const TERRAIN = require('./constants/terrain');
const RESOURCES = require('./constants/resources');

let processIPs = (players, clients) => {
  console.log('server processIPs', Object.keys(clients).length);
  Object.keys(clients).forEach(key => {
    console.log('processing key', key);
    const client = clients[key];
    const player = players.find(player => player.id == client.id); // eslint-disable-line eqeqeq
    if (player) {
      // process player and client.clientAnswer
      const response = processPlayerMove(client.clientAnswer, player);
      client.clientAnswer = null;
      client.connection.send(JSON.stringify({command: 'move', data: response}));
    }
  });

  setTimeout(processIPs, 2000);
};

const Worker = (players, clients) => {
  players.forEach(player => {
    player.response = {
      base: player.base,
      points: player.points,
      max_rovers: player.max_rovers,
      resources: player.resources,
      rovers: player.rovers.map(rover => ({...rover, area: [[], [], []]})),
      errors: [],
    };
    player.fieldData.field[player.base.y][player.base.x] = TERRAIN.BASE; // to be sure
    player.fieldData.resources[player.base.y][player.base.x] = RESOURCES.NONE;
  });

  processIPs = processIPs.bind(null, players, clients);
  setTimeout(processIPs, 5000);
};

module.exports = Worker;
