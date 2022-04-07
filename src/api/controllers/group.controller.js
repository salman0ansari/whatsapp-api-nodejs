exports.create = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].createNewGroup(
        req.body.name,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

exports.addNewParticipant = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].addNewParticipant(
        req.body.id,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

exports.makeAdmin = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].makeAdmin(
        req.body.id,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

exports.demoteAdmin = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].demoteAdmin(
        req.body.id,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

exports.listAll = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].getAllGroups(
        req.query.key
    )
    return res.status(201).json({ error: false, data: data })
}

exports.leaveGroup = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].leaveGroup(req.query.id)
    return res.status(201).json({ error: false, data: data })
}

exports.getInviteCodeGroup = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].getInviteCodeGroup(
        req.query.id
    )
    return res
        .status(201)
        .json({ error: false, link: 'https://chat.whatsapp.com/' + data })
}
