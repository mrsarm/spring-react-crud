import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Button, ButtonGroup, Spinner } from 'reactstrap'


class UserItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      editUrl: props.user._links.self.href.split("/api")[1],
      user: {
        ...props.user
      }
    }
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleDelete() {
    this.setState({isLoading: true})
    this.props.onDelete(this.state.user)
              .catch(()=>this.setState({isLoading: false}))
  }

  render() {
    return (
      <tr key={this.state.user._links.self.href}>
        <td style={{whiteSpace: 'nowrap'}}>{this.state.user.firstName}</td>
        <td>{this.state.user.lastName}</td>
        <td>{this.state.user.email}</td>
        <td>{this.state.user.description}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" disabled={this.state.isLoading}
                    tag={Link} to={this.state.editUrl}>Edit</Button>
            <Button size="sm" color="danger" disabled={this.state.isLoading}
                    onClick={this.handleDelete}>
              {!this.state.isLoading &&
                'Delete'
              }
              {this.state.isLoading &&
                'Dele...'
              }
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    )
  }
}

export default withRouter(UserItem)
