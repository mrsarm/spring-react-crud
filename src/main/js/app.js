'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Container, Table,
  Pagination, PaginationItem, PaginationLink,
  Form, FormGroup, Label, Input} from 'reactstrap'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import client from './client'
import UserList from './UserList'
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


class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {users: [], pageSize: 5, links: []}
    this.onDelete = this.onDelete.bind(this)
    this.onNavigate = this.onNavigate.bind(this)
  }

  loadFromServer(pageSize) {
    return client({url: 'users', params: {size: this.state.pageSize}}).then(response => {
      this.setState({
        users: response.data._embedded.users,
        links: response.data._links,
        pageSize: pageSize
      })
      return response
    })
  }

  onDelete(user) {
    client({method: 'delete', url: user._links.self.href}).then(response => {
      this.loadFromServer(this.state.pageSize)
    }).catch(error => {
      if (error.response.status == 403) {
        alert('ACCESS DENIED: You are not authorized to delete ' +
          user._links.self.href);
      } else {
        //TODO Improve error handling!
        console.error("Unknown error deleting user -", error)
        alert('An Error ocurred')
      }
    })
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize)
  }

  onNavigate(navUri) {
    client.get(navUri).then(userCollection => {
      this.setState({
        users: userCollection.data._embedded.users,
        pageSize: this.state.pageSize,
        links: userCollection.data._links
      })
    })
  }

  render() {
    return (
      <Container fluid>
        <UserList users={this.state.users}
                  links={this.state.links}
                  pageSize={this.state.pageSize}
                  onNavigate={this.onNavigate}
                  onUpdate={this.onUpdate}
                  onDelete={this.onDelete}/>
      </Container>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('react')
)
