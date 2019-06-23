'use strict';

const React = require('react')
const ReactDOM = require('react-dom')
const client = require('./client')

window.client = client   // To be accessible from browser and debug requests

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {users: [], pageSize: 2, links: []}
    this.onNavigate = this.onNavigate.bind(this)
  }

  loadFromServer(pageSize) {
    client({url: 'users', params: {size: 2}}).then(response => {
      this.setState({
        users: response.data._embedded.users,
        links: response.data._links,
        pageSize: pageSize
      })
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
      <UserList users={this.state.users}
                links={this.state.links}
                pageSize={this.state.pageSize}
                onNavigate={this.onNavigate}/>
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
      <User key={user._links.self.href} user={user}/>
    );

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

class User extends React.Component{
  render() {
    return (
      <tr>
        <td>{this.props.user.firstName}</td>
        <td>{this.props.user.lastName}</td>
        <td>{this.props.user.description}</td>
      </tr>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('react')
)
