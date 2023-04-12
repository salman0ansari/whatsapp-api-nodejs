import { RequestHandler } from 'express';
import { createSession, getSession, sessionExists, bottle } from '../session.js';
import { body, query, validationResult } from 'express-validator';
import { qrHTML } from '../misc/qrcode.js';

const init: RequestHandler[] = [
    body('sessionid').notEmpty(),
    body('webhook').optional().isURL(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

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
]

const qr: RequestHandler[] = [
    query('sessionid').notEmpty(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

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
        catch (e) {
            console.log(e)
            return res.status(400).send({ error: 'session not found' })
        }
    }
]

const restore: RequestHandler[] = [
    query('sessionid').notEmpty(),
    query('webhook').optional().isURL(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { sessionid: sessionId, webhook = "" } = req.query as any;
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
]



export {
    init,
    qr,
    restore
} 