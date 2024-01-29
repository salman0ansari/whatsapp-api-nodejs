const wrap = require('../lib/wrap')
const err = require('../lib/custom-exception')
describe('test the handle', () => {
    test('wrap empty reject', async () => {
        var func = jest.fn(() => Promise.reject("something"))
        var next = jest.fn()
        var result = await wrap(func)(undefined,undefined,next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0].message).toBe("something")
        expect(next.mock.calls[0][0].status).toBe(500)
    })

    test('wrap throw general exception', async () => {
        var func = jest.fn(() => {throw 'something'})
        var next = jest.fn()
        var result = await wrap(func)(undefined,undefined,next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0].message).toBe("something")
        expect(next.mock.calls[0][0].status).toBe(500)
    })

    test('wrap throw general exception', async () => {
        var func = jest.fn(() => {throw new Error("Something")})
        var next = jest.fn()
        var result = await wrap(func)(undefined,undefined,next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0].message).toBe("Error: Something")
        expect(next.mock.calls[0][0].status).toBe(500)
    })

    test('wrap not empty reject', async () => {
        var error = new err("error local",400, "some cause")
        var func = jest.fn(() => Promise.reject(error))
        var next = jest.fn()
        var result = await wrap(func)(undefined,undefined,next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0].message).toBe(error.message)
        expect(next.mock.calls[0][0].status).toBe(error.status)
        expect(next.mock.calls[0][0].response).toBe(error.response)
    })

    test('wrap default res json sync', async () => {
        var resObject = { ok: true }
        var func = (req, res) => resObject // accepts exactly 2 params
        var next = jest.fn()
        var resJson = jest.fn()
        await wrap(func, { defaultJsonResponse: true })(undefined, { json: resJson }, next)
        expect(next.mock.calls.length).toBe(0)
        expect(resJson.mock.calls[0][0]).toBe(resObject)
    })

    test('wrap default res json async', async () => {
        var resObject = { ok: true }
        var func = async (req, res) => resObject // accepts exactly 2 params
        var next = jest.fn()
        var resJson = jest.fn()
        await wrap(func, { defaultJsonResponse: true })(undefined, { json: resJson }, next)
        expect(next.mock.calls.length).toBe(0)
        expect(resJson.mock.calls[0][0]).toBe(resObject)
    })

    test('wrap default res json not called on primitives', async () => {
        var func = async (req, res) => 5 // accepts exactly 2 params
        var next = jest.fn()
        var resJson = jest.fn()
        await wrap(func, { defaultJsonResponse: true })(undefined, { json: resJson }, next)
        expect(next.mock.calls.length).toBe(0)
        expect(resJson.mock.calls.length).toBe(0)
    })

    test('wrap next once enabled', async () => {
        var func = jest.fn((req, res, next) => {
            next("something1") // This direct call will not be wrapped with AppError
            return Promise.reject("something2")
        })
        var next = jest.fn()
        var result = await wrap(func)(undefined,undefined,next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0]).toBe("something1")
    })

    test('wrap next once disabled', async () => {
        var func = jest.fn((req, res, next) => {
            next("something1") // This direct call will not be wrapped with AppError
            return Promise.reject("something2")
        })
        var next = jest.fn()
        var result = await wrap(func, { nextOnce: false })(undefined,undefined,next)
        expect(next.mock.calls.length).toBe(2)
        expect(next.mock.calls[0][0]).toBe("something1")
        expect(next.mock.calls[1][0].message).toBe("something2")
        expect(next.mock.calls[1][0].status).toBe(500)
    })
})