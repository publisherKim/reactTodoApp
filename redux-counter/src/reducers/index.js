import color from './color';
import number from './number';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  numberData: number,
  colorData: color
});

export default reducers;