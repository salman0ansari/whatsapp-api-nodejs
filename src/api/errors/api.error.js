const httpStatus = require('http-status')
const ExtendableError = require('../errors/extendable.error')

class APIError extends ExtendableError {
    constructor({
        message,
        errors,
        status = httpStatus.INTERNAL_SERVER_ERROR,
    }) {
        super({
            message,
            errors,
            status,
        })
    }
}

module.exports = APIError
