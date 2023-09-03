import _ from 'lodash';

/**
 * Gets the value from the target event.
 * @param target can be the target object from an event (event.target) or
 *        any form DOM element that have a value, like a input element (HTMLInputElement),
 *        a select element (HTMLSelectElement)...
 * @param emptyToNull (default false), set to true if empty string "" should be
 *        replaced by `null`
 * @returns the string value, an array of strings if it's a multi-value element,
 *          and if target is a checkbox component the boolean value
 */
function getTargetValue(target, emptyToNull = false) {
  if (target.type === "checkbox") return target.checked;
  if (target.type === "select-multiple") {
    const values = [];
    for (let i = 0; i < target.options.length; i++) {
      if (target.options[i].selected) {
        values.push(target.options[i].value);
      }
    }
    return values;
  }
  if (target.type === "select-one" && target.value === "") {
    return null;
  }
  if (emptyToNull && target.value === "") {
    return null;
  }
  return target.value;
}

/**
 * Changes the element at the root of the state named `stateElName'
 * calling `setState` with the name and the value got from `event.target'.
 *
 * E.g. having a state like:
 *
 * ```
 * {
 *   "user": {
 *     "username": "",
 *     "...": "",
 *   },
 *   ...
 * }
 * ```
 *
 * A form:
 *
 * ```
 * <form>
 *   <label>Username:</label>
 *   <input name="username" type="text" value={this.state.user.username}
 *          onChange={this.handleChange}/>
 * </form>
 * ```
 *
 * The following implementation of `handleChange` will update
 * the username in the "user" part of the state when the form field
 * is changed:
 *
 * ```
 * handleChange(event) {
 *   applyEventToState(event, this.state, "user", this.setState.bind(this))
 * }
 * ```
 *
 * Empty string values "" are replaced by null.
 *
 * @param event with the value, it will be processed with
 *        `#getTargetValue(target)` in case it has multi-values.
 * @param state the current state
 * @param stateElName the key at the root of the state to change,
 *        e.g. "user", but it can be also a path e.g. if `stateElName` is
 *        "user.profile" and `event.target.name` is "username", the
 *        value from the `event` object will be applied to
 *        the path `state.user.profile.username`.
 * @param setState the function to change the state
 */
export function applyEventToState(event, state, stateElName, setState) {
  const stateEl = _.cloneDeep(state[stateElName]);
  const name = event.target.name;
  const value = getTargetValue(event.target, true);
  _.set(stateEl, name, value);
  const stateElNameRoot = stateElName.split('.')[0];
  setState({[stateElNameRoot]: stateEl});
}
