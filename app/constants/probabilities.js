const RESOURCES = require('./resources');

const PROBABILITIES = {
  [RESOURCES.RAREEARTH]: 0.01,
  [RESOURCES.METAL]: 0.1,
  [RESOURCES.HYDRATES]: 0.2,
  [RESOURCES.BASE]: 0,
};
Object.freeze(PROBABILITIES);

module.exports = PROBABILITIES;
