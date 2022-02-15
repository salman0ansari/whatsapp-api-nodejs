exports.Text = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendTextMessage(
        req.query.id,
        req.query.message
    );
    return res.status(201).json({ error: false, data: data });
}
