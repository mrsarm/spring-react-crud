'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import client from './client'
import Home from './Home'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import About from './About'


window.client = client   // To be accessible from browser and debug requests


class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/about" exact={true} component={About}/>
          <Route path="/users/create" exact={true} component={CreateUser}/>
          <Route path="/users/:id" component={UpdateUser}/>
        </Switch>
      </Router>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('react')
)
