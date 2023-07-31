const config = require('../../config/config')

function tokenVerification(req, res, next) {
    const bearer = req.headers.authorization
    const token = bearer?.slice(7)?.toString()
    if (!token) {
        return res.status(403).send({
            error: true,
            message: 'no bearer token header was present',
        })
    }

    if (config.token !== token) {
        return res
            .status(403)
            .send({ error: true, message: 'invalid bearer token supplied' })
    }
    next()
}

module.exports = tokenVerification
