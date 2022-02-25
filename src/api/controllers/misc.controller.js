exports.onWhatsapp = async (req, res) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const data = await WhatsAppInstances[req.query.key]?.verifyId(
        WhatsAppInstances[req.query.key]?.getWhatsAppId(req.query.id)
    )
    return res.status(201).json({ error: false, data: data })
}
