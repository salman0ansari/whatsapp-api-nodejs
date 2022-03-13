const express = require('express')
const controller = require('../controllers/group.controller')
const keyVerify = require('../middlewares/keyCheck')
const loginVerify = require('../middlewares/loginCheck')

const router = express.Router()

router.route('/create').post(keyVerify, loginVerify, controller.create)
// note: these 2 function might not work for now because
//       i have'nt implement a data store yet.
router.route('/listall').get(keyVerify, loginVerify, controller.ListAll)
router.route('/leave').get(keyVerify, loginVerify, controller.leaveGroup)

module.exports = router
