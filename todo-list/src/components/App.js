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

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      userTodo: value
    })
  }

  render() {
    const { userTodo, todosList } = this.state;
    const {
      handleChange
    } = this;

    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} value={userTodo}></TodoInput>
          <TodoList todosList={todosList}></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;