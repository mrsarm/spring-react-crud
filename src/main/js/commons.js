/**
 * Gets the value from the target event.
 * @param target can be the target object from an event (event.target) or
 * any form DOM element that have a value, like a input element (HTMLInputElement),
 * a select element (HTMLSelectElement)...
 * @returns the string value, an array of strings if it's a multi-value element,
 *          and if target is a checkbox component the boolean value
 */
function getTargetValue(target) {
  if (target.type === "checkbox") return target.checked
  if (!target.options) return target.value
  const values = []
  for (let i = 0; i < target.options.length; i++) {
    if (target.options[i].selected) {
      values.push(target.options[i].value)
    }
  }
  return values
}

/**
 * Changes the element a the root of the state named `stateElName'
 * calling `setState` with the the name and the value got from `event.target'.
 *
 * Eg. having a state like:
 *
 *     {
 *       "user": {
 *         "username": "",
 *         "...": "",
 *       },
 *       ...
 *     }
 *
 * A form:
 *
 *     <form>
 *       <label>Username:</label>
 *       <input name="username" type="text" value={this.state.user.username}
 *              onChange={this.handleChange}/>
 *     </form>
 *
 * The following implementation of `handleChange` will update
 * the username in the "user" part of the state when the form field
 * is changed:
 *
 *     handleChange(event) {
 *       applyEventToState(event, this.state, "user", this.setState.bind(this))
 *     }
 *
 * @param event with the value, it will be processed with
 *        `#getTargetValue(target)` in case it has multi-values.
 * @param state the current state
 * @param stateElName the name of the element to change at the root
 *        of the state
 * @param setState the function to change the state
 */
function applyEventToState(event, state, stateElName, setState) {
  const name = event.target.name
  const value = getTargetValue(event.target)
  const stateEl = {...state[stateElName]}
  stateEl[name] = value
  setState({[stateElName]: stateEl})
}

export {getTargetValue, applyEventToState}
