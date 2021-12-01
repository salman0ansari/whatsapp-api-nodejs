const { MessageType } = require("@adiwajshing/baileys")
const router = require('express').Router()
const InstanceKeyVerification = require("../Middleware/keyVerify")
const InstanceLoginVerification = require("../Middleware/loginVerify")

const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage, inMemory: true }).single('file')

router.post('/sendText', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendTextMessage(
        req.body.msg_data.id,
        req.body.msg_data.message
    );
    res.status(201).json({
        error: false,
        data: data
    });
})

router.post('/sendImage', InstanceKeyVerification, InstanceLoginVerification,  upload, async (req, res) => {
    // console.log(req.file)
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendMediaFile(
        req.query.id,
        req.query.caption,
        MessageType.image,
        req.file
    );
    res.status(201).json({
        error: false,
        data: data,
    });
})


router.post('/sendVideo', InstanceKeyVerification, InstanceLoginVerification, upload, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendMediaFile(
        req.query.id,
        req.query.caption,
        MessageType.video,
        req.file
    );
    res.status(201).json({
        error: false,
        data: data,
    });
})

router.post('/sendAudio', InstanceKeyVerification, InstanceLoginVerification, upload, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendMediaFile(
        req.query.id,
        "",
        MessageType.audio,
        req.file
        );
    res.status(201).json({
        error: false,
        data: data,
    });
})

router.post('/sendDocument', InstanceKeyVerification, InstanceLoginVerification, upload, async (req, res) => {
    // console.log(req.files.document.name)
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendDocument(
        req.query.id, 
        MessageType.document, 
        req.file
        );
    res.status(201).json({
        error: false,
        data: data,
    });
})

router.post('/sendLocation', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendLocationMessage(
        req.body.msg_data.id,
        req.body.msg_data.coordinates.lat,
        req.body.msg_data.coordinates.long
    );
    res.status(201).json({
        error: false,
        data: data,
    });
})

router.post('/sendVCardMessage', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendVCardMessage(req.body.msg_data.id, req.body.msg_data);
    res.status(201).json({
        error: false,
        data: data,
    });
})

router.post('/sendButtonMessage', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.sendButtonMessage(req.body.msg_data.id, req.body.msg_data);
    res.status(201).json({
        error: false,
        data: data,
    });
})

module.exports = router;