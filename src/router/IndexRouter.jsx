import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/login/Login';
import Detail from '../views/sandbox/news/Detail';
import News from '../views/sandbox/news/News';
import NewsSandBox from '../views/sandbox/NewsSandBox'

const IndexRouter = () => {
  return (
    <HashRouter>
      {/* router@5使用Switch来进行严格匹配路由 */}
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/news' component={News} />
        <Route path='/detail/:id' component={Detail} />
        {/* 未授权进行路由重定向 */}
        <Route path='/' render={() => localStorage.getItem("token") ? <NewsSandBox /> : <Redirect to="/login" />} />
        {/* <Route path="/" render={() =>
          localStorage.getItem("token") ? <NewsSandBox /> : <Redirect to="/login" />
        } /> */}
      </Switch>
    </HashRouter>
  );
};

export default IndexRouter;
