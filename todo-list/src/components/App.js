import React, { Component } from 'react';
import PageTemplate from './PageTemplate';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

class App extends Component {
  state = {
    userTodo: ''
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      userTodo: value
    })
  }

  render() {
    const { userTodo } = this.state;
    const {
      handleChange
    } = this;
    console.log(this, 'class안에서 this는 파일 그자체 여기선 App');
    return (
      <div>
        <PageTemplate>
          <TodoInput onChange={handleChange} value={userTodo}></TodoInput>
          <TodoList></TodoList>
        </PageTemplate>
      </div>
    );
  }
}

export default App;