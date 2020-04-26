'use strict';

import React from "react"
import {Link, withRouter} from 'react-router-dom'
import {get, put} from "../client"
import {applyEventToState} from "../common"
import {Button, Container, Form, FormGroup, Input, Label, Spinner, Row} from "reactstrap"
import ReactDOM from "react-dom"
import Loading from "./Loading";


class UpdateUser extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      "user": {},
      isLoadingUser: true,
      isSavingUser: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
  }

  componentDidMount() {
    get(`/users/${this.props.match.params.id}`)
      .then(response=> {
        this.setState({user: response.data, isLoadingUser: false})
      })
      .catch(error=> {
        console.error("Unknown error getting user", this.props.match.params.id, "-", error)
        alert('An Error ocurred')
        this.props.history.push('/')
      })
  }

  handleChange(event) {
    applyEventToState(event, this.state, "user", this.setState.bind(this))
  }

  onUpdate() {
    return put({
      url: this.state.user._links.self.href + '/profile',
      data: this.state.user
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    let password = ReactDOM.findDOMNode(this.refs["password"]).value.trim()
    if (password) {
      let user = {...this.state.user}
      user.password = password
      this.setState({user: user, isSavingUser: true})
    } else {
      // user state was already updated, see `handleChange(event)`
      this.setState({isSavingUser: true})
    }
    this.onUpdate()
      .then(response => {
        window.location = "/"
      }).catch(error => {
        if (error.response.status == 403) {
          alert('ACCESS DENIED: You are not authorized to update ' +
            this.state.user._links.self.href);
        } else if (error.response.status == 412) {
          alert('DENIED: Unable to update ' + this.state.user._links.self.href +
            '. Your copy is stale.');
        } else {
          //TODO Improve error handling!
          console.error("Unknown error updating user -", error)
          alert('An Error ocurred')
        }
      })
  }

  render() {
    return (
      <Container>
        <h3>Update User</h3>
        {this.state.isLoadingUser &&
          <Loading/>
        }
        {!this.state.isLoadingUser &&
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="text" placeholder="Email" name="email" id="email" value={this.state.user.email}
                     onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" autoComplete="new-password" id="password" ref="password"
                     placeholder="Password (leave blank if you don't want to change it)"/>
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

export default withRouter(UpdateUser)
