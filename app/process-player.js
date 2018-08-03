const RESOURCES = require('./constants/resources');
const resource2points = require('./constants/resource2points');
const ROVER = require('./constants/rover');
const ERRORS = require('./constants/errors');
const OBJECTS = require('./constants/objects');
const TERRAIN = require('./constants/terrain');

function processPlayerMove (roversActions, player, fieldData, players) {
  console.log('processPlayerMove', roversActions, player);

  const response = { errors: {}, rovers: {} };
  roversActions.slice(0, player.max_rovers).forEach(action => {
    const rover = player.rovers.find(rover => rover.id === action.rover_id);
    if (rover && !rover.processed) {
      switch (action.action_type) {
        case 'move':
          action.moves.slice(ROVER.MAX_MOVES).forEach((move, index) => {
            // check if this move is possible;
            if (rover.energy <= 0) {
              response.errors[rover.id][index] = {code: ERRORS.NO_ENERGY, message: 'lack of energy, please charge'};
            } else if (![-1, 0, 1].includes(rover.x) ||
            ![-1, 0, 1].includes(rover.y)) {
              response.errors[rover.id][index] = {code: ERRORS.WRONG_MOVE, message: 'wrong move'};
            } else {
              const newX = rover.x + move.params.x;
              const newY = rover.y + move.params.y;
              if (newX < 0 || newX >= fieldData.FIELD_SIZE ||
                newY < 0 || newY >= fieldData.FIELD_SIZE) {
                response.errors[rover.id][index] = {code: ERRORS.OUT_OF_BOUND, message: 'move out of bound'};
              } else if (fieldData.field[newY][newX] === TERRAIN.BASE && (rover.x !== player.base.x || rover.y !== player.base.y)) {
                response.errors[rover.id][index] = {code: ERRORS.NO_MOVE_TO_FOREIGN_BASE, message: 'cannot move to foreign base'};
              } else if (players.some(otherplayer =>
                otherplayer.rovers.some(otherrover => // including also other rovers of same player
                  otherrover.x === newX && otherrover.y === newY
                ))) {
                response.errors[rover.id][index] = {code: ERRORS.NO_MOVE_TO_FOREIGN_ROVER, message: 'cannot move, tile occupied by other rover'};
              } else {
                rover.x = newX;
                rover.y = newY;
                rover.energy -= 1;
                if (rover.x === player.base.x && rover.y === player.base.y) {
                  rover.energy = ROVER.MAX_ENERGY;
                  rover.load.forEach(resource => {
                    player.resources[resource] += 1;
                  });
                  rover.load = [];
                }
              }
            }
          });
          break;
        case 'dig':
          if (rover.x === player.base.x && rover.y === player.base.y) {
            response.errors[rover.id] = {code: ERRORS.CANT_DIG_ON_BASE, message: 'cannot dig on base'};
          } else if (rover.energy <= 0) {
            response.errors[rover.id] = {code: ERRORS.NO_ENERGY, message: 'lack of energy, please charge'};
          } else if (rover.load.length >= ROVER.MAX_LOAD) {
            response.errors[rover.id] = {code: ERRORS.NO_SPACE_FOR_RESOURCE, message: 'no more space in trunk'};
          } else if (fieldData.resources[rover.y][rover.x] !== RESOURCES.NONE) {
            const resource = fieldData.resources[rover.y][rover.x];
            rover.load.push(resource);
            player.points += resource2points(resource);
            fieldData.resources[rover.y][rover.x] = RESOURCES.HOLE; // there was already dug here
          }
          break;
        case 'charge':
          rover.energy += ROVER.CHARGE_IN_FIELD;
          break;
      }

      // TODO prepare info about new state of rover and its surroundings (may be other player dig smth)
      const area = [[], [], []];
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const fieldX = rover.x + x - 1;
          const fieldY = rover.y + y - 1;
          if (fieldX >= 0 && fieldX < fieldData.FIELD_SIZE &&
            fieldY >= 0 && fieldY < fieldData.FIELD_SIZE) {
            area[y][x] = {
              terrain: fieldData.field[fieldY][fieldX],
              objects: []
            };
            players.forEach(otherplayer => {
              if (otherplayer.rovers.some(otherrover => fieldX === otherrover.x && fieldY === otherrover.y)) {
                area[y][x].objects.push(OBJECTS.ROVER);
              };
              if (fieldX === otherplayer.base.x && fieldY === otherplayer.base.y) {
                area[y][x].objects.push(OBJECTS.BASE);
              }
            });
          } else {
            area[y][x] = {};
          }
        }
      }

      response.rovers[rover.id] = { ...rover, area };
    } else {
      response.errors[rover.id] = {code: ERRORS.WRONG_ROVER_ID, message: `wrong rover id ${rover.id}`};
    }
    rover.processed = true;
  });
  return response;
}

module.exports = processPlayerMove;
