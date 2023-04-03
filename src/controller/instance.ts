import { RequestHandler } from 'express';
import { createSession, getSession, sessionExists, bottle } from '../session.js';
import { qrHTML } from '../misc/qrcode.js';

const init: RequestHandler = async (req, res) => {
    try {
        const { sessionid: sessionId, webhook = "" } = req.body;
        if (sessionExists(sessionId)) return res.send({ error: 'session already exists' }).status(400)

        const sock = new createSession({ sessionId, webhook });
        sock.create()

        return res.status(200).send({
            message: 'session created',
            sessionId,
        });
    }
    catch (e) {
        console.log(e)
        return res.status(400).send({ error: 'session already exists' })
    }
}

const qr: RequestHandler = async (req, res) => {
    const sessionId = req.query['sessionid'] as string;
    const sock = getSession(sessionId);
    if (!sock) return res.status(400).send({ error: 'session not found' })

    const qr = await sock.getQr()
    if (!qr) return res.status(400).send({ error: 'qr not loaded or session invalid' })

    if (qr === "connected") {
        return res.status(200).send({ message: 'connected' });
    }
    return res.status(200).send(qrHTML(qr, sessionId));
}

const restore: RequestHandler = async (req, res) => {
    const { sessionid: sessionId, webhook = "" } = req.query as any;
    if (sessionExists(sessionId)) return res.send({ error: 'session already exists' }).status(400)

    const sock = new createSession({ sessionId, webhook });
    sock.create()

    return res.status(200).send({
        message: 'session created',
        sessionId,
    });
}



export {
    init,
    qr,
    restore
} 