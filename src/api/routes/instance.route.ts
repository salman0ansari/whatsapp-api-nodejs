import express from 'express'
import * as controller from '../controllers/instance.controller'
import keyVerify from '../middlewares/keyCheck'
import loginVerify from '../middlewares/loginCheck'

const router = express.Router()

router.route('/init').get(controller.init)
router.route('/qr').get(keyVerify, controller.qr)
router.route('/qrbase64').get(keyVerify, controller.qrbase64)
router.route('/info').get(keyVerify, controller.info)
router.route('/restore').get(controller.restore)
router.route('/logout').delete(keyVerify, loginVerify, controller.logout)
router.route('/delete').delete(keyVerify, controller.remove)
router.route('/list').get(controller.list)

export default router
