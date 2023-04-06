import { RequestHandler, } from 'express';
import { body, validationResult } from 'express-validator';
import { WAMediaUpload } from "@adiwajshing/baileys"

import { createSession, getSession, sessionExists } from '../session.js';

const text: RequestHandler[] = [
    body('sessionid').notEmpty(),
    body('to').notEmpty(),
    body('text').notEmpty(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { sessionid: sessionId, to, text } = req.body;
            const sock = getSession(sessionId);
            if (!sock) return res.status(400).send({
                error: true,
                message: 'session not found'
            })

            const message = await sock.sendMessage(to, { text });
            return res.status(200).send({
                status: 200,
                message,
            })
        }
        catch (e) {
            console.log(e)
            return res.status(400).send({ error: 'session already exists' })
        }
    }
]

const image: RequestHandler[] = [
    body('sessionid').notEmpty(),
    body('to').notEmpty(),
    body('image').notEmpty(),
    body('caption').optional(),
    async (req, res) => {
        try {
            interface ImageRequestBody {
                sessionid: string;
                to: string;
                image: WAMediaUpload;
                caption?: string;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { sessionid: sessionId, to, image, caption }: ImageRequestBody = req.body;
            const sock = getSession(sessionId);
            if (!sock) return res.status(400).send({
                error: true,
                message: 'session not found'
            })

            const message = await sock.sendMessage(to, { image, caption });
            return res.status(200).send({
                status: 200,
                message,
            })
        }
        catch (e) {
            console.log(e)
            return res.status(400).send({
                error: true,
                message: 'session already exists'
            })
        }
    }
]

export {
    text
}