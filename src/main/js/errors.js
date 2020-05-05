/**
 * Reduce an error to an object with
 * a title and a message to show to the user. Eg.:
 *
 *     {
 *       "title": "An error occurred",
 *       "message": "Cannot update the user",
 *       "cause": ex
 *     }
 *
 * @param ex the exception or an error message string
 * @param entity the object name related with the error, eg. "user", "inbox"...
 * @param action the event that caused the error, eg. "update", "delete"...
 * @param logger (default `console.error`) a function to log unknown errors
 */
function reduceError(
  ex,
  entity='record',
  action='process',
  logger=console.error
) {
  if (typeof ex == 'string') {
    return {
      title: 'An error occurred',
      message: ex
    }
  }
  // Error does not come from a response
  if (!ex.response) {
    logger(`Error ${action} ${entity} -`, ex)
    if (ex.message) {
      return {
        title: 'Unexpected error',
        message: ex.message,
        cause: ex
      }
    }
    return {
      title: 'Unknown error',
      message: `An error occurred trying to ${action} the ${entity}. Try again later.`,
      cause: ex
    }
  }
  // Error comes from a response
  if (ex.response.status === 403) {
    return {
      title: 'Access denied',
      message: `You are not authorized to ${action} this ${entity}.`,
      cause: ex
    }
  }
  if (ex.response.status === 412) {
    return {
      title: 'Access denied',
      message: `Unable to ${action} the ${entity}. Your copy is stale.`,
      cause: ex
    }
  }

  logger(`Unknown error ${action} ${entity} -`, ex)
  return  {
    title: 'Unknown error',
    message: `An error occurred trying to ${action} the ${entity}. Try again later.`,
    cause: ex
  }
}

export {reduceError}
