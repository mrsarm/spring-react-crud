import React from "react"
import {Button, Container} from "reactstrap"
import {Link, withRouter} from "react-router-dom"


class About extends React.Component {
  render() {
    return (
      <Container>
        <h2>React.js and Spring Data REST - CRUD</h2>
        <p>
          CRUD application with security enabled: a PoC with
          ReactJS in the frontend and Spring Data REST in the backend.
        </p>
        <h4>Authors</h4>
        <ul>
          <li><a href="mailto:mrsarm@gmail.com">Mariano Ruiz</a></li>
        </ul>
        <h4>Original Authors</h4>
        <ul>
          <li>Greg Turnquist <em>(Pivotal)</em></li>
          <li><em>Pivotal committers and other contributors</em></li>
        </ul>
        <p>
          <strong>Source Code</strong>:&nbsp;
          <a href="https://github.com/mrsarm/spring-react-crud" target="_blank">https://github.com/mrsarm/spring-react-crud</a>
        </p>
        <address>2015-2020  |  Apache-2.0</address>
        <Button color="link"><Link to="/">← Back to Users</Link></Button>
      </Container>
    )
  }
}

export default withRouter(About)
