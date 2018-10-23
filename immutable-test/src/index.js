import { List, Map, fromJS } from 'immutable';

const list = List([0, 1, 2, 3, 4]);
console.log(list);

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
console.log(list3.toJS());

// list 값 읽어오기
console.log(list.get(0));
console.log(list2.getIn([0, 'value']));

// list 아이템 수정
const newList = list.set(0, Map({value: 10}));
console.log(newList.toJS(), newList.getIn([0, 'value']));
const newList2 = newList.setIn([0, 'value'], 1);
console.log(newList2.toJS(), newList2.getIn([0, 'value']));
const newList3 = newList.update(0, item => item.set('value', item.get('value') * 5));
console.log(newList3.toJS(), newList3.getIn([0, 'value']));

