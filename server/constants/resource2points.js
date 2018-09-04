const RESOURCES = require('./resources');

const terrain2Resource = {
  [RESOURCES.NONE]: 0,
  [RESOURCES.RAREEARTH]: 5,
  [RESOURCES.METAL]: 2,
  [RESOURCES.HYDRATES]: 1,
  [RESOURCES.URANIUM]: 10,
  [RESOURCES.HOLE]: 0
};
Object.freeze(terrain2Resource);

module.exports = terrain2Resource;
