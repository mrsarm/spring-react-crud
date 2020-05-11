'use strict';

import React from "react"
import ReactDOM from "react-dom"
import {Link, withRouter} from 'react-router-dom'
import {get, post, put} from "../../client"
import {applyEventToState} from "../../commons"
import {Button, Container, Input, Label, Row} from "reactstrap"
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe'
import Loading from "../commons/Loading"
import Message from "../commons/Message"
import {reduceError} from "../../errors"


class User extends React.Component {

  constructor(props) {
    super(props)
    const isCreateUser = props.match.path === "/users/create"
    this.state = {
      user: {
        email: '',
        firstName: '',
        lastName: '',
        roles: [],
        description: ''
      },
      isCreateUser: isCreateUser,
      isLoadingUser: !isCreateUser,
      isSavingUser: false,
      error: null,
      showForm: isCreateUser
    }
    this.handleValidSubmit = this.handleValidSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  componentDidMount() {
    if (!this.state.isCreateUser) {
      get(`/users/${this.props.match.params.id}`)
      .then(response => {
        this.setState({
          user: response.data,
          isLoadingUser: false, showForm: true
        })
      })
      .catch(ex=> {
        this.setState({
          error: reduceError(ex, "user", "get"),
          isLoadingUser: false, showForm: false
        })
      })
    }
  }

  handleChange(event) {
    applyEventToState(event, this.state, "user", this.setState.bind(this))
  }

  onSave() {
    if (this.state.isCreateUser) {
      return post({
        url: 'users',
        data: this.state.user
      })
    } else {
      return put({
        url: this.state.user._links.self.href + '/profile',
        data: this.state.user
      })
    }
  }

  handleValidSubmit(event, values) {
    let password = ReactDOM.findDOMNode(this.refs["password"]).value.trim()
    let newState
    if (password) {
      let user = {...this.state.user}
      user.password = password
      newState = {user: user, isSavingUser: true}
    } else {
      // user state was already updated, see `handleChange(event)`
      newState = {isSavingUser: true}
    }
    this.setState(newState, ()=>
      this.onSave()
        .then(response => {
          this.props.history.push('/')
        }).catch(ex =>
          this.setState({
            error: reduceError(ex, "user", "save"),
            isSavingUser: false
          })
        )
    )
  }

  render() {
    return (
      <Container>
        <h3>User Details</h3>
        {this.state.isLoadingUser &&
          <Loading/>
        }
        {this.state.error && !this.state.showForm &&
          <Message error={this.state.error}/>
        }
        {!this.state.isLoadingUser && this.state.showForm &&
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="email">Email</Label>
              <AvInput type="text" placeholder="Email" name="email" id="email" value={this.state.user.email}
                     onChange={this.handleChange} required/>
              <AvFeedback>Email required</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label for="password">Password</Label>
              <AvInput type="password" autoComplete="new-password" required={this.state.isCreateUser}
                       id="password" ref="password" name="password"
                       placeholder={ "Password" + (this.state.isCreateUser ?
                                    "" : " (leave blank if you don't want to change it)") }/>
              <AvFeedback>Password required</AvFeedback>
            </AvGroup>
            <Row>
              <AvGroup className="col-md-6">
                <Label for="firstName">First name</Label>
                <AvInput type="text" placeholder="First Name" name="firstName" id="firstName" ref="firstName"
                       value={this.state.user.firstName} required
                       onChange={this.handleChange}/>
                <AvFeedback>First name required</AvFeedback>
              </AvGroup>
              <AvGroup className="col-md-6">
                <Label for="lastName">Last name</Label>
                <AvInput type="text" placeholder="Last Name" name="lastName" id="lastName" ref="lastName"
                       value={this.state.user.lastName} required
                       onChange={this.handleChange}/>
                <AvFeedback>Last name required</AvFeedback>
              </AvGroup>
            </Row>
            <Row>
              <AvGroup className="col-md-6">
                <Label for="roles">Roles</Label>
                <Input type="select" name="roles" id="roles" ref="roles" multiple
                       value={this.state.user.roles} onChange={this.handleChange}>
                  <option value="ROLE_MANAGER">Manager</option>
                </Input>
              </AvGroup>
              <AvGroup className="col-md-6">
                <Label for="description">Notes</Label>
                <Input type="textarea" name="description" id="description" ref="description"
                       value={this.state.user.description}
                       onChange={this.handleChange} rows="3" placeholder="Notes (visible for the user)"/>
              </AvGroup>
            </Row>
            {this.state.error &&
              <Message error={this.state.error}/>
            }
            <AvGroup>
              <Button color="primary" disabled={this.state.isSavingUser}>
                {this.state.isSavingUser ? 'Saving...' : 'Save' }
              </Button>&nbsp;&nbsp;
              <Button color="secondary" tag={Link} to="/">Cancel</Button>
            </AvGroup>
          </AvForm>
        }
      </Container>
    )
  }
}

export default withRouter(User)
