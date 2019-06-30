'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import client from './client'
import { Button, Container, Table,
         Pagination, PaginationItem, PaginationLink,
         Form, FormGroup, Label, Input} from 'reactstrap'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'


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


class CreateDialog extends React.Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const newUser = {}
    for (const attribute in this.refs) {
      newUser[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
    }
    this.props.onCreate(newUser)

    // clear out the dialog's inputs
    for (const attribute in this.refs) {
      ReactDOM.findDOMNode(this.refs[attribute]).value = ''
    }

    // Navigate away from the dialog to hide it.
    window.location = "#"
  }

  render() {
    return (
      <div>
        <a href="#createUser">Create</a>

        <div id="createUser" className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>

            <h2>Create new user</h2>

            <form>
              <p>
                <label htmlFor="firstName">First name</label>
                <input type="text" placeholder="First Name" ref="firstName" className="field"/>
              </p>
              <p>
                <label htmlFor="lastName">Last name</label>
                <input type="text" placeholder="Last Name" ref="lastName" className="field"/>
              </p>
              <p>
                <label htmlFor="description">Notes</label>
                <input type="text" placeholder="Notes" ref="description" className="field"/>
              </p>
              <button onClick={this.handleSubmit}>Create</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}


class UpdateDialog extends React.Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const updatedUser = {}
    for (const attribute in this.refs) {
      updatedUser[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
    }
    this.props.onUpdate(this.props.user, updatedUser)
    window.location = "#"
  }

  render() {
    const dialogId = "updateUser-" + this.props.user._links.self.href;

    return (
      <div key={this.props.user._links.self.href}>
        <a href={"#" + dialogId}>Update</a>
        <div id={dialogId} className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>

            <h2>Update user</h2>

            <form>
              <p>
                <label htmlFor="firstName">First name</label>
                <input type="text" placeholder="First Name" ref="firstName" className="field"
                       defaultValue={this.props.user.firstName}/>
              </p>
              <p>
                <label htmlFor="lastName">Last name</label>
                <input type="text" placeholder="Last Name" ref="lastName" className="field"
                       defaultValue={this.props.user.lastName}/>
              </p>
              <p>
                <label htmlFor="description">Notes</label>
                <input type="text" placeholder="Notes" ref="description" className="field"
                       defaultValue={this.props.user.description}/>
              </p>
              <button onClick={this.handleSubmit}>Update</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}


class UserList extends React.Component {

  constructor(props) {
    super(props)
    this.handleNavFirst = this.handleNavFirst.bind(this)
    this.handleNavPrev = this.handleNavPrev.bind(this)
    this.handleNavNext = this.handleNavNext.bind(this)
    this.handleNavLast = this.handleNavLast.bind(this)
  }

  handleNavFirst(e) {
    e.preventDefault()
    this.props.onNavigate(this.props.links.first.href)
  }

  handleNavPrev(e) {
    e.preventDefault()
    this.props.onNavigate(this.props.links.prev.href)
  }

  handleNavNext(e) {
    e.preventDefault()
    this.props.onNavigate(this.props.links.next.href)
  }

  handleNavLast(e) {
    e.preventDefault()
    this.props.onNavigate(this.props.links.last.href)
  }

  render() {
    const users = this.props.users.map(user =>
      <User key={user._links.self.href} user={user} onDelete={this.props.onDelete} onUpdate={this.props.onUpdate}/>
    )

    const navLinks = []
    if ("first" in this.props.links) {
      navLinks.push(
        <PaginationItem key="first">
        <PaginationLink first onClick={this.handleNavFirst} />
        </PaginationItem>
      )
    }
    if ("prev" in this.props.links) {
      navLinks.push(
        <PaginationItem key="previous">
          <PaginationLink previous onClick={this.handleNavPrev} />
        </PaginationItem>
      )
    }
    if ("next" in this.props.links) {
      navLinks.push(
        <PaginationItem key="next">
          <PaginationLink next onClick={this.handleNavNext} />
        </PaginationItem>
      )
    }
    if ("last" in this.props.links) {
      navLinks.push(
        <PaginationItem key="last">
          <PaginationLink last onClick={this.handleNavLast} />
        </PaginationItem>
      )
    }

    return (
      <div>
        <Table className="mt-4">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Notes</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users}
          </tbody>
        </Table>
        {navLinks.length > 0 &&
          <Pagination>
            {navLinks}
          </Pagination>
        }
      </div>
    )
  }
}

class User extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.user);
  }

  render() {
    return (
      <tr>
        <td style={{whiteSpace: 'nowrap'}}>{this.props.user.firstName}</td>
        <td>{this.props.user.lastName}</td>
        <td>{this.props.user.description}</td>
        <td>
          <UpdateDialog user={this.props.user} onUpdate={this.props.onUpdate}/>
        </td>
        <td>
          <button onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    )
  }
}


class About extends React.Component {
  render() {
    return (
      <Container fluid>
        <h2>React.js and Spring Data REST - CRUD</h2>
        <p>
          CRUD application with security enabled: a PoC with
          ReactJS in the frontend and Spring Data REST in the backend.
        </p>
        <h4>Authors</h4>
        <ul>
          <li><a href="mailto:mrsarm@gmail.com">Mariano Ruiz</a></li>
        </ul>
        <h4>Original Authors</h4>
        <ul>
          <li>Greg Turnquist <em>(Pivotal)</em></li>
          <li><em>Pivotal committers and other contributors</em></li>
        </ul>
        <address>2015-2019  |  Apache-2.0</address>
        <Button color="link"><Link to="/">← Back to Users</Link></Button>
      </Container>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('react')
)
