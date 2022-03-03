exports.create = async (req, res) => {
    console.log(req.body.name)
    console.log(req.body.users)
    const data = await WhatsAppInstances[req.query.key].createNewGroup(
        req.body.name,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}
