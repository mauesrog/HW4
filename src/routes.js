import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Index from './components/index';

// <Route path="posts/new" component={New} />
// <Route path="posts/:id" component={Show} />

export default(
  <Route path="/" component={App}>
    <IndexRoute component={Index} />
  </Route>
);
