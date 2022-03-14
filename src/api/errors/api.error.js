const ExtendableError = require('../errors/extendable.error')

class APIError extends ExtendableError {
    constructor({ message, errors, status = 500 }) {
        super({
            message,
            errors,
            status,
        })
    }
}

module.exports = APIError
