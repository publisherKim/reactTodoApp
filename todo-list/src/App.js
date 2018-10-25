import React, { Component } from 'react';
import PageTemplate from './components/PageTemplate';
import TodoInput from './components/TodoInput/TodoInput';
import TodoList from './components/TodoList/TodoList';

class App extends Component {
  render() {
    return (
      <div>
        <PageTemplate>
          <TodoInput></TodoInput>
          <TodoList></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;
