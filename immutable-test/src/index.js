import { List, Map, fromJS } from 'immutable';

const list1 = List([0, 1, 2, 3, 4]);
console.log(list1);

const list2 = List([
  Map({value: 1}),
  Map({value: 2})
]);
console.log(list2);

const list3 = fromJS([
  {value: 3},
  {value: 4}
]);
console.log(list3);