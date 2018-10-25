import React, { Component } from 'react';
import PageTemplate from './components/PageTemplate';
import TodoInput from './components/TodoInput/TodoInput';

class App extends Component {
  render() {
    return (
      <div>
        <PageTemplate>
          <TodoInput></TodoInput>
        </PageTemplate>
      </div>
    );
  }
}

export default App;
