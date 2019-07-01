import React from "react"
import ReactDOM from "react-dom"
import { withRouter } from 'react-router-dom'


class UpdateDialog extends React.Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const updatedUser = {}
    for (const attribute in this.refs) {
      updatedUser[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
    }
    this.props.onUpdate(this.props.user, updatedUser)
    window.location = "#"
  }

  render() {
    const dialogId = "updateUser-" + this.props.user._links.self.href;

    return (
      <div key={this.props.user._links.self.href}>
        <a href={"#" + dialogId}>Update</a>
        <div id={dialogId} className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>

            <h2>Update user</h2>

            <form>
              <p>
                <label htmlFor="firstName">Email</label>
                <input type="text" placeholder="Email" ref="email" className="field"
                       defaultValue={this.props.user.email}/>
              </p>
              <p>
                <label htmlFor="firstName">First name</label>
                <input type="text" placeholder="First Name" ref="firstName" className="field"
                       defaultValue={this.props.user.firstName}/>
              </p>
              <p>
                <label htmlFor="lastName">Last name</label>
                <input type="text" placeholder="Last Name" ref="lastName" className="field"
                       defaultValue={this.props.user.lastName}/>
              </p>
              <p>
                <label htmlFor="description">Notes</label>
                <input type="text" placeholder="Notes" ref="description" className="field"
                       defaultValue={this.props.user.description}/>
              </p>
              <button onClick={this.handleSubmit}>Update</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(UpdateDialog)
