'use strict';

/**
 *
 * @param target can be the target object from an event (event.target) or
 * any form DOM element that have a value, like a input element (HTMLInputElement),
 * a select element (HTMLSelectElement)...
 * or a
 * @returns the string value, or an array if it's a multi-value element
 */
function getTargetValue(target) {
  let value;
  if (target.options) { // <select> with or without multiple values
    value = []
    for (let i = 0; i < target.options.length; i++) {
      if (target.options[i].selected) {
        value.push(target.options[i].value);
      }
    }
  } else {
    value = target.value
  }
  return value
}

export {getTargetValue}
