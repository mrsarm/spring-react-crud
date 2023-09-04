import React from 'react';
import { Alert, Container } from 'reactstrap';

/**
 * React Component to show a message
 * in the UI: errors, warning, info or success.
 */
export default function Message({ info, warning, error, success, display }) {

  if (display !== undefined && !display) {
    return '';
  }

  let color;
  let msg;
  if (error) {
    color = 'danger';
    msg = error;
  } else if (success) {
    color = 'success';
    msg = success;
  } else if (info) {
    color = 'info';
    msg = info;
  } else if (warning) {
    color = 'warning';
    msg = warning;
  } else {
    return '';
  }

  function renderMessage(msg) {
    if (msg.title && msg.message) {
      return (
          <>
            <h5><strong>{msg.title}</strong></h5>
            <span>{msg.message}</span>
          </>
      );
    }
    if (msg.message) {
      return <span>{msg.message}</span>;
    }
    if (typeof msg === 'string') {
      return <span>{msg}</span>;
    }
  }

  return (
    <Container className="container-message">
      <Alert color={color} key={color}>
          {renderMessage(msg)}
      </Alert>
    </Container>
  );
}
