import React from "react"
import {useLocation} from "react-router-dom"

function RouteNoMatch() {
  let location = useLocation()

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

export default RouteNoMatch
