let digging = true;
const ROVER_ID = process.env.ROVER_ID || 1;
const MAX_ATTEMPTS = 10;
module.exports = (req, res, next) => {
  const errors = req.body.errors;
  if (errors) {
    console.log('errors', errors);
  }
  const rover = req.body.rovers ? req.body.rovers[0] : null;
  if (!rover) {
    console.log('wrong rover', req.body.rovers, req.body);
    res.json({error: 'no rovers data'});
  } else {
    digging = !digging;
    let randomX = 0;
    let randomY = 0;
    let attempt = 0;
    let cellDoesntExist = false;
    let cellNotEmpty = false;
    do {
      let randomMove = Math.floor(Math.random() * 8);
      if (randomMove > 3) randomMove++; // we want 0,1,2,3 5,6,7,8
      randomX = Math.floor(randomMove / 3);
      randomY = randomMove % 3;
      attempt++;
      cellDoesntExist = rover.area && rover.area[randomY][randomX] && (typeof rover.area[randomY][randomX].terrain === 'undefined'); // area[y][x] === {} for non existant cells
      cellNotEmpty = rover.area &&
        rover.area[randomY][randomX] &&
        rover.area[randomY][randomX].objects &&
        rover.area[randomY][randomX].objects.length !== 0;
    } while ((cellDoesntExist || cellNotEmpty) && attempt < MAX_ATTEMPTS);
    console.log(digging ? `move dx=${randomX - 1}, dy=${randomY - 1}` : 'dig');

    res.json([ digging
      ? {rover_id: ROVER_ID, action_type: 'move', moves: [{dx: randomX - 1, dy: randomY - 1}]}
      : {rover_id: ROVER_ID, action_type: 'dig'}
    ]);
  }
};
