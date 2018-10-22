import React, { Component } from 'react';
import PageTemplate from './PageTemplate';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

class App extends Component {
  state = {
    userTodo: '',
    todosList: [
      { id: 0, text: '리액트 공부하기', done: true },
      { id: 1, text: '컴포넌트 스라일링 해보기', done: false }
    ]
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