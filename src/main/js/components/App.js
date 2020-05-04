import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom"
import React from 'react'
import Home from "./Home"
import About from "./About"
import User from "./User"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/about" exact={true} component={About}/>
        <Route path="/users/create" exact={true} component={User}/>
        <Route path="/users/:id" component={User}/>
      </Switch>
    </Router>
  )
}

export default App
