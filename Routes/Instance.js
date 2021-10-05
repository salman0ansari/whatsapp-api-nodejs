const fs = require("fs")
const { WhatsAppInstance } = require("../Objects/instanceClass")
const router = require('express').Router()

const path = './Instances'
global.WhatsAppInstances = {};

const InstanceKeyVerification = require("../Middleware/keyVerify.js")
const InstanceLoginVerification = require("../Middleware/loginVerify.js");

// Initialize Instance
router.get('/init', async (req, res) => {
    const instance = new WhatsAppInstance();
    const data = await instance.init();
    WhatsAppInstances[data.key] = instance;
    res.json({
        error: false,
        message: "Initializing successfull",
        key: data.key,
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
            instance_key: instance_key
        })
    } catch {
        res.json({
            qrcode: "",
        });
    }
})

// Get Info Related to Instances
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
    return await instance.logout();
})

// Delete a Instance
router.delete('/delete', InstanceKeyVerification, async (req, res) => {
    let instance_key = req.query.key
    const instance = WhatsAppInstances[instance_key];
    await instance.logout();
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
