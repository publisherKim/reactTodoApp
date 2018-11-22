import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ListPage, PostPage, EditorPage, NotFoundPage } from 'pages';
import Base from 'containers/common/Base';

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={ListPage}></Route>
        <Route exact path="/page/:page" component={ListPage}></Route>
        <Route exact path="/tag/:tag/:page?" component={ListPage}></Route>
        <Route exact path="/post/:id" component={PostPage}></Route>
        <Route exact path="/editor" component={EditorPage}></Route>
        <Route component={NotFoundPage}></Route>
      </Switch>
      <Base></Base>
    </div>
  );
};

export default App;