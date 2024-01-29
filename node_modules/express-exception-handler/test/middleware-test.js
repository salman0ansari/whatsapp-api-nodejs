const middleware = require('../lib/middleware')

describe('test the middleware', () => {
    test('exception middleware sends error status without response', () => {
        var res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }
        middleware({status:500, message: "some message"}, undefined,res)
        expect(res.status.mock.calls.length).toBe(1)
        expect(res.status.mock.calls[0][0]).toBe(500)
        expect(res.send.mock.calls.length).toBe(1)
        expect(res.send.mock.calls[0][0]).toBe("some message")
    })

    test('exception middleware sends error status with response', () => {
        var res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }
        middleware({status:400, message: "some message", response: "a response"}, undefined,res)
        expect(res.status.mock.calls.length).toBe(1)
        expect(res.status.mock.calls[0][0]).toBe(400)
        expect(res.send.mock.calls.length).toBe(1)
        expect(res.send.mock.calls[0][0]).toBe("a response")
        expect(res.send.mock.calls[0][0]).not.toBe("some message")
    })

})