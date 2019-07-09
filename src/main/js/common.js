'use strict';

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
