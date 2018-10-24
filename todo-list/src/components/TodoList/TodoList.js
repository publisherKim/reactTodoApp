import React, { Component } from 'react';
import TodoItem from '../TodoItem';

class TodoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.todosList !== nextProps.todosList;
  }
  render() {
    console.log(this.props);
    const { todos, onToggle, onRemove } = this.props;
    const todoList = todos.map(
      todo => (
        <TodoItem
          key = {todo.get('id')}
          done = {todo.get('done')}
          onToggle={() => onToggle(todo.get('id'))}
          onRemove={() => onRemove(todo.get('id'))}
        >
          {todo.get('text')}
        </TodoItem>
      )
    )
    return (
      <div>
        {todoList}
      </div>
    );
  }
}

export default TodoList;