import React from "react"
import {Alert} from "reactstrap"

/**
 * React Component to show a message
 * in the UI: errors, warning, info or success.
 */
class Message extends React.Component {

  renderMessage(msg) {
    if (typeof msg == 'string') {
      return msg
    } else {
      return (
        <>
          <h5><strong>{msg.title}</strong></h5>
          <span>{msg.message}</span>
        </>
      )
    }
  }

  render() {
    return (
      <>
        {this.props.error &&
          <Alert color="danger" key="error">
            {this.renderMessage(this.props.error)}
          </Alert>
        }
        {this.props.success &&
          <Alert color="success" key="success">
            {this.renderMessage(this.props.success)}
          </Alert>
        }
        {this.props.info &&
          <Alert color="info" key="info">
            {this.renderMessage(this.props.info)}
          </Alert>
        }
        {this.props.warning &&
          <Alert color="warning" key="warning">
            {this.renderMessage(this.props.warning)}
          </Alert>
        }
      </>
    )
  }
}

export default Message
