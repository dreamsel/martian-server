const FIELD_SIZE = 10;
const TERRAIN = {
  UNKNOWN: 0,
  PLAIN: 1,
  HILLS: 2,
  RIVER: 3,
}
Object.freeze(TERRAIN);

const field = new Array(FIELD_SIZE);
field.forEach(el => el = new Array(FIELD_SIZE));
field.forEach(row => row.forEach(el => el = TERRAIN.PLAIN));

//generating 2 mountains
const mount1 = {
  x: Math.floor(Math.random() * FIELD_SIZE),
  y: Math.floor(Math.random() * FIELD_SIZE)
}
const mount2 = {
  x: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount1.x < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
  y: Math.floor(Math.random() * FIELD_SIZE / 2) + ((mount1.y < FIELD_SIZE / 2) ? FIELD_SIZE / 2 : 0),
}
console.log(mount1, mount2);

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
      if ( Math.random() < (radius - dist) / radius) {
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
console.log('river', river);

let current = {x: river.x1, y: river.y1};

while(Math.abs(current.x - river.x2) > 1  || Math.abs(current.y - river.y2) > 1) {
  let candidates = [];
  for(let dx = -1; dx < 2; dx++ ) {
    for(let dy = -1; dy < 2; dy++) {
      if( current.x + dx >= 0
        && current.x + dx < FIELD_SIZE
        && current.y + dy >= 0
        && current.y + dy < FIELD_SIZE
        && field[current.x][current.y] != TERRAIN.RIVER) {
          candidates.push({x: current.x + dx, y: current.y + dy, dist: dist(current.x, current.y, river.x2, river.y2)})
        }
    }
  }
  candidates.sort((a,b) => b.dist - a.dist); //less distance close to end
  //we're going to select one of candidates at random, but those with less distance are more probable
  const parts_total = (1 + candidates.length)*candidates.length / 2;
  console.log('parts_total', parts_total);
  let rand = Math.floor(Math.random()*parts_total);
  let candidate = -1;
  for(let part = 1; part <= candidates.length; part++){
    rand = rand - part;
    if(rand < 0){
      candidate = part;
      break;
    }
  }
  console.log('candidate = ', candidate);
  current.x = candidate.x;
  current.y = candidate.y;
  field[current.x][current.y] = TERRAIN.RIVER;
}
