const AppError = require('./custom-exception')

const defaultOptions = {
  nextOnce: true,
  defaultJsonResponse: false,
}

function wrap(fn, options = {}) {
  const fullOptions = { ...defaultOptions, ...options };
  return (req, res, next) => {
    if (fullOptions.nextOnce) {
      const originalNext = next
      let nextCalled = false
      next = (...args) => {
        if (nextCalled) {
          return;
        }
        nextCalled = true
        originalNext(...args)
      }
    }
    try {
      let handlerResult = fn(req, res, next)
      if (handlerResult) {
        // if internal function accepts more than 2 params, then the user
        // must want to use the next callback in a specific manner and
        // want to control every aspect of this handler, and we should not
        // respond with res.json(...) according to the returned value.
        if (fullOptions.defaultJsonResponse && (fn.length === 2)) {
          if (handlerResult.then) {
            handlerResult = handlerResult.then(value => jsonResponse(res, value))
          } else {
            // handlerResult is a value, not a promise.
            jsonResponse(res, handlerResult)
          }
        }
        // safety check that handlerResult still exists
        if (handlerResult && handlerResult.catch) {
          handlerResult.catch(err => continueToErrorMiddleware(err, next))
        }
      }
    } catch (err) {
      continueToErrorMiddleware(err, next)
    }
  }
};

function jsonResponse(res, value) {
  if (res.headersSent || !value || (typeof value !== 'object')) {
    return
  }
  res.json(value)
}

function continueToErrorMiddleware(err, next){
  if (!err || !(err instanceof AppError))
    err = new AppError(err)
  next(err)
}

module.exports = wrap