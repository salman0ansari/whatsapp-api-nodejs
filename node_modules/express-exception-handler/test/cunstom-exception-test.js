var exception = require('../lib/custom-exception')

describe('test the custom exception', () => {
    test('default exceptios is unknown messsage and status 500', async () => {
        var ex = new exception()
        expect(ex.status).toBe(500)
        expect(ex.message).toBe("Unknown Exception")
    })

    test(' exceptios has stacktrace', async () => {
        var ex = new exception()
        expect(ex.stack).not.toBeUndefined()
    })

    test('exceptios has name', async () => {
        var ex = new exception()
        expect(ex.name).not.toBeUndefined()
    })

    test('exceptios has undefined response', async () => {
        var ex = new exception()
        expect(ex.response).toBeUndefined()
    })

    test('exceptios set parameter', async () => {
        var response = "a response"
        var status = 400
        var message = Error("some message")
        var ex = new exception(message, status, response)
        expect(ex.status).toBe(status)
        expect(ex.response).toBe(response)
        expect(ex.message).toBe(message.toString())
        expect(ex.originError).toBe(message)
    })

    test('exception inherits stack trace if an error is provided', () => {
        var originalError = new Error('oops')
        var ex = new exception(originalError)
        expect(ex.stack).toBe(originalError.stack)
    })
})