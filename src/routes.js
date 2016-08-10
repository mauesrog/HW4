import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Index from './components/index';

export default(
  <Route path="/" component={App}>
    <IndexRoute component={Index} />
    <Route path="/posts/new" component={Index} />
  </Route>
);
