import express from "express";
import chatRouter from "./chat.js"
import instanceRouter from "./instance.js"

const router = express.Router()

router.get('/status', (req, res) => res.send('OK'))

router.use('/chat', chatRouter)
router.use('/instance', instanceRouter)

export default router as express.Router
