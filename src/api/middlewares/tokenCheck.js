const config = require('../../config/config')

function tokenVerification(req, res, next) {
    const token = req.query['token']?.toString()
    if (!token) {
        return res
            .status(403)
            .send({ error: true, message: 'no token query was present' })
    }

    if (config.token !== token) {
        return res
            .status(403)
            .send({ error: true, message: 'invalid token supplied' })
    }
    next()
}

module.exports = tokenVerification
