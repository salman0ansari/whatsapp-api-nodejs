const index = require('../lib/index')

describe('test the index exports', () => {
    test('has exception exported', async () => {
        expect(index.exception).not.toBeUndefined()
    })

    test('has default middleware exported', async () => {
        expect(index.middleware).not.toBeUndefined()
    })

    test('has default wrap exported', async () => {
        expect(index.wrap).not.toBeUndefined()
    })

    test('has default wrap exported', async () => {
        expect(index.handle).not.toBeUndefined()
    })
})