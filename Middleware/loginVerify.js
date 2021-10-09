function InstanceLoginVerification(req, res, next) {

    const key = req.query["key"]

    if (!key) {
        res.status(401).send(({ error: true, message: "Phone not connected" }))
    }

    const instance = WhatsAppInstances[key];
    if (!instance.instance.conn.phoneConnected) {
        res.status(401).send(({ error: true, message: "Phone not connected" }))
    }
    next()
}

module.exports = InstanceLoginVerification