function InstanceKeyVerification (req, res, next) {
    const key = req.query["key"]
    if (!key) {
        return res.status(401).send({ error: true, message: 'Invalid or Key is Missing' });
    }
    const instance = WhatsAppInstances[key];
    if (!instance) {
        return res.status(401).send({ error: true, message: 'Invalid or Key is Missing' });
    }
    next()
}

module.exports = InstanceKeyVerification