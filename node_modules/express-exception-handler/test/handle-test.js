var handle = require('../lib/handle')

describe('test handle', () => {
    test('handle is called without throwing error', () => {
        jest.mock('express/lib/router/layer')
        handle()
        var Layer = require('express/lib/router/layer')
        var stubHandle = () => {}
        Layer.prototype.handle = stubHandle
        expect(Layer.prototype.handle).toBe(Layer.prototype.__handle)
        handle() // call again to check there are no exceptions
    })
})
