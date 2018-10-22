import React, { Component } from 'react';
import PageTemplate from './PageTemplate';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

const initialTodosList = new Array(500).fill(0).map(
  (foo, index) => ({
    id: index,
    text: `일정 ${index}`,
    done: false
  })
);

class App extends Component {
  state = {
    userTodo: '',
    todosList: initialTodosList
  }

  getId = () => {
    return this.state.todosList.length;
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      userTodo: value
    })
  }

  // new data add
  handleInsert = () => {
    const { userTodo, todosList } = this.state;

    const newTodo = {
      text: userTodo,
      done: false,
      id: this.getId()
    }

    this.setState({
      todosList: [...todosList, newTodo],
      userTodo: ''
    });
  }

  handleToggle = (id) => {
    const {todosList} = this.state;
    const index = todosList.findIndex( item => item.id === id);

    const toggled = {
      ...todosList[index],
      done: !todosList[index].done
    };

    this.setState({
      todosList: [
        ...todosList.slice(0, index),
        toggled,
        ...todosList.slice(index + 1, todosList.length)
      ]
    })
  }

  handleRemove = (id) => {
    const {todosList} = this.state;
    const index = todosList.findIndex( item => item.id === id);

    this.setState({
      todosList: [
        ...todosList.slice(0, index),
        ...todosList.slice(index + 1, todosList.length)
      ]
    })
  }

  render() {
    const { userTodo, todosList } = this.state;
    const {
      handleChange,
      handleInsert,
      handleToggle,
      handleRemove
    } = this;

    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} onInsert={handleInsert} value={userTodo}></TodoInput>
          <TodoList todosList={todosList} onToggle={handleToggle} onRemove={handleRemove}></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;