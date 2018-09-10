const RESOURCES = require('./constants/resources');
const resource2points = require('./constants/resource2points');
const ROVER = require('./constants/rover');
const ERRORS = require('./constants/errors');
const OBJECTS = require('./constants/objects');
const TERRAIN = require('./constants/terrain');

function processPlayerMove (roversActions, player) {
  const fieldData = player.fieldData;
  const response = { errors: {}, base: player.base, rovers: player.rovers, FIELD_SIZE: fieldData.FIELD_SIZE };
  if (!Array.isArray(roversActions)) {
    console.log('probably error ', roversActions ? roversActions.error : '', roversActions);
    response.errors = 'wrong rover actions';
    return response;
  }
  roversActions.slice(0, player.max_rovers).forEach(action => { // TODO handle 2 actions for same rover
    const rover = player.rovers.find(rover => rover.id == action.rover_id); /* eslint-disable-line eqeqeq */
    if (rover) {
      switch (action.action_type) {
        case 'move':
          // check if this move is possible;
          if (rover.energy <= 0) {
            response.errors[rover.id] = {code: ERRORS.NO_ENERGY, message: 'lack of energy, please charge'};
          } else if (![-1, 0, 1].includes(action.dx) ||
          ![-1, 0, 1].includes(action.dy)) {
            response.errors[rover.id] = {code: ERRORS.WRONG_MOVE, message: 'wrong move'};
          } else {
            const newX = (rover.x + action.dx + fieldData.FIELD_SIZE) % fieldData.FIELD_SIZE; // make field round connected
            const newY = (rover.y + action.dy + fieldData.FIELD_SIZE) % fieldData.FIELD_SIZE;

            if (fieldData.field[newY][newX] === TERRAIN.MOUNTAIN) {
              response.errors[rover.id] = {code: ERRORS.NO_MOVE_TO_MOUNTAIN, message: 'cannot move to mountain'};
            } else if (player.rovers.some(otherrover => // including also other rovers of same player
              otherrover.x === newX && otherrover.y === newY
            )) {
              response.errors[rover.id] = {code: ERRORS.NO_MOVE_TO_FOREIGN_ROVER, message: 'cannot move, tile occupied by other rover'};
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
            rover.energy -= 1;
            console.log('dig at ', rover.x, rover.y, 'got', rover.load);
          } else {
            fieldData.resources[rover.y][rover.x] = RESOURCES.HOLE; // there was already dug here
            rover.energy -= 1;
            console.log('dig empty at ', rover.x, rover.y);
          }
          break;
        case 'charge':
          rover.energy += ROVER.CHARGE_IN_FIELD;
          break;
      }

      // prepare info about new state of rover and its surroundings (may be other player dig smth)
      const area = [[], [], []];
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const fieldX = (rover.x + x - 1 + fieldData.FIELD_SIZE) % fieldData.FIELD_SIZE;
          const fieldY = (rover.y + y - 1 + fieldData.FIELD_SIZE) % fieldData.FIELD_SIZE;

          area[y][x] = {
            terrain: fieldData.field[fieldY][fieldX],
            objects: fieldData.resources[fieldY][fieldX] === RESOURCES.HOLE ? [OBJECTS.HOLE] : []
          };
          if (player.rovers.some(otherrover => fieldX === otherrover.x && fieldY === otherrover.y)) {
            area[y][x].objects.push(OBJECTS.ROVER);
          };
          if (fieldX === player.base.x && fieldY === player.base.y) {
            area[y][x].objects.push(OBJECTS.BASE);
          }
        }
      }

      rover.area = area;
    } else {
      response.errors[action.rover_id] = {code: ERRORS.WRONG_ROVER_ID, message: `wrong rover id ${action.rover_id}`};
    }
  });

  return response;
}

module.exports = processPlayerMove;
