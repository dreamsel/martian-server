let digging = true;
module.exports = (req, res, next) => {
  console.log('next move input', req.body);
  digging = !digging;
  res.json([ digging
    ? {rover_id: 1, action_type: 'move', moves: [{dx: 1, dy: -1}, {dx: 0, dy: 1}]}
    : {rover_id: 1, action_type: 'dig'}
  ]);
};
