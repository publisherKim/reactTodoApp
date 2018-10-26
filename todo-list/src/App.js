import React, { Component } from 'react';
import PageTemplate from './components/PageTemplate';
import TodoInput from './components/TodoInput/TodoInput';
import TodoList from './components/TodoList/TodoList';

const initialTodos = new Array(500).fill(0).map(
  (item, index) => ({id: index, text: `일정 ${item}${index}`, done: false})
);

class App extends Component {

  state = {
    input: '',
    todos: initialTodos
  }

  id = initialTodos.length;
  getId = () => {
    return ++this.id;
  }

  handleRemove = (id) => {
    const { todos } = this.state;
    const index = todos.findIndex( todo => todo.id === id);

    this.setState({
      todos: [
        ...todos.slice(0, index),
        ...todos.slice(index + 1, todos.length)
      ]
    });
  }

  handleToggle = (id) => {
    const { todos } = this.state;
    const index = todos.findIndex( todo => todo.id === id);

    // done값 할당
    const toggled = {
      ...todos[index],
      done: !todos[index].done
    }

    this.setState({
      todos: [
        ...todos.slice(0, index),
        toggled,
        ...todos.slice(index + 1, todos.length)
      ]
    });
  }

  handleInsert = () => {
    const { todos, input } = this.state;

    const newTodo = {
      text: input,
      done: false,
      id: this.getId()
    }

    this.setState({
      todos: [...todos, newTodo],
      input: ''
    });
  }

  handleChange = (e) => {
    const {value} = e.target;
    this.setState({
      input: value
    });
  }

  render() {
    const { input, todos } = this.state;
    const {
      handleChange,
      handleInsert,
      handleToggle,
      handleRemove
    } = this;

    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} onInsert={handleInsert} value={input}></TodoInput>
          <TodoList todos={todos} onToggle={handleToggle} onRemove={handleRemove}></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;
