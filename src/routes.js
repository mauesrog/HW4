import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Index from './components/index';
import SignUp from './components/signup';
import SignIn from './components/signin';

export default(
  <Route path="/" component={App}>
    <IndexRoute component={Index} />
    <Route path="/posts/new" component={Index} />
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/signout" component={Index} />
  </Route>
);
