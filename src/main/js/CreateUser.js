import React from "react"
import ReactDOM from "react-dom"
import { withRouter, Link } from 'react-router-dom'
import { Button, Container, Form, FormGroup, Label, Input, Row } from 'reactstrap'
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
    this.onCreate(newUser)
      .then(response => {
        // Navigate away from the dialog to hide it.
        window.location = "/"
      })
      .catch(error => {
        if (error.response.status == 403) {
          alert('ACCESS DENIED: You are not authorized to create a new user.');
        } else {
          //TODO Improve error handling!
          console.error("Unknown error creating user -", error)
          alert('An Error ocurred')
        }
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
            <Input type="text" placeholder="Email" id="email" ref="email"/>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" placeholder="Password" id="password" ref="password"/>
          </FormGroup>
          <Row>
            <FormGroup className="col-md-6">
              <Label for="firstName">First name</Label>
              <Input type="text" placeholder="First Name" ref="firstName" id="firstName"/>
            </FormGroup>
            <FormGroup className="col-md-6">
              <Label for="lastName">Last name</Label>
              <Input type="text" placeholder="Last Name" ref="lastName" id="lastName"/>
            </FormGroup>
          </Row>
          <FormGroup>
            <Label for="description">Notes</Label>
            <Input type="textarea" placeholder="Notes" ref="description" id="description" rows="4"
                   placeholder="Notes (visible for the user)"/>
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
