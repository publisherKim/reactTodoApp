import { Map } from 'immutable';

let object1 = Map({
  a: 1,
  b: 2,
  c: 3,
  d: Map({
    e: 4,
    f: Map({
      g: 5,
      h: 6
    })
  })
});

let object2 = object1.setIn(['d', 'f', 'h'], 10);
console.log(object1 === object2, object1, object2);

const data = Map({
  a: 1,
  b: 2,
  c: Map({
    d: 3,
    e: 4,
    f: 5
  })
});
console.log(data);