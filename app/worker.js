const fetch = require('node-fetch');
const processPlayerMove = require('./process-player');
const TERRAIN = require('./constants/terrain');
const RESOURCES = require('./constants/resources');

let processIPs = (players, fieldData) => {
  players.forEach(player => {
    fetch(player.url)
      .then(res => res.json())
      .then(text => console.log('fetch result', text))
      .catch(e => console.log(`fetching ${player.url} err`, e.message));
    fetch(player.url + '/move', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({a: 1, b: 'Textual content'})
    })
      .then(res => res.json())
      .then(resultJson => processPlayerMove(resultJson, player, fieldData, players))
      .catch(e => console.log(`fetching ${player.url} err`, e.message));
  });
  setTimeout(processIPs, 1000);
};

const Worker = (players, fieldData) => {
  players.forEach(player => {
    fieldData.field[player.base.y][player.base.x] = TERRAIN.BASE;
    fieldData.resources[player.base.y][player.base.x] = RESOURCES.NONE;
  });
  processIPs = processIPs.bind(null, players, fieldData);
  setTimeout(processIPs, 1000);
};

module.exports = Worker;
