import { fromJS } from 'immutable';

const data = fromJS({
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
    f: 5
  }
});
console.log(data);

// Immutable 객체를 일반 객체 형태로 변영하기
const deserialized = data.toJS();
console.log(deserialized);

// 특정키의 값 불러오기
const depth1 = data.get('a');
const depth2 = data.getIn(['c', 'd']);
console.log(depth1, depth2);

// 특정키의 값 세팅하기
const newData = data.set('a', 4);
console.log(newData === data);
const depthly = data.setIn(['c', 'd'], 4);
console.log(depthly.getIn(['c', 'd']));

// 여러 값 동시에 설정
const newData2 = data.mergeIn(['c'], { d: 10, e: 5});
console.log(newData2.getIn(['c', 'd']), newData2.getIn(['c', 'e']));
const newData3 = data.setIn(['c', 'd'], 1).setIn(['c', 'e'], 4);
console.log(newData3.getIn(['c', 'd']), newData3.getIn(['c', 'e']));

// 최상위 값 설정
const newData4 = data.merge({a: 10, b: 20});
console.log(newData4.getIn('a'), newData4.getIn('b'));
