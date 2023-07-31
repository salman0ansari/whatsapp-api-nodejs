
class ExtendableError extends Error {
    errors: string
    status: number
    constructor({ message = '', errors = '', status = 0 }) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errors = errors
        this.status = status
    }
}

export default ExtendableError
