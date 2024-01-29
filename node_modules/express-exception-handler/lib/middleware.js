function exceptionMiddleware (err, _, res, __) {
    res.status(err.status).send(err.response || err.message);
}

module.exports = exceptionMiddleware