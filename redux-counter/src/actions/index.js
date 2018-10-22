import * as types from './ActionTypes';

export const increment = () => ({
  type: types.INCREMENT
});

export const decrement = () => ({
  type: types.DECREMNET
});

export const setColor = (color) => ({
  type: types.SET_COLOR,
  color
});