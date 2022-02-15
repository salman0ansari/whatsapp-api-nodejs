const express = require('express');
const controller = require('../controllers/message.controller');
const keyVerify = require("../middlewares/keyCheck")
const loginVerify = require("../middlewares/loginCheck")

const router = express.Router();
router.route('/text').get(controller.Text);

module.exports = router;