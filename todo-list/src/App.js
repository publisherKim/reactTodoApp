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

  id = 1;
  getId = () => {
    return ++this.id;
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
      handleInsert
    } = this;

    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} onInsert={handleInsert} value={input}></TodoInput>
          <TodoList todos={todos}></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;
