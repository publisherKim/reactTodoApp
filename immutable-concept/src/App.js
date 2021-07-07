import React, { Component } from 'react';
import Immutable from 'immutable';

const { Map } = Immutable;

const data = Map({
  a: 1,
  b: 2
});
console.log('Map 생성: ', data);

const data1 = Map({
  a: 1,
  b: 2,
  c: Map({
    d: 3,
    e: 4,
    f: 5
  })
});
console.log('Map 계층구조 생성: ', data1);

// 객체 상태가 복잡할 경우에는 fromJS를 통해서 만들자. 최적화보단 fromJS써도 된다.
const { fromJS } = Immutable;
const data2 = fromJS({
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
    f: 5
  }
});
console.log('fromJS: ',  data2);

// 자바스크립트 객체로 변환
const deserialized = data2.toJS();
console.log('deserialized: ', deserialized);


// 특정키의 값 불러오기
console.log(data2.get('a'));

// 계층구조가 깊을때 불러오기
console.log(data2.getIn(['c', 'd']));

// 값 설정
const newData = data2.set('a', 4);
console.log(newData.get('a'));
console.log('두개의 데이터는 같은 참조를 가지지 않는다.: ', newData === data2);

// 깊숙이 위치하는 값 수정
const newData2 = data2.setIn(['c', 'd'], 10);
console.log(newData2.getIn(['c', 'd']));

// 여러 값 동시에 설정
const newData3 = data2.mergeIn(['c'], { d: 5, e: 1});
console.log(newData3.getIn(['c', 'd']));
console.log(newData3.getIn(['c', 'e']));

const newData4 = data2.merge({a: 1, b: 2});
console.log(newData4.get('a'));
console.log(newData4.get('b'));

const newData5 = data2.setIn(['c', 'd'], 20)
                      .setIn(['c', 'e'], 7);
console.log(newData5.getIn(['c', 'd']));
console.log(newData5.getIn(['c', 'e']));

const { List } = Immutable;
const list = List([0, 1, 2, 3, 4]);
console.log(list);

const list2 = List([
  Map({ value: 1}),
  Map({ value: 2 })
]);
console.log(list2, list2.toJS());

const list3 = fromJS([
  { value: 1 },
  { value: 2 }
])
console.log(list3, list3.toJS());

// 값 읽어오기
list2.get(0);
console.log(list2.get(0));
console.log(list2.getIn([0, 'value']));

// 아이템 수정
// 원소를 통으로 바꾸고 싶을때
const newList = list2.set(0, Map({ value: 5 }));
console.log(newList.getIn([0, 'value']));

// 내부의 값만 변경
const newList2 = list2.setIn([0, 'value'], 3);
console.log(newList2.getIn([0, "value"]));

// update 활용
const newList3 = list2.update(0, item => item.set('value', item.get('value') * 10));
console.log(newList3.getIn([0, 'value']));

const newList4 = list2.setIn([0, 'value'], list2.getIn([1, 'value']) * 2);
console.log(newList4.getIn([0, 'value']));

// 아이템 추가
const newList5 = list2.push(Map({ value: 3}));
console.log(newList5.getIn([2, 'value']));
const newList6 = list2.unshift(Map({ value: 0}));
console.log(newList6.toJS());

// 아이템 제거
const newList7 = list2.delete(1);
console.log(newList7.getIn([1, 'value']), newList7.toJS());

const newList8 = list2.shift();
console.log(newList8.getIn([0, 'value']), newList8.toJS());

const newList9 = list2.pop();
console.log(newList9.getIn([0, 'value']), newList9.toJS());


// List 크기 가져오기
console.log(list2.size);
console.log(list2.isEmpty());
class App extends Component {
  render() {
    return (
      <div className="App">
        immtable concept console을 통해 익히기
      </div>
    );
  }
}

export default App;
