import React, { Component } from 'react';
import PageTemplate from './components/PageTemplate';
import TodoInput from './components/TodoInput/TodoInput';
import TodoList from './components/TodoList/TodoList';

class App extends Component {
  state = {
    input: ''
  }

  handleChange = (e) => {
    const {value} = e.target;
    this.setState({
      input: value
    });
  }

  render() {
    const { input } = this.state;
    const {
      handleChange
    } = this;
    // handleChange  => this.handleChange 와 동치 문장이다.
    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} value={input}></TodoInput>
          <TodoList></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;
