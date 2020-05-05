import React from "react"
import {client} from "../../client"
import {Container} from "reactstrap"
import UserList from "./UserList"
import {withRouter} from "react-router-dom"
import {reduceError} from "../../errors"

class UsersHome extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      pageSize: 10,
      links: [],
      isLoadingUsers: true,
      isLoadingPagination: false,
      error: null
    }
    this.onDelete = this.onDelete.bind(this)
    this.onNavigate = this.onNavigate.bind(this)
  }

  loadFromServer(pageSize) {
    return client({url: 'users', params: {size: this.state.pageSize}})
      .then(response => {
        this.setState({
          users: response.data._embedded.users,
          links: response.data._links,
          pageSize: pageSize,
          isLoadingUsers: false,
          error: null
        })
        return response
      })
      .catch(ex=> {
        this.setState({
          error: reduceError(ex, "users", "getting"),
          isLoadingUsers: false, isLoadingPagination: false
        })
      })
  }

  onDelete(user) {
    return client({method: 'delete', url: user._links.self.href}).then(resp =>
      this.loadFromServer(this.state.pageSize)
    ).catch(ex => {
      if (ex.response.status == 403) {
        alert("Access DENIED: You are not authorized to " +
              "delete the user with email " + user.email)
      } else {
        //TODO Improve how the error is shown
        console.error("Unknown error deleting user -", ex)
        alert('Unexpected error')
      }
      throw ex
    })
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize)
  }

  onNavigate(navUri) {
    return client.get(navUri).then(userCollection => {
      this.setState({
        users: userCollection.data._embedded.users,
        pageSize: this.state.pageSize,
        links: userCollection.data._links,
        isLoadingUsers: false, isLoadingPagination: false,
        error: null
      })
    })
    .catch(ex=>{
      this.setState({
        error: reduceError(ex, "users", "getting"),
        isLoadingUsers: false, isLoadingPagination: false
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
                  isLoadingPagination={this.state.isLoadingPagination}
                  error={this.state.error}
                  loggedUser={this.props.loggedUser}
                  onNavigate={this.onNavigate}
                  onDelete={this.onDelete}/>
      </Container>
    )
  }
}

export default withRouter(UsersHome)
