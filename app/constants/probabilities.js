const RESOURCES = require('./resources');

const PROBABILITIES = {
  [RESOURCES.RAREEARTH]: 0.1,
  [RESOURCES.METAL]: 0.3,
  [RESOURCES.HYDRATES]: 0.5,
  [RESOURCES.BASE]: 0,
};
Object.freeze(PROBABILITIES);

module.exports = PROBABILITIES;
