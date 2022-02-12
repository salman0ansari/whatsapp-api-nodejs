const express = require('express');
const controller = require('../controllers/instance.controller');
const keyVerify = require("../middlewares/keyCheck")

const router = express.Router();
router.route('/init').get(controller.init);
router.route('/qr').get(keyVerify, controller.qr);
router.route('/info').get(keyVerify, controller.info);
router.route('/restore').get(controller.restore);

module.exports = router;