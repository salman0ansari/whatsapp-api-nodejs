require('dotenv').config()
const fs = require("fs")
const { WhatsAppInstance } = require("../Objects/instanceClass")
const router = require('express').Router()
const rateLimit = require("express-rate-limit");

const path = './Instances'
global.WhatsAppInstances = {};

const InstanceKeyVerification = require("../Middleware/keyVerify.js")
const InstanceLoginVerification = require("../Middleware/loginVerify.js");

const apiLimiter = rateLimit({
    windowMs: 3600000, // 1 hour;
    max: 5,
    message: {
        error: true,
        message: "Too many accounts created from this IP, please try again after an hour"
        }
  });

// Initialize Instance
router.get('/init', apiLimiter, async (req, res) => {
    const instance = new WhatsAppInstance();
    const data = await instance.init();
    WhatsAppInstances[data.key] = instance;
    res.json({
        error: false,
        message: "Initializing successfull",
        key: data.key
    });
})

// Generate qrCode to Scan
router.get('/qrcode', InstanceKeyVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    try {
        const qrcode = await instance.instance.qrcode;
        const instance_key = instance.key;
        res.render('qrcode', {
            qrcode: qrcode,
            instance_key: instance_key,
            PUSHER_KEY: process.env.PUSHER_KEY
        })
    } catch {
        res.json({
            qrcode: "",
        });
    }
})

// Get Info Related to Instance
router.get('/instance', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    instance_key = req.query.key
    const instance = WhatsAppInstances[instance_key];
    let data = ""
    try {
        data = await instance.getInstanceDetails();
    }
    catch {
        data = {}
    }
    res.json({
        error: false,
        message: "Instance fetched successfully",
        instance_key: instance_key,
        instance_data: data,
    });
})

// Logout a Instance
router.delete('/logout', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    await instance.conn?.logout();
    res.json({
        error: false,
        message: "logout successfull"
    })
})

// Delete a Instance
router.delete('/delete', InstanceKeyVerification, async (req, res) => {
    let instance_key = req.query.key
    const instance = WhatsAppInstances[instance_key];
    await instance.conn?.logout();
    delete WhatsAppInstances[instance_key];
    try {
        fs.unlinkSync(`${path}${instance_key}.json`);
    } catch { }

    res.json({
        error: false,
        message: "Instance deleted successfully",
    });
})

// Restore all Instances
router.get('/restore', async (req, res) => {
    const restored = [];
    const instances = fs.readdirSync(path);
    instances.forEach((instanceData) => {
        if (instanceData == ".keep") {
            return;
        }
        const key = instanceData.split(".")[0];
        const instance = new WhatsAppInstance();
        instance.key = key;
        instance.init(instanceData);
        WhatsAppInstances[key] = instance;
        restored.push(key);
    });

    res.json({
        error: false,
        message: "All instances restored",
    });
})

module.exports = router;
