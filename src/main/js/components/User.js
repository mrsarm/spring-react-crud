'use strict';

import React from "react"
import {Link, withRouter} from 'react-router-dom'
import {get, post, put} from "../client"
import {applyEventToState} from "../common"
import {Button, Container, Form, FormGroup, Input, Label, Row} from "reactstrap"
import ReactDOM from "react-dom"
import Loading from "./Loading"
import Message from "./Message"
import {reduceError} from "../errors"


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
    this.handleSubmit = this.handleSubmit.bind(this)
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
          error: reduceError(ex, "user", "getting"),
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

  handleSubmit(e) {
    e.preventDefault()
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
          window.location = "/"
        }).catch(ex => {
          this.setState({
            error: reduceError(ex, "user", "saving"),
            isSavingUser: false
          })
        })
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
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="text" placeholder="Email" name="email" id="email" value={this.state.user.email}
                     onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" autoComplete="new-password" id="password" ref="password"
                     placeholder={ "Password" + (this.state.isCreateUser ?
                                    "" : " (leave blank if you don't want to change it)") }/>
            </FormGroup>
            <Row>
              <FormGroup className="col-md-6">
                <Label for="firstName">First name</Label>
                <Input type="text" placeholder="First Name" name="firstName" id="firstName" ref="firstName"
                       value={this.state.user.firstName}
                       onChange={this.handleChange}/>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label for="lastName">Last name</Label>
                <Input type="text" placeholder="Last Name" name="lastName" id="lastName" ref="lastName"
                       value={this.state.user.lastName}
                       onChange={this.handleChange}/>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup className="col-md-6">
                <Label for="roles">Roles</Label>
                <Input type="select" name="roles" id="roles" ref="roles" multiple
                       value={this.state.user.roles} onChange={this.handleChange}>
                  <option value="ROLE_MANAGER">Manager</option>
                </Input>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label for="description">Notes</Label>
                <Input type="textarea" name="description" id="description" ref="description"
                       value={this.state.user.description}
                       onChange={this.handleChange} rows="3" placeholder="Notes (visible for the user)"/>
              </FormGroup>
            </Row>
            {this.state.error &&
              <Message error={this.state.error}/>
            }
            <FormGroup>
              <Button color="primary" onClick={this.handleSubmit} disabled={this.state.isSavingUser}>
                {this.state.isSavingUser ? 'Saving...' : 'Save' }
              </Button>{' '}
              <Button color="secondary" tag={Link} to="/">Cancel</Button>
            </FormGroup>
          </Form>
        }
      </Container>
    )
  }
}

export default withRouter(User)
