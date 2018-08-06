let digging = true;
const ROVER_ID = process.env.ROVER_ID || 1;

module.exports = (req, res, next) => {
  console.log('next move input', req.body);
  digging = !digging;
  let randomMove = Math.floor(Math.random() * 8);
  if (randomMove > 3) randomMove++; // we want 0,1,2,3 5,6,7,8
  const randomX = Math.floor(randomMove / 3) - 1;
  const randomY = randomMove % 3 - 1;
  console.log(digging ? `move dx=${randomX}, dy=${randomY}` : 'dig');
  res.json([ digging
    ? {rover_id: ROVER_ID, action_type: 'move', moves: [{dx: randomX, dy: randomY}, {dx: randomY, dy: randomX}]}
    : {rover_id: ROVER_ID, action_type: 'dig'}
  ]);
};
