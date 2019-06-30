'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Container, Table,
  Pagination, PaginationItem, PaginationLink,
  Form, FormGroup, Label, Input} from 'reactstrap'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import client from './client'
import UserList from './UserList'
import CreateDialog from './CreateDialog'
import About from './About'


window.client = client   // To be accessible from browser and debug requests


class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/about" exact={true} component={About}/>
        </Switch>
      </Router>
    )
  }
}


class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {users: [], pageSize: 2, links: []}
    this.onCreate = this.onCreate.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
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

  onCreate(newUser) {
    return client({
      method: 'post',
      url: 'users',
      data: newUser,
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      return this.loadFromServer(this.state.pageSize)
    }).then(response => {
      if (typeof response.data._links.last !== "undefined") {
        this.onNavigate(response.data._links.last.href)
      } else {
        this.onNavigate(response.data._links.self.href)
      }
    })
  }

  onUpdate(user, updatedUser) {
    client({
      method: 'put',
      url: user._links.self.href,
      data: updatedUser,
      headers: {
        'Content-Type': 'application/json'
        //,'If-Match': user.headers.Etag
      }
    }).then(response => {
      return this.loadFromServer(this.state.pageSize)
    }).catch(error => {
      if (error.response.status == 403) {
          alert('ACCESS DENIED: You are not authorized to update ' +
            user._links.self.href);
      } else if (error.response.status == 412) {
          alert('DENIED: Unable to update ' + user._links.self.href +
            '. Your copy is stale.');
      } else {
        //TODO Improve error handling!
        console.error("Unknown error updating user -", error)
        alert('An Error ocurred')
      }
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
      <div>
        <Container fluid>
          <div className="float-right">
            <CreateDialog onCreate={this.onCreate}/>
          </div>
          <UserList users={this.state.users}
                    links={this.state.links}
                    pageSize={this.state.pageSize}
                    onNavigate={this.onNavigate}
                    onUpdate={this.onUpdate}
                    onDelete={this.onDelete}/>
        </Container>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('react')
)
