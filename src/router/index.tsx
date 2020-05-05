import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Dashboard from '../Pages/Dashboard';
import Repository from '../Pages/Repository';

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/repositories/:repository+" component={Repository} />
    </Switch>
  </BrowserRouter>
);

export default Router;
