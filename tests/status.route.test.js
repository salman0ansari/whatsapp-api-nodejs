const request = require('supertest')
const assert = require('assert')
const app = require('../src/server')
const { protectRoutes } = require('../src/config/config')

if (protectRoutes) {
    describe('instance endpoints', () => {
        it('should fail with no bearer token is present', (done) => {
            request(app)
                .get('/status')
                .expect(403)
                .then((res) => {
                    assert(res.body.message, 'Initializing successfully')
                    done()
                })
                .catch((err) => done(err))
        })

        it('should fail with bearer token is mismatch', (done) => {
            request(app)
                .get('/status')
                .set('Authorization', `Bearer ${process.env.TOKEN}wrong`)
                .expect(403)
                .then((res) => {
                    assert(res.body.message, 'invalid bearer token supplied')
                    done()
                })
                .catch((err) => done(err))
        })

        it('should successfully when bearer token is present and matched', (done) => {
            request(app)
                .get('/status')
                .set('Authorization', `Bearer ${process.env.TOKEN}`)
                .expect(200)
                .then((res) => {
                    assert(res.body, 'OK')
                    done()
                })
                .catch((err) => done(err))
        })
    })
}
