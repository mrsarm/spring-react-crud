const React = require('react')
const ReactDOM = require('react-dom')
const client = require('./client')

window.client = client   // To be accessible from browser and debug requests

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {users: []};
  }

  componentDidMount() {
    client.get('users').then(response => {
      this.setState({users: response.data._embedded.users});
    });
  }

  render() {
    return (
      <UserList users={this.state.users}/>
    )
  }
}


class UserList extends React.Component {
  render() {
    const users = this.props.users.map(user =>
      <User key={user._links.self.href} user={user}/>
    );
    return (
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
