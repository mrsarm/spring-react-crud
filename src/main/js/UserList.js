import React from "react"
import {Button, Pagination, PaginationItem, PaginationLink, Table} from "reactstrap"
import {Link, withRouter} from 'react-router-dom'
import User from './User'


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
        <div className="float-right">
          <Button color="success" tag={Link} to="/users/create">Add User</Button>
        </div>
        <h3>Users</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
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

export default withRouter(UserList)
