
import express from 'express'
import instanceRoutes from './instance.route'
import messageRoutes from './message.route'
import miscRoutes from './misc.route'
import groupRoutes from './group.route'

const router = express.Router()

router.get('/status', (req, res) => res.send('OK'))
router.use('/instance', instanceRoutes)
router.use('/message', messageRoutes)
router.use('/group', groupRoutes)
router.use('/misc', miscRoutes)

export default router
