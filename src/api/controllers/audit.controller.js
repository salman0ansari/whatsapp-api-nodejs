const { AuditMessages } = require("../class/audit")

exports.find = async (req, res) => {
    const query = {}

    if (req.query.id) 
        query.id = req.query.id

    if (req.query.key)
        query.identificator = req.query.key

    const result = await AuditMessages.find(query)
    return res.status(200).json({ error: false, data: result })
}