import React from 'react'
import { withRouter } from 'react-router-dom'
import UpdateDialog from './UpdateDialog'


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

export default withRouter(User)
