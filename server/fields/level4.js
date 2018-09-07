const TERRAIN = require('../constants/terrain');
const RESOURCES = require('../constants/resources');

const P = TERRAIN.PLAIN;
const H = TERRAIN.HILLS;
const R = TERRAIN.RIVER;
const C = TERRAIN.CRATER;
const M = TERRAIN.MOUNTAIN;
const B = TERRAIN.BASE;

const n = RESOURCES.NONE;
const p = RESOURCES.RAREEARTH;
const h = RESOURCES.METAL;
const r = RESOURCES.HYDRATES;
const c = RESOURCES.URANIUM;

module.exports = {
  field: [
    [C, C, C, C, M, C, M, C, C, M, C, C, C],
    [C, C, P, M, M, P, M, P, M, M, M, M, C],
    [C, M, R, R, P, P, P, H, H, H, P, M, C],
    [M, M, P, P, R, R, R, P, H, H, P, C, C],
    [C, M, P, P, P, R, R, R, P, P, P, M, M],
    [C, M, P, P, P, P, B, P, R, P, P, C, C],
    [C, C, P, P, H, P, P, P, P, R, R, M, M],
    [C, M, P, H, H, H, P, P, P, R, R, C, C],
    [C, M, P, H, H, P, P, P, P, R, P, M, C],
    [M, M, H, H, P, M, P, M, P, P, R, M, C],
    [C, C, P, M, P, M, P, M, M, M, P, M, C],
    [C, C, P, M, M, M, P, M, C, C, P, C, C],
  ],
  resources: [
    [c, n, n, c, n, n, n, n, c, n, c, n, n],
    [n, n, p, n, n, p, n, p, n, n, n, n, n],
    [c, n, n, n, n, n, n, n, h, n, p, n, c],
    [n, n, n, p, n, n, r, n, n, n, n, n, n],
    [c, n, n, n, n, r, n, r, n, n, n, n, n],
    [n, n, p, n, n, n, n, n, r, n, p, n, c],
    [n, c, n, n, n, n, n, p, n, r, n, n, n],
    [c, n, p, n, h, n, n, n, p, n, r, n, n],
    [n, n, n, n, n, p, n, n, n, n, n, n, n],
    [n, n, h, n, n, n, n, n, p, n, n, n, c],
    [c, n, n, n, n, n, n, n, n, n, p, n, n],
    [n, n, p, n, n, n, p, n, c, n, n, n, c],
  ],
  FIELD_SIZE: 12
};
