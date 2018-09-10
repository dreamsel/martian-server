const TERRAIN = require('./terrain');
const RESOURCES = require('./resources');

const terrain2Resource = {
  [TERRAIN.UNKNOWN]: RESOURCES.NONE,
  [TERRAIN.PLAIN]: RESOURCES.RAREEARTH,
  [TERRAIN.HILLS]: RESOURCES.METAL,
  [TERRAIN.RIVER]: RESOURCES.HYDRATES,
  [TERRAIN.CRATERS]: RESOURCES.URANIUM,
  [TERRAIN.BASE]: RESOURCES.NONE,
};
Object.freeze(terrain2Resource);

module.exports = terrain2Resource;
