const {generate_field: generateField, generate_resources: generateResources} = require('./field-generate');
/*
const level1 = require('./level1.js');
const level2 = require('./level2.js');
const level3 = require('./level3.js');
const level4 = require('./level4.js');
const level5 = require('./level5.js');
const level6 = require('./level1.js');
const level7 = require('./level1.js');
const level8 = require('./level1.js');
const level9 = require('./level1.js');
const level10 = require('./level1.js');
const levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];
*/
const levelsNames = ['./level1.js', './level1.js', './level1.js', './level1.js', './level1.js',
  './level1.js', './level1.js', './level1.js', './level1.js', './level1.js'];

module.exports = {
  generate (FIELD_SIZE) {
    const field = generateField(FIELD_SIZE);
    return {...field, resources: generateResources(field.field)};
  },
  predefined (level) {
    return require(levelsNames[level - 1]);
  //  return levels[level - 1];
  }
};
