const TERRAIN = {
  UNKNOWN: 0,
  PLAIN: 1,
  HILLS: 2,
  RIVER: 3,
  CRATER: 4,
  MOUNTAIN: 5, // unpassable
  BASE: 6
};
Object.freeze(TERRAIN);

module.exports = TERRAIN;
