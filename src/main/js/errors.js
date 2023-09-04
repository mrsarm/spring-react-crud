/**
 * Reduce an error to an object with
 * a title and a message to show in the UI.
 *
 * E.g.:
 *
 * ```
 * {
 *   "title": "An error occurred",
 *   "message": "Cannot update the user.",
 *   "cause": ex
 * }
 * ```
 *
 * @param ex the exception or an error message string
 * @param entity the object name related with the error, e.g. "user", "inbox"...
 * @param action the event that caused the error, e.g. "update", "delete"...
 * @param logger (default `console.error`) if the error is unknown it will
 *               be logged out with this logger
 */
export function reduceError(
  ex,
  entity='record',
  action='process',
  logger= console.error
) {
  if (typeof ex === 'string') {
    return {
      title: 'An error occurred',
      message: ex
    };
  }
  // Error does not come from a response
  if (!ex.response) {
    if (logger) logger(`Error ${action} ${entity} - `, ex);
    if (ex.message === 'Network Error') {
      return {
        title: '\uD83D\uDD0C Network Error',
        message: 'You are having network issues, check your Internet connection.',
        cause: ex
      };
    }
    if (ex.message) {
      return {
        title: 'Unexpected error',
        message: ex.message,
        cause: ex
      };
    }
    return {
      title: 'Unknown error',
      message: `An error occurred trying to ${action} the ${entity}. Try again later.`,
      cause: ex
    };
  }
  // Error comes from a response
  if (ex.response.status === 403) {
    return {
      title: 'Access denied',
      message: `You are not authorized to ${action} this ${entity}.`,
      cause: ex
    };
  }
  if (ex.response.status === 404) {
    return {
      title: 'Record not found',
      message: `Unable to ${action} the ${entity}. Either it doesn't exist or it has been deleted.`,
      cause: ex
    };
  }
  if (ex.response.status === 412) {
    return {
      title: 'Access denied',
      message: `Unable to ${action} the ${entity}. Your copy is stale.`,
      cause: ex
    };
  }

  if (logger) logger(`Unknown error ${action} ${entity} - `, ex);
  return  {
    title: 'Unknown error',
    message: `An error occurred trying to ${action} the ${entity}. Try again later.`,
    cause: ex
  };
}
