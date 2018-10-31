import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

// 접두사를 통해 타입 중복 방지
const SET_INPUT = 'input/SET_INPUT';

export const setInput = createAction(SET_INPUT);

const initialState = Map({
  value: ''
});

export default handleActions({
  [SET_INPUT]: (state, action) => {
    return state.set('value', action.payload)
  }
}, initialState);