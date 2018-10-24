import React, { Component } from 'react';
import TodoInput from '../components/TodoInput';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as inputActions from '../modules/input';
import * as todosActions from '../modules/toods';

class TodoInputContainer extends Component {
  render() {
    return (
      <div>
        <TodoInput></TodoInput>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    values: state.input.get('value')
  }),
  dispatch => ({
    InputActions: bindActionCreators(inputActions, dispatch),
    TodosActions: bindActionCreators(todosActions, dispatch)
  })
)(TodoInputContainer);

