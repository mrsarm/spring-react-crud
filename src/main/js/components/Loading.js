import {Container, Spinner} from "reactstrap"
import React from "react"

function Loading(props) {
  let message = props.message || "Loading..."
  return (
    <Container>
      <Spinner size="sm" color="primary"/>
      <span>&nbsp;&nbsp;{message}</span>
    </Container>
  )
}

export default Loading
