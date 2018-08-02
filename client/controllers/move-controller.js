module.exports = (req, res, next) => {
    console.log('next move input', req.body);
    res.json([
	{action: 'move'},
	{action: 'dig'},
    ]);
}