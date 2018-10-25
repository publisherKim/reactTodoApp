import React, { Component } from 'react';
import PageTemplate from './components/PageTemplate';
import TodoInput from './components/TodoInput/TodoInput';
import TodoList from './components/TodoList/TodoList';

class App extends Component {
  state = {
    input: '',
    todos: [
      { id: 0, text: '리액트 공부하기', done: true },
      { id: 1, text: '카프카 공부하기 뒈질듯 ㅠㅠ', done: false }
    ]
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
      handleChange
    } = this;

    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} value={input}></TodoInput>
          <TodoList todos={todos}></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;
