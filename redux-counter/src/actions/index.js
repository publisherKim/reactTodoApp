import * as types from './ActionTypes';

export const creative = (color) => ({
  type: types.CREATE,
  color
});

export const remove = () => ({
  type: types.REMOVE
});

export const increment = () => ({
  type: types.INCREMENT
});

export const decrement = () => ({
  type: types.DECREMENT
});

export const setColor = (color) => ({
  type: types.SET_COLOR,
  color
});

// 변수이름에 객체를 할당한다.
// 굳이 ActionTypes을 따로 빼야 한다는 생각도 들지만 관리의 용이성이라고 해두자.