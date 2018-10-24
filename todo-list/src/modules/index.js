import input from './input.js';
import todos from './todos.js';
import { combineReducers } from 'redux';

export default combineReducers({
  input,
  todos
});