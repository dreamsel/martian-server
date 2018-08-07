const RESOURCES = require('./constants/resources');
const resource2points = require('./constants/resource2points');
const ROVER = require('./constants/rover');
const ERRORS = require('./constants/errors');
const OBJECTS = require('./constants/objects');
const TERRAIN = require('./constants/terrain');

function processPlayerMove (roversActions, player, fieldData, players) {
  const response = { errors: {}, rovers: [], FIELD_SIZE: fieldData.FIELD_SIZE };
  if (!Array.isArray(roversActions)) {
    console.log('probably error ', roversActions.error, roversActions);
    return {errors: 'wrong rover actions', rovers: player.rovers};
  }
  roversActions.slice(0, player.max_rovers).forEach(action => {
    const rover = player.rovers.find(rover => rover.id == action.rover_id); /* eslint-disable-line eqeqeq */
    if (rover) {
      switch (action.action_type) {
        case 'move':
          response.errors[rover.id] = [];
          action.moves.slice(0, ROVER.MAX_MOVES).forEach((move, index) => {
            // check if this move is possible;
            if (rover.energy <= 0) {
              response.errors[rover.id][index] = {code: ERRORS.NO_ENERGY, message: 'lack of energy, please charge'};
            } else if (![-1, 0, 1].includes(move.dx) ||
            ![-1, 0, 1].includes(move.dy)) {
              response.errors[rover.id][index] = {code: ERRORS.WRONG_MOVE, message: 'wrong move'};
            } else {
              const newX = rover.x + move.dx;
              const newY = rover.y + move.dy;
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
                if (rover.x === player.base.x && rover.y === player.base.y) { // rover came to own base
                  rover.energy = ROVER.MAX_ENERGY;
                  rover.load.forEach(resource => {
                    player.resources[resource] += 1;
                  });
                  rover.load = [];
                }
                console.log('processed rover move', newX, newY);
              }
            }
          });
          break;
        case 'dig':
          if (rover.x === player.base.x && rover.y === player.base.y) {
            response.errors[rover.id] = {code: ERRORS.CANT_DIG_ON_BASE, message: 'cannot dig on base'};
          } else if (rover.energy <= 0) {
            response.errors[rover.id] = {code: ERRORS.NO_ENERGY, message: 'lack of energy, please charge'};
            console.log('lack of energy');
          } else if (rover.load.length >= ROVER.MAX_LOAD) {
            response.errors[rover.id] = {code: ERRORS.NO_SPACE_FOR_RESOURCE, message: 'no more space in trunk'};
            console.log('no more space in trunk');
          } else if (fieldData.resources[rover.y][rover.x] !== RESOURCES.NONE &&
              fieldData.resources[rover.y][rover.x] !== RESOURCES.HOLE) {
            const resource = fieldData.resources[rover.y][rover.x];
            rover.load.push(resource);
            player.points += resource2points[resource];
            fieldData.resources[rover.y][rover.x] = RESOURCES.HOLE; // there was already dug here
            console.log('dig at ', rover.x, rover.y);
          } else {
            fieldData.resources[rover.y][rover.x] = RESOURCES.HOLE; // there was already dug here
            console.log('dig at ', rover.x, rover.y);
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
              objects: fieldData.resources[fieldY][fieldX] === RESOURCES.HOLE ? [OBJECTS.HOLE] : []
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

      response.rovers.push({ ...rover, area });
    } else {
      response.errors[action.rover_id] = {code: ERRORS.WRONG_ROVER_ID, message: `wrong rover id ${action.rover_id}`};
    }
  });

  return response;
}

module.exports = processPlayerMove;
