import {Spinner} from "reactstrap"
import React from "react"

function Loading({
    message = "Loading...",
    size = 'sm',
    color = 'primary'
}) {
  return (
    <>
      <Spinner size={size} color={color}/>
      <span>&nbsp;&nbsp;{message}</span>
    </>
  )
}

export default Loading
