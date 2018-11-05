import React from 'react';
import { Route } from 'react-router-dom';
import {
  Home,
  About
} from 'pages';
import Menu from 'components/Menu';

const App = () => {
  return (
    <div>
      <Menu></Menu>
      <Route exact path="/" component={Home}></Route>
      <Route path="/about/:name?" component={About}></Route>
    </div>
  );
}

export default App;
