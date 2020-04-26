import React from "react"
import {client} from "../client"
import {Container} from "reactstrap"
import UserList from "./UserList"
import {withRouter} from "react-router-dom"

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      pageSize: 5,
      links: [],
      isLoadingUsers: true
    }
    this.onDelete = this.onDelete.bind(this)
    this.onNavigate = this.onNavigate.bind(this)
  }

  loadFromServer(pageSize) {
    return client({url: 'users', params: {size: this.state.pageSize}}).then(response => {
      this.setState({
        users: response.data._embedded.users,
        links: response.data._links,
        pageSize: pageSize,
        isLoadingUsers: false
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
                  isLoadingUsers={this.state.isLoadingUsers}
                  onNavigate={this.onNavigate}
                  onDelete={this.onDelete}/>
      </Container>
    )
  }
}

export default withRouter(Home)
