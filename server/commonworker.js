const processPlayerMove = require('./process-player');
const TERRAIN = require('./constants/terrain');
const RESOURCES = require('./constants/resources');

let processIPs = (players, clients, fieldData) => {
  console.log('server processIPs', Object.keys(clients).length);
  Object.keys(clients).forEach(key => {
    console.log('processing key', key);
    const client = clients[key];
    const player = players.find(player => player.id == client.id); // eslint-disable-line eqeqeq
    console.log('got player', player, ' for client.id=', client.id);
    if (player) {
      // process player and client.clientAnswer
      processPlayerMove(client.clientAnswer, player, fieldData, players);
      client.clientAnswer = null;
      client.connection.send(JSON.stringify({command: 'move', data: player.response}));
    }
  });

  setTimeout(processIPs, 2000);
};

const Worker = (players, clients, fieldData) => {
  players.forEach(player => {
    player.response = {
      base: player.base,
      points: player.points,
      max_rovers: player.max_rovers,
      resources: player.resources,
      rovers: player.rovers.map(rover => ({...rover, area: [[], [], []]})),
      errors: []
    };
    fieldData.field[player.base.y][player.base.x] = TERRAIN.BASE;
    fieldData.resources[player.base.y][player.base.x] = RESOURCES.NONE;
  });

  processIPs = processIPs.bind(null, players, clients, fieldData);
  setTimeout(processIPs, 5000);
};

module.exports = Worker;
