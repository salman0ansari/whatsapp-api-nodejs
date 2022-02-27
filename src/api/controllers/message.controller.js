exports.Text = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendTextMessage(
        req.query.id,
        req.query.message
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Image = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.query?.caption,
        req.file,
        'image'
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Video = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.query?.caption,
        req.file,
        'video'
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Audio = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.file,
        'audio'
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Document = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.file,
        'document'
    )
    return res.status(201).json({ error: false, data: data })
}

exports.mediaurl = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendUrlMediaFile(
        req.query.id,
        req.query.url,
        req.query.caption,
        req.query.type, // Types are [image, video, audio, document]
        req.query.mimetype // mimeType of mediaFile / Common mimetypes `https://mzl.la/3si3and`
    )
    return res.status(201).json({ error: false, data: data })
}
