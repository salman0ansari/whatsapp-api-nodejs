exports.Text = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendTextMessage(
        req.query.id,
        req.query.message
    );
    return res.status(201).json({ error: false, data: data });
}

exports.Image = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.query?.caption,
        req.file,
        "image"
    );
    return res.status(201).json({ error: false, data: data });
}

exports.Video = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.query?.caption,
        req.file,
        "video"
    );
    return res.status(201).json({ error: false, data: data });
}

exports.Audio = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.query?.caption,
        req.file,
        "audio"
    );
    return res.status(201).json({ error: false, data: data });
}

exports.document = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.query.id,
        req.query?.caption,
        req.file,
        "document"
    );
    return res.status(201).json({ error: false, data: data });
}

