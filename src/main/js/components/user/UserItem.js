import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';

function UserItem({ user, onDelete }) {

  const editUrl = user._links.self.href.split("/api")[1];
  const [isLoading, setIsLoading] = useState(false);

  function handleDelete() {
    setIsLoading(true);
    if (window.confirm(`Do you really want to delete the user with e-mail ${user.email} ?`)) {
      onDelete(user).catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }

  return (
    <tr key={user._links.self.href}>
      <td style={{whiteSpace: 'nowrap'}}>{user.firstName}</td>
      <td className="d-none d-sm-table-cell">{user.lastName}</td>
      <td>{user.email}</td>
      <td className="d-none d-sm-table-cell">{user.description}</td>
      <td className="d-print-none">
        <ButtonGroup>
          <Button size="sm" color="primary" disabled={isLoading}
                  tag={Link} to={editUrl}>Edit</Button>
          <Button size="sm" color="danger" disabled={isLoading}
                  onClick={handleDelete}>
            {!isLoading ? 'Delete' : 'Dele...'}
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}

export default withRouter(UserItem);
