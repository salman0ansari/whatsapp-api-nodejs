const express = require('express')
const controller = require('../controllers/misc.controller')
const keyVerify = require('../middlewares/keyCheck')
const loginVerify = require('../middlewares/loginCheck')

const router = express.Router()

router.route('/onwhatsapp').get(keyVerify, loginVerify, controller.onWhatsapp)
router.route('/downProfile').get(keyVerify, loginVerify, controller.downProfile)

module.exports = router
