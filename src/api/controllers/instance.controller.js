const { WhatsAppInstance } = require("../class/instance")

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