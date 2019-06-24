'use strict';

const React = require('react')
const ReactDOM = require('react-dom')
const client = require('./client')

window.client = client   // To be accessible from browser and debug requests


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {users: [], pageSize: 2, links: []}
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
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

  onDelete(user) {
    client({method: 'delete', url: user._links.self.href}).then(response => {
      this.loadFromServer(this.state.pageSize)
    });
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
        <CreateDialog onCreate={this.onCreate}/>
        <UserList users={this.state.users}
                  links={this.state.links}
                  pageSize={this.state.pageSize}
                  onNavigate={this.onNavigate}
                  onDelete={this.onDelete}/>
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
      <User key={user._links.self.href} user={user} onDelete={this.props.onDelete}/>
    )

    const navLinks = []
    if ("first" in this.props.links) {
      navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>)
    }
    if ("prev" in this.props.links) {
      navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>)
    }
    if ("next" in this.props.links) {
      navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>)
    }
    if ("last" in this.props.links) {
      navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>)
    }

    return (
      <div>
        <table>
          <tbody>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Notes</th>
            <th></th>
          </tr>
          {users}
          </tbody>
        </table>
        <div>
          {navLinks}
        </div>
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
        <td>{this.props.user.firstName}</td>
        <td>{this.props.user.lastName}</td>
        <td>{this.props.user.description}</td>
        <td>
          <button onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('react')
)
