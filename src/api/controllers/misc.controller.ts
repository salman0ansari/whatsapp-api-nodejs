exports.onWhatsapp = async (req, res) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const data = await WhatsAppInstances[req.query.key]?.verifyId(
        WhatsAppInstances[req.query.key]?.getWhatsAppId(req.query.id)
    )
    return res.status(201).json({ error: false, data: data })
}

exports.downProfile = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.DownloadProfile(
        req.query.id
    )
    return res.status(201).json({ error: false, data: data })
}

exports.getStatus = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.getUserStatus(
        req.query.id
    )
    return res.status(201).json({ error: false, data: data })
}

exports.blockUser = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.blockUnblock(
        req.query.id,
        req.query.block_status
    )
    if (req.query.block_status == 'block') {
        return res
            .status(201)
            .json({ error: false, message: 'Contact Blocked' })
    } else
        return res
            .status(201)
            .json({ error: false, message: 'Contact Unblocked' })
}

exports.updateProfilePicture = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].updateProfilePicture(
        req.body.id,
        req.body.url
    )
    return res.status(201).json({ error: false, data: data })
}

exports.getUserOrGroupById = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].getUserOrGroupById(
        req.query.id
    )
    return res.status(201).json({ error: false, data: data })
}
