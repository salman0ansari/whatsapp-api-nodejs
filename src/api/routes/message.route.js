const express = require('express');
const controller = require('../controllers/message.controller');
const keyVerify = require("../middlewares/keyCheck")
const loginVerify = require("../middlewares/loginCheck")
const multer  = require('multer')

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage, inMemory: true }).single('file')

router.route('/text').post(controller.Text);
router.route('/image').post(upload, controller.Image);
router.route('/video').post(upload, controller.Video);
router.route('/audio').post(upload, controller.Audio);
router.route('/document').post(upload, controller.Document);

module.exports = router;