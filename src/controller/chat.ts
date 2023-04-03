import { RequestHandler } from 'express';
import { createSession, getSession, sessionExists } from '../session.js';

const text: RequestHandler = async (req, res) => {
    const { sessionid: sessionId, to, text } = req.body;
    const sock = getSession(sessionId);
    if (!sock) return res.status(400).send({ error: 'session not found' })

    const message = await sock.sendMessage(to, { text });
    return res.status(200).send({ message });
}

export {
    text
}