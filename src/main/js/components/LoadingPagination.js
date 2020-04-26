import React from "react"
import Loading from "./Loading"

function LoadingPagination(props) {
  return (
    <li className="page-item">
      <div style={{padding: '.5rem .75rem'}}>
        <Loading color="secondary" {...props}/>
      </div>
    </li>
  )
}

export default LoadingPagination
