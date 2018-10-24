import input from './input.js';
import todo from './todo.js';
import { combineReducers } from 'redux';

export default combineReducers({
  input,
  todo
});