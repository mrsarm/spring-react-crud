import React, { useEffect, useState } from 'react';
import { client } from '../../client';
import { Container } from 'reactstrap';
import UserList from './UserList';
import { withRouter } from 'react-router-dom';
import { reduceError } from '../../errors';

const PAGE_SIZE = 20;

function UsersHome({ loggedUser }) {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const [error, setError] = useState(null);

  async function loadFromServer() {
    try {
      const response = await client({ url: 'users', params: { size: PAGE_SIZE } });
      setUsers(response.data._embedded.users);
      setLinks(response.data._links);
      setIsLoadingUsers(false);
      setError(null);
      return response;
    } catch(ex) {
      setError(reduceError(ex, "users", "get"));
      setIsLoadingUsers(false);
      setIsLoadingPagination(false);
    }
  }

  async function onDelete(user) {
    try {
      await client({method: 'delete', url: user._links.self.href});
      await loadFromServer();
    } catch(ex) {
      if (ex.response.status === 403) {
        alert("Access DENIED: You are not authorized to " +
              "delete the user with email " + user.email);
      } else {
        //TODO Improve how the error is shown
        console.error("Unknown error deleting user -", ex);
        alert('Unexpected error');
      }
      throw ex;
    }
  }

  useEffect(() => {
    loadFromServer();
  }, []);

  async function onNavigate(navUri) {
    try {
      const userCollection = await client.get(navUri);
      setUsers(userCollection.data._embedded.users);
      setLinks(userCollection.data._links);
      setIsLoadingUsers(false);
      setIsLoadingPagination(false);
      setError(null);
    } catch(ex) {
      setError(reduceError(ex, "users", "get"));
      setIsLoadingUsers(false);
      setIsLoadingPagination(false);
    }
  }

  return (
    <Container fluid>
      <UserList users={users}
                links={links}
                PAGE_SIZE={PAGE_SIZE}
                isLoadingUsers={isLoadingUsers}
                isLoadingPagination={isLoadingPagination}
                error={error}
                loggedUser={loggedUser}
                onNavigate={onNavigate}
                onDelete={onDelete} />
    </Container>
  );
}

export default withRouter(UsersHome);
