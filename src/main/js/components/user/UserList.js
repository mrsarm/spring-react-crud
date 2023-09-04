import React, { useState } from 'react';
import { Button, Container, Pagination,
         PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import UserItem from './UserItem';
import Loading from '../commons/Loading';
import Message from '../commons/Message';
import LoadingPagination from '../commons/LoadingPagination';

function UserList({
  users,
  links,
  isLoadingUsers,
  isLoading,
  error,
  loggedUser,
  onNavigate,
  onDelete
}) {
  const allowCreateUser = loggedUser.isAdmin;
  const createUserTooltip = loggedUser.isAdmin ?
      'Add User' : 'Only "Manager" users are allowed to create other users';
  const [isLoadingPagination, setIsLoadingPagination] = useState(isLoading || false);

  function _handleNavFirst(e, link) {
    e.preventDefault();
    setIsLoadingPagination(true);
    onNavigate(links[link].href)
        .then(() => setIsLoadingPagination(false));
  }

  const handleNavFirst = (e) => _handleNavFirst(e, "first");
  const handleNavPrev = (e) => _handleNavFirst(e, "prev");
  const handleNavNext = (e) => _handleNavFirst(e, "next");
  const handleNavLast = (e) => _handleNavFirst(e, "last");

  function getNavLinks() {
    const navLinks = [];
    if ("first" in links) {
      navLinks.push(
        <PaginationItem key="first">
          <PaginationLink first onClick={handleNavFirst} />
        </PaginationItem>
      );
    }
    if ("prev" in links) {
      navLinks.push(
        <PaginationItem key="previous">
          <PaginationLink previous onClick={handleNavPrev} />
        </PaginationItem>
      );
    }
    if ("next" in links) {
      navLinks.push(
        <PaginationItem key="next">
          <PaginationLink next onClick={handleNavNext} />
        </PaginationItem>
      );
    }
    if ("last" in links) {
      navLinks.push(
        <PaginationItem key="last">
          <PaginationLink last onClick={handleNavLast} />
        </PaginationItem>
      );
    }
    return navLinks;
  }

  const navLinks = getNavLinks();
  return (
    <Container fluid>
      <div className="float-end" title={createUserTooltip}>
        <Button color="success" tag={Link} className="d-print-none"
                to="/users/create"
                disabled={!allowCreateUser}>
          Add User
        </Button>
      </div>
      <h3>Users</h3>
      <Table className="mt-4 table-hover">
        <thead>
        <tr>
          <th>First Name</th>
          <th className="d-none d-sm-table-cell">Last Name</th>
          <th>Email</th>
          <th className="d-none d-sm-table-cell">Notes</th>
          <th width="8%" className="d-print-none"></th>
        </tr>
        </thead>
        <tbody>
          {isLoadingUsers &&
            <tr key="isLoadingUsers">
              <td><Loading/></td>
            </tr>
          }
          {!isLoadingUsers && !error && users.length === 0 &&
            <tr><td colSpan="100%"><strong>&#9746; No users found.</strong></td></tr>
          }
          {!isLoadingUsers && users.length > 0 &&
            users.map(user =>
              <UserItem key={user._links.self.href} user={user} onDelete={onDelete}/>
            )
          }
        </tbody>
      </Table>
      {navLinks.length > 0 &&
        <Pagination>
          {navLinks}
          {isLoadingPagination &&
            <LoadingPagination/>
          }
        </Pagination>
      }
      <Message error={error}/>
    </Container>
  );
}

export default withRouter(UserList);
