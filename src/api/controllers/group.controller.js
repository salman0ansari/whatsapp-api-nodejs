exports.create = async (req, res) => {
    // console.log(req.body.name)
    // console.log(req.body.users)
    const data = await WhatsAppInstances[req.query.key].createNewGroup(
        req.body.name,
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
    const data = await WhatsAppInstances[req.query.key].leaveGroup(
        req.query.id
    )
    return res.status(201).json({ error: false, data: data })
}