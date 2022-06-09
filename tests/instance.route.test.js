const request = require('supertest')
const assert = require('assert')
const app = require('../src/server')

describe('instance endpoints', () => {
  it('should fail init with no token is present', (done) => {
    request(app)
    .get('/instance/init')
    .expect(403)
    .then(res => {
      assert(res.body.message, 'Initializing successfully')
      done()
    })
    .catch(err => done(err))
  })

  it('should fail restore with no token is present', (done) => {
    request(app)
    .get('/instance/restore')
    .expect(403)
    .then(() => {
      done()
    })
    .catch(err => done(err))
  })

  it('should fail list with no token is present', (done) => {
    request(app)
    .get('/instance/list')
    .expect(403)
    .then(() => {
      done()
    })
    .catch(err => done(err))
  })

  it('should successfully init when token is present', (done) => {
    request(app)
    .get('/instance/init?token=' + process.env.TOKEN)
    .expect(200)
    .then(res => {
      assert(res.body.message, 'Initializing successfully')
      done()
    })
    .catch(err => done(err))
  })
})