const express = require('express')
const controller = require('../controllers/audit.controller')

const router = express.Router()

router.route('/find').get(controller.find)

module.exports = router