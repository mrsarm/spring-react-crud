import React from "react"
import ReactDOM from "react-dom"
import { withRouter } from 'react-router-dom'


class CreateDialog extends React.Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const newUser = {}
    for (const attribute in this.refs) {
      newUser[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
    }
    this.props.onCreate(newUser)

    // clear out the dialog's inputs
    for (const attribute in this.refs) {
      ReactDOM.findDOMNode(this.refs[attribute]).value = ''
    }

    // Navigate away from the dialog to hide it.
    window.location = "#"
  }

  render() {
    return (
      <div>
        <a href="#createUser">Create</a>

        <div id="createUser" className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>

            <h2>Create new user</h2>

            <form>
              <p>
                <label htmlFor="firstName">First name</label>
                <input type="text" placeholder="First Name" ref="firstName" className="field"/>
              </p>
              <p>
                <label htmlFor="lastName">Last name</label>
                <input type="text" placeholder="Last Name" ref="lastName" className="field"/>
              </p>
              <p>
                <label htmlFor="description">Notes</label>
                <input type="text" placeholder="Notes" ref="description" className="field"/>
              </p>
              <button onClick={this.handleSubmit}>Create</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateDialog)
