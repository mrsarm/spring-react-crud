import {Spinner} from "reactstrap"
import React from "react"

function Loading(props) {
  const message = props.message || "Loading..."
  const size = props.size || 'sm'
  const color = props.color || 'primary'
  return (
    <>
      <Spinner size={size} color={color}/>
      <span>&nbsp;&nbsp;{message}</span>
    </>
  )
}

export default Loading
