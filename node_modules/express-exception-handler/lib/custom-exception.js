class ExceptionCustom extends Error {
    constructor (message, status, response) {
        super(message || 'Unknown Exception')
        if (message instanceof Error) {
            this.stack = message.stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
        this.name = this.constructor.name
        this.status = status || 500
        this.response = response
        this.originError = message
    }
}

module.exports = ExceptionCustom