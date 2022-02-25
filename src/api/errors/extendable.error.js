class ExtendableError extends Error {
    constructor({ message, errors, status }) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errors = errors
        this.status = status
    }
}

module.exports = ExtendableError
