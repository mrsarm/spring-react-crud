import React from "react"
import ReactDOM from "react-dom"
import { withRouter, Link } from 'react-router-dom'
import { Button, Container, Form, FormGroup, Label, Input } from 'reactstrap'
import client from "./client"


class CreateUser extends React.Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onCreate = this.onCreate.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const newUser = {}
    for (const attribute in this.refs) {
      newUser[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
    }
    this.onCreate(newUser).finally(response => {
      // Navigate away from the dialog to hide it.
      window.location = "/"
    })
  }

  onCreate(newUser) {
    return client({
      method: 'post',
      url: 'users',
      data: newUser,
      headers: {'Content-Type': 'application/json'}
    })
  }

  render() {
    return (
      <Container>
        <h3>Create new User</h3>
        <Form>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="text" placeholder="Email" ref="email"/>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" placeholder="Password" ref="password"/>
          </FormGroup>
          <FormGroup>
            <Label for="firstName">First name</Label>
            <Input type="text" placeholder="First Name" ref="firstName"/>
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last name</Label>
            <Input type="text" placeholder="Last Name" ref="lastName"/>
          </FormGroup>
          <FormGroup>
            <Label for="description">Notes</Label>
            <Input type="text" placeholder="Notes" ref="description"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" onClick={this.handleSubmit}>Create</Button>{' '}
            <Button color="secondary" tag={Link} to="/">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    )
  }
}

export default withRouter(CreateUser)
