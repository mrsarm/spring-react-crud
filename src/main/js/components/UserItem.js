import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Button, ButtonGroup } from 'reactstrap';


class UserItem extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.user);
  }

  render() {
    return (
      <tr key={this.props.user._links.self.href}>
        <td style={{whiteSpace: 'nowrap'}}>{this.props.user.firstName}</td>
        <td>{this.props.user.lastName}</td>
        <td>{this.props.user.email}</td>
        <td>{this.props.user.description}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={this.props.user._links.self.href.split("/api")[1]}>Edit</Button>
            <Button size="sm" color="danger" onClick={this.handleDelete}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    )
  }
}

export default withRouter(UserItem)
