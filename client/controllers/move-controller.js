const fs = require('fs');

let digging = true;
const ROVER_ID = process.env.ROVER_ID || 1;
const MAX_ATTEMPTS = 10;
const MAX_LOAD = 3;

const base = {};
const log = fs.createWriteStream('child-moveController.log');
module.exports = (req) => {
  const errors = req.errors;
  if (Object.keys(errors).length > 0) {
    log.write(`errors ${JSON.stringify(errors)}\n`);
  }
  const rover = req.rovers ? req.rovers[0] : null;
  if (!rover) {
    log.write(`wrong rover=${rover}, rovers=${JSON.stringify(req.rovers)} \n`);
    return {error: 'no rovers data'};
  } else {
    if (typeof base.x === 'undefined' && typeof base.y === 'undefined') {
      base.x = rover.x;
      base.y = rover.y;
    }
    if (rover.energy > 0) {
      if (rover.load && rover.load.length >= MAX_LOAD) { // moving home
        const dx = rover.x < base.x ? 1 : rover.x > base.x ? -1 : 0;
        const dy = rover.y < base.y ? 1 : rover.y > base.y ? -1 : 0;
        return [{rover_id: ROVER_ID, action_type: 'move', dx, dy}];
      } else {
        digging = !digging;
        if (digging) {
          return [{ rover_id: ROVER_ID, action_type: 'dig' }];
        } else {
          let randomX = 0;
          let randomY = 0;
          let attempt = 0;

          let cellNotEmpty = false;
          do {
            let randomMove = Math.floor(Math.random() * 8);
            if (randomMove > 3) randomMove++; // we want 0,1,2,3 5,6,7,8
            randomX = Math.floor(randomMove / 3);
            randomY = randomMove % 3;
            attempt++;

            cellNotEmpty = rover.area &&
              rover.area[randomY][randomX] &&
              rover.area[randomY][randomX].objects &&
              rover.area[randomY][randomX].objects.length !== 0;
          } while (cellNotEmpty && attempt < MAX_ATTEMPTS); // go to buzy cells if no viable move was found during 10 attempts

          return [{rover_id: ROVER_ID, action_type: 'move', dx: randomX - 1, dy: randomY - 1}];
        }
      }
    } else {
      return [{rover_id: ROVER_ID, action_type: 'charge'}];
    }
  }
};
