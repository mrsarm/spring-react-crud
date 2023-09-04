import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import React from 'react';
import UsersHome from './user/UsersHome';
import About from './About';
import User from './user/User';
import Navbar from './Navbar';
import RouteNoMatch from './RouteNoMatch';

export default function App() {

  const loggedUserData = document.querySelector('#user-data').dataset;
  const loggedUser = {
    name: loggedUserData.username,
    isAdmin: loggedUserData.isAdmin === 'true'
  };

  return (
    <Router>
      <Navbar loggedUser={loggedUser}/>
      <Switch>
        <Route
          exact path="/"
          render={() => <Redirect to="/users" />}
        />
        <Route path="/users" exact={true}>
          <UsersHome loggedUser={loggedUser}/>
        </Route>
        <Route path="/users/create" exact={true} component={User}/>
        <Route path="/users/:id" component={User}/>
        <Route path="/about" exact={true} component={About}/>
        <Route path="*">
          <RouteNoMatch />
        </Route>
      </Switch>
    </Router>
  );
}
