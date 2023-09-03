import React from 'react';
import { Alert, Container } from 'reactstrap';

/**
 * React Component to show a message
 * in the UI: errors, warning, info or success.
 */
export default function Message({ info, warning, error, success, display }) {

  function renderMessage(msg) {
    if (typeof msg == 'string') {
      return msg;
    } else {
      return (
        <>
          <h5><strong>{msg.title}</strong></h5>
          <span>{msg.message}</span>
        </>
      );
    }
  }

  const noDisplay = display !== undefined ? display : true;
  if (noDisplay) return '';

  return (
    <Container className="container-message">
      {error &&
        <Alert color="danger" key="error">
          {renderMessage(error)}
        </Alert>
      }
      {success &&
        <Alert color="success" key="success">
          {renderMessage(success)}
        </Alert>
      }
      {info &&
        <Alert color="info" key="info">
          {renderMessage(info)}
        </Alert>
      }
      {warning &&
        <Alert color="warning" key="warning">
          {renderMessage(warning)}
        </Alert>
      }
    </Container>
  );
}
