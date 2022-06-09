const express = require('express')
const controller = require('../controllers/instance.controller')
const tokenVerify = require('../middlewares/tokenCheck')
const keyVerify = require('../middlewares/keyCheck')
const loginVerify = require('../middlewares/loginCheck')

const router = express.Router()
router.route('/init').get(tokenVerify, controller.init)
router.route('/qr').get(keyVerify, controller.qr)
router.route('/qrbase64').get(keyVerify, controller.qrbase64)
router.route('/info').get(keyVerify, controller.info)
router.route('/restore').get(tokenVerify, controller.restore)
router.route('/logout').delete(keyVerify, loginVerify, controller.logout)
router.route('/delete').delete(keyVerify, loginVerify, controller.delete)
router.route('/list').get(tokenVerify, controller.list)

module.exports = router
