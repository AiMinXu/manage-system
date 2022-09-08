import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from '../views/Login/Login';
import NewsSandBox from '../views/NewsSandBox/NewsSandBox';
const IndexRouter = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" render={() => (localStorage.getItem("token") ? <NewsSandBox /> : <Redirect to="/login" />)} />
      </Switch>
    </HashRouter>
  );
};

export default IndexRouter;
