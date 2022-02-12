const { WhatsAppInstance } = require("../class/instance")
const fs = require("fs")

exports.init = async (req, res) => {
        const instance = new WhatsAppInstance();
        const data = await instance.init();
        WhatsAppInstances[data.key] = instance;
        res.json({
            error: false,
            message: "Initializing successfull",
            key: data.key
        });
}

exports.qr = async (req, res) => {
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
}

exports.info = async (req, res) => {
    instance_key = req.query.key
    const instance = WhatsAppInstances[instance_key];
    let data = ""
    console.log(data)
    try {
        data = await instance.getInstanceDetail();
    }
    catch (error){
        data = {}
    }
    res.json({
        error: false,
        message: "Instance fetched successfully",
        instance_data: data,
    });
}

exports.restore = async (req, res) => {
    const restored = [];
    const instances = fs.readdirSync("./api/sessiondata");
    instances.forEach((instanceData) => {
        if (instanceData == ".gitkeep") {
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
}