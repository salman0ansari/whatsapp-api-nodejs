function InstanceLoginVerification(req, res, next) {

    const key = req.query["key"]

    if (!key) {
        res.status(403).send(({ error: true, message: 'no key query was present' }))
    }

    const instance = WhatsAppInstances[key];
    if (!instance.instance.conn.phoneConnected) {
        res.status(401).send(({ error: true, message: "phone isn't connected" }))
    }
    next()
}

module.exports = InstanceLoginVerification