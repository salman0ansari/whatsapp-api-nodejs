const express = require('express')
const controller = require('../controllers/group.controller')
const keyVerify = require('../middlewares/keyCheck')
const loginVerify = require('../middlewares/loginCheck')

const router = express.Router()

router.route('/create').post(keyVerify, loginVerify, controller.create)
router.route('/listall').get(keyVerify, loginVerify, controller.ListAll)

module.exports = router
