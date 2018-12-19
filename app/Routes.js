import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import QueueMonitor from './containers/QueueMonitor';

export default () => (
  <App>
    <Switch>
      <Route path={routes.MAIN} component={QueueMonitor} />
    </Switch>
  </App>
);
