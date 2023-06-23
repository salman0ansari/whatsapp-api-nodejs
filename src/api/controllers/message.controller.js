exports.text = async (req, res) => {
    const { id, message } = req.body;
    if (!id || !message) return res.status(400).json({ error: true, message: 'id and message are required' })
    try {
        const data = await WhatsAppInstances[req.query.key].sendTextMessage(id, message);
        return res.status(201).json({ error: false, data: data });
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.image = async (req, res) => {
    const { id, caption } = req.body;
    const file = req.file;
    if (!id || !file) return res.status(400).json({ error: true, message: 'id and file are required' })
    try {
        const mediaFile = 'image';
        const data = await WhatsAppInstances[req.query.key].sendMediaFile(id, file, mediaFile, caption || '')
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.video = async (req, res) => {
    const { id, caption } = req.body;
    const file = req.file;
    if (!id || !file) return res.status(400).json({ error: true, message: 'id and file are required' })
    try {
        const mediaFile = 'video';
        const data = await WhatsAppInstances[req.query.key].sendMediaFile(id, req.file, mediaFile, caption || '')
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.audio = async (req, res) => {
    const { id } = req.body;
    const file = req.file;
    if (!id || !file) return res.status(400).json({ error: true, message: 'id and file are required' })
    try {
        const mediaFile = 'audio';
        const data = await WhatsAppInstances[req.query.key].sendMediaFile(id, file, mediaFile)
        return res.status(201).json({ error: false, data: data });
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.document = async (req, res) => {
    const { id, filename } = req.body;
    const file = req.file;
    if (!id || !file || !filename) return res.status(400).json({ error: true, message: 'id, file and filename are required' })
    try {
        const mediaFile = 'document';
        const data = await WhatsAppInstances[req.query.key].sendMediaFile(id, file, mediaFile, '', filename)
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.mediaUrl = async (req, res) => {
    const { id, url, type, mimetype, caption } = req.body;
    if (!id || !url || !type || !mimetype) return res.status(400).json({ error: true, message: 'id, url, type and mimetype are required' })
    try {
        const data = await WhatsAppInstances[req.query.key].sendUrlMediaFile(
            id,
            url,
            type, // Types are [image, video, audio, document]
            mimetype, // mimeType of mediaFile / Check Common mimetypes in `https://mzl.la/3si3and`
            caption || ''
        )
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.button = async (req, res) => {
    const { id, btndata } = req.body;
    if (!id || !btndata) return res.status(400).json({ error: true, message: 'id and btndata are required' })
    try {
        const data = await WhatsAppInstances[req.query.key].sendButtonMessage(id, btndata)
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.contact = async (req, res) => {
    const { id, vcard } = req.body;
    if (!id || !vcard) return res.status(400).json({ error: true, message: 'id and vcard are required' })
    try {
        const data = await WhatsAppInstances[req.query.key].sendContactMessage(id, vcard)
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.list = async (req, res) => {
    const { id, msgdata } = req.body;
    if (!id || !msgdata) return res.status(400).json({ error: true, message: 'id and msgdata are required' })
    try {
        const data = await WhatsAppInstances[req.query.key].sendListMessage(id, msgdata)
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.mediaButton = async (req, res) => {
    const { id, btndata } = req.body;
    if (!id || !btndata) return res.status(400).json({ error: true, message: 'id and btndata are required' })
    try {
        const data = await WhatsAppInstances[req.query.key].sendMediaButtonMessage(
            req.body.id,
            req.body.btndata
        )
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.setStatus = async (req, res) => {
    const presenceList = [
        'unavailable',
        'available',
        'composing',
        'recording',
        'paused',
    ]

    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ error: true, message: 'id and status are required' })
    if (!presenceList.includes(status)) {
        return res.status(400).json({
            error: true,
            message: `status must be one of the following: ${presenceList.join(
                ', '
            )}`,
        })
    }

    try {
        const data = await WhatsAppInstances[req.query.key]?.setStatus(status, id)
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.read = async (req, res) => {
    const { msg } = req.body;
    if (!msg) return res.status(400).json({ error: true, message: 'msg is required' })
    try {
        const data = await WhatsAppInstances[req.query.key].readMessage(msg)
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}

exports.react = async (req, res) => {
    const { id, key, emoji } = req.body;
    if (!id || !key || !emoji) return res.status(400).json({ error: true, message: 'id, key and emoji are required' })
    try {
        const data = await WhatsAppInstances[req.query.key].reactMessage(id, key, emoji)
        return res.status(201).json({ error: false, data: data })
    } catch (err) {
        return res.status(400).json({ error: true, message: err?.message || err })
    }
}
