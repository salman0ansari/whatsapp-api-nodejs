import { RequestHandler } from 'express';
import { createSession, getSession, sessionExists } from './instance';
import { qrHTML } from './helper/qrcode';

const init: RequestHandler = async (req, res) => {
    try {
        const sessionId = req.query['sessionid'] as string
        if (sessionExists(sessionId)) return res.send({ error: 'session already exists' }).status(400)

        const sock = new createSession({ sessionId });
        sock.create()

        return res.status(200).send({
            message: 'session created',
            sessionId,
        });
    }
    catch (e) {
        return res.status(400).send({ error: 'session already exists' })
    }
}

export {
    init
} 