import React, { Component } from 'react';
import TodoItem from '../TodoItem';

class TodoList extends Component {
  render() {
    const { todosList, onToggle, onRemove } = this.props;
    const todoList = todosList.map(
      todo => (
        <TodoItem
          key = {todo.id}
          done = {todo.done}
          onToggle={() => onToggle(todo.id)}
          onRemove={() => onRemove(todo.id)}
        >
          {todo.text}
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