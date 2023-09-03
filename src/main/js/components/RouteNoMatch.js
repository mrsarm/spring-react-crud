import React from 'react';
import { Alert, Container } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';

export default function RouteNoMatch() {
  let location = useLocation();

  return (
    <Container>
      <Alert color="warning">
        <h4>
          &#9888; No match for <code>{location.pathname}</code>
        </h4>
        <p>
          > Go to <Link to="/">Home</Link>.
        </p>
      </Alert>
    </Container>
  );
}
