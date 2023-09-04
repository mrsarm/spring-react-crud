import React, { useEffect, useRef, useState } from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { get, post, put } from '../../client';
import { applyEventToState } from '../../commons';
import { Button, Container, Input, Label, Row } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';
import Loading from '../commons/Loading';
import Message from '../commons/Message';
import { reduceError } from '../../errors';

function User() {
  const passwordRef = useRef(null);
  const match = useRouteMatch();
  const userId = match.params.id;
  const history = useHistory();
  const isCreateUser = userId === undefined;
  const [isLoadingUser, setIsLoadingUser] = useState(!isCreateUser);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(isCreateUser);
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    roles: [],
    description: ''
  });

  useEffect( () => {
    async function fetchUser() {
      try {
        const response = await get(`/users/${userId}`);
        setUser(response.data);
        setIsLoadingUser(false);
        setShowForm(true);
      } catch (ex) {
        setError(reduceError(ex, "user", "get"));
        setIsLoadingUser(false);
        setShowForm(false);
      }
    }

    if (!isCreateUser) {
      fetchUser();
    }
  }, [isCreateUser, userId]);

  function handleChange(event) {
    applyEventToState(event, user, setUser);
  }

  function save(updatedUser) {
    if (isCreateUser) {
      return post({
        url: 'users',
        data: updatedUser
      });
    } else {
      return put({
        url: updatedUser._links.self.href + '/profile',
        data: updatedUser
      });
    }
  }

  async function handleValidSubmit(event, values) {
    setIsSavingUser(true);
    const updatedUser = { ...user };
    const password = passwordRef.current.value.trim();
    if (password) {
      updatedUser.password = password;
    }
    setUser(updatedUser);
    try {
      await save(updatedUser);
      history.push('/');
    } catch(err) {
      setError(reduceError(err, "user", "save"));
      setIsSavingUser(false);
    }
  }

  return (
    <Container>
      <h3>User Details</h3>
      <Loading display={isLoadingUser}/>
      <Message error={error} display={!showForm}/>
      {!isLoadingUser && showForm &&
        <AvForm onValidSubmit={handleValidSubmit}>
          <AvGroup>
            <Label for="email">Email</Label>
            <AvInput type="text" placeholder="Email" name="email" id="email" value={user.email}
                     onChange={handleChange} required/>
            <AvFeedback>Email required</AvFeedback>
          </AvGroup>
          <AvGroup>
            <Label for="password">Password</Label>
            <AvInput type="password" autoComplete="new-password" required={isCreateUser}
                     id="password" ref={passwordRef} name="password"
                     placeholder={ "Password" + (isCreateUser ?
                         "" : " (leave blank if you don't want to change it)") }/>
            <AvFeedback>Password required</AvFeedback>
          </AvGroup>
          <Row>
            <AvGroup className="col-md-6">
              <Label for="firstName">First name</Label>
              <AvInput type="text" placeholder="First Name" name="firstName" id="firstName"
                       value={user.firstName} required
                       onChange={handleChange}/>
              <AvFeedback>First name required</AvFeedback>
            </AvGroup>
            <AvGroup className="col-md-6">
              <Label for="lastName">Last name</Label>
              <AvInput type="text" placeholder="Last Name" name="lastName" id="lastName"
                       value={user.lastName} required
                       onChange={handleChange}/>
              <AvFeedback>Last name required</AvFeedback>
            </AvGroup>
          </Row>
          <Row>
            <AvGroup className="col-md-6">
              <Label for="roles">Roles</Label>
              <Input type="select" name="roles" id="roles" multiple
                     value={user.roles} onChange={handleChange}>
                <option value="ROLE_MANAGER">Manager</option>
              </Input>
            </AvGroup>
            <AvGroup className="col-md-6">
              <Label for="description">Notes</Label>
              <Input type="textarea" name="description" id="description"
                     value={user.description}
                     onChange={handleChange} rows="3" placeholder="Notes (visible for the user)"/>
            </AvGroup>
          </Row>
          <Message error={error}/>
          <AvGroup>
            <Button color="primary" disabled={isSavingUser} className="d-print-none">
              {isSavingUser ? 'Saving...' : 'Save' }
            </Button>&nbsp;&nbsp;
            <Button color="secondary" tag={Link} to="/" className="d-print-none">Cancel</Button>
          </AvGroup>
        </AvForm>
      }
    </Container>
  );
}

export default withRouter(User);
