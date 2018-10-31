import React, { Component } from 'react';
import TodoList from '../components/TodoList';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as todosActions from '../modules/todos';

class TodoListContainer extends Component {
  render() {
    return (
      <TodoList></TodoList>
    );
  }
}

export default connect(
  (state) => ({
    todos: state.todos
  }),
  (dispatch) => ({
    TodosActions: bindActionCreators(todosActions, dispatch)
  })
)(TodoListContainer);