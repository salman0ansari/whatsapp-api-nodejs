const { WhatsAppInstance } = require('../class/instance')
const fs = require('fs')
const path = require('path')

exports.init = async (req, res) => {
    const instance = new WhatsAppInstance()
    const data = await instance.init()
    WhatsAppInstances[data.key] = instance
    res.json({
        error: false,
        message: 'Initializing successfull',
        key: data.key,
    })
}

exports.qr = async (req, res) => {
    try {
        const qrcode = await WhatsAppInstances[req.query.key].instance.qrcode
        res.render('qrcode', {
            qrcode: qrcode,
        })
    } catch {
        res.json({
            qrcode: '',
        })
    }
}

exports.info = async (req, res) => {
    const instance = WhatsAppInstances[req.query.key]
    let data = ''
    try {
        data = await instance.getInstanceDetail()
    } catch (error) {
        data = {}
    }
    return res.json({
        error: false,
        message: 'Instance fetched successfully',
        instance_data: data,
    })
}

exports.restore = async (req, res, next) => {
    try {
        const restored = []
        const instances = fs.readdirSync(path.join(__dirname, '../sessiondata'))
        instances.forEach((instanceData) => {
            if (instanceData == '.gitkeep') {
                return
            }
            const key = instanceData.split('.')[0]
            const instance = new WhatsAppInstance()
            instance.key = key
            instance.init(instanceData)
            WhatsAppInstances[key] = instance
            restored.push(key)
        })
        return res.json({
            error: false,
            message: 'All instances restored',
        })
    } catch (error) {
        next(error)
    }
}

exports.logout = async (req, res) => {
    try {
        await WhatsAppInstances[req.query.key].instance?.sock?.logout()
    } catch (error) {
        console.log(error)
    }
    return res.json({
        error: false,
        message: 'logout successfull',
    })
}

exports.delete = async (req, res) => {
    try {
        await WhatsAppInstances[req.query.key].instance?.sock?.logout()
        delete WhatsAppInstances[req.query.key]
    } catch (error) {
        console.log(error)
    }
    return res.json({
        error: false,
        message: 'Instance deleted successfully',
    })
}
