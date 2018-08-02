const TERRAIN = {
  UNKNOWN: 0,
  PLAIN: 1,
  HILLS: 2,
  RIVER: 3,
}
Object.freeze(TERRAIN);


const RESOURCES = {
  NONE: 0,
  RAREEARTH: 1,
  METAL: 2,
  HYDRATES: 3
}
Object.freeze(RESOURCES);

const PROBABILITIES = {
  [RESOURCES.RAREEARTH]: 0.01,
  [RESOURCES.METAL]: 0.1,
  [RESOURCES.HYDRATES]: 0.2
}
Object.freeze(PROBABILITIES);

const terrain2Resource = {
  [TERRAIN.UNKNOWN] : RESOURCES.NONE,
  [TERRAIN.PLAIN]: RESOURCES.RAREEARTH,
  [TERRAIN.HILLS]: RESOURCES.METAL,
  [TERRAIN.RIVER]: RESOURCES.HYDRATES,
}
Object.freeze(terrain2Resource);

module.exports = (FIELD_SIZE) => {
  //const FIELD_SIZE = 10;

  const field = new Array(FIELD_SIZE);
  for( let i = 0; i < FIELD_SIZE; i++) {
    field[i] = new Array(FIELD_SIZE);
    for( let j = 0; j < FIELD_SIZE; j++) {
      field[i][j] = TERRAIN.PLAIN;
    }
  }


  //generating 2 mountains
  const mount1 = {
    x: Math.floor(Math.random() * FIELD_SIZE),
    y: Math.floor(Math.random() * FIELD_SIZE)
  }
  const mount2 = {
    x: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount1.x < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
    y: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount1.y < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
  }


  //generating hills

  const radius = Math.floor(FIELD_SIZE * 0.3);
  const dist = (x1,y1, x2, y2) => Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
  for( let x = 0; x < FIELD_SIZE; x++)
    for( let y = 0; y < FIELD_SIZE; y++){
      let d = dist (mount1.x, mount1.y, x, y);
      if( d <= radius ) {
        if ( Math.random() < (radius - dist) / radius) {
          field[x][y] = TERRAIN.HILLS;
        }
      }
      d = dist (mount2.x, mount2.y, x, y);
      if( d <= radius ) {
        if ( Math.random() < (radius - d) / radius) {
          field[x][y] = TERRAIN.HILLS;
        }
      }
    }


  //generating river
  const river = {
    x1: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount1.x < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
    y1: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount2.y < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
    x2: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount2.x < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
    y2: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount1.y < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
  };


  let current = {x: river.x1, y: river.y1};
  field[river.x1][river.y1] = TERRAIN.RIVER;
  while(Math.abs(current.x - river.x2) > 1  || Math.abs(current.y - river.y2) > 1) {
    let candidates = [];
    for(let dx = -1; dx < 2; dx++ ) {
      for(let dy = -1; dy < 2; dy++) {
        const newx = current.x + dx;
        const newy = current.y + dy;
        if( newx >= 0
          && newx + dx < FIELD_SIZE
          && newy >= 0
          && newy + dy < FIELD_SIZE
          && field[newx][newy] != TERRAIN.RIVER) {
            candidates.push({x: newx, y: newy, dist: dist(newx, newy, river.x2, river.y2)})
          }
      }
    }
    candidates.sort((a,b) => b.dist - a.dist); //less distance close to end
    //we're going to select one of candidates at random, but those with less distance are more probable
    const parts_total = (1 + candidates.length)*candidates.length / 2;
    let rand = Math.floor(Math.random()*parts_total);
    let candidate = -1;
    for(let part = 1; part <= candidates.length; part++){
      rand = rand - part;
      if(rand < 0){
        candidate = part;
        break;
      }
    }
    if(candidate > 0) {
      current.x = candidates[candidate-1].x;
      current.y = candidates[candidate-1].y;
      field[current.x][current.y] = TERRAIN.RIVER;
    }
    else{
      break;
    }
  }
  field[river.x2][river.y2] = TERRAIN.RIVER;//to be 100% sure

  const generateResource = (terrainType) => Math.random() < PROBABILITIES[terrain2Resource[terrainType]] ?
                            terrain2Resource[terrainType] : RESOURCES.NONE;

  const resources = field.map(row => row.map(el => generateResource(el)));

  console.log(field);
  return {field, resources};
}
