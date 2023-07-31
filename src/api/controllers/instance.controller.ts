import WhatsAppInstance from '../class/instance'
import config from '../../config/config'
import Session from '../class/session'
import { ReqHandler } from '../helper/types'
import getInstanceForReq, { getInstanceService } from '../service/instance'
import getDatabase from '../service/database'

export const init : ReqHandler = async (req, res) => {
    const key = <string> req.query.key
    const webhook = !req.query.webhook ? false : !!req.query.webhook
    const webhookUrl = !req.query.webhookUrl ? null : req.query.webhookUrl
    const appUrl = config.appUrl || req.protocol + '://' + req.headers.host
    const instance = new WhatsAppInstance(key, webhook, webhookUrl)
    const data = await instance.init()
    let instances = getInstanceService(req.app).instances
    instances[data.key] = instance
    res.json({
        error: false,
        message: 'Initializing successfully',
        key: data.key,
        webhook: {
            enabled: webhook,
            webhookUrl: webhookUrl,
        },
        qrcode: {
            url: appUrl + '/instance/qr?key=' + data.key,
        },
        browser: config.browser,
    })
}

export const qr : ReqHandler = async (req, res) => {
    try {
        const qrcode = await getInstanceForReq(req)?.instance.qr
        res.render('qrcode', {
            qrcode: qrcode,
        })
    } catch {
        res.json({
            qrcode: '',
        })
    }
}

export const qrbase64 : ReqHandler = async (req, res) => {
    try {
        const qrcode = await getInstanceForReq(req)?.instance.qr
        res.json({
            error: false,
            message: 'QR Base64 fetched successfully',
            qrcode: qrcode,
        })
    } catch {
        res.json({
            qrcode: '',
        })
    }
}

export const info : ReqHandler = async (req, res) => {
    const instance = getInstanceForReq(req)
    let data
    try {
        data = await instance.getInstanceDetail(<string> req.query.key)
    } catch (error) {
        data = {}
    }
    return res.json({
        error: false,
        message: 'Instance fetched successfully',
        instance_data: data,
    })
}

export const restore : ReqHandler = async (req, res, next) => {
    try {
        const session = new Session()
        let restoredSessions = await session.restoreSessions()
        return res.json({
            error: false,
            message: 'All instances restored',
            data: restoredSessions,
        })
    } catch (error) {
        next(error)
    }
}

export const logout : ReqHandler = async (req, res) => {
    let errormsg
    try {
        await getInstanceForReq(req).instance?.sock?.logout()
    } catch (error) {
        errormsg = error
    }
    return res.json({
        error: false,
        message: 'logout successfull',
        errormsg: errormsg ? errormsg : null,
    })
}

export const remove : ReqHandler = async (req, res) => {
    let errormsg
    try {
        await getInstanceForReq(req).deleteInstance(<string> req.query.key)
        let instances = getInstanceService(req.app).instances
        delete instances[<string> req.query.key]
    } catch (error) {
        errormsg = error
    }
    return res.json({
        error: false,
        message: 'Instance deleted successfully',
        data: errormsg ? errormsg : null,
    })
}

export const list : ReqHandler = async (req, res) => {
    let instances = getInstanceService(req.app).instances

    if (req.query.active) {
        let instance : string[] = []
        const db = getDatabase(req.app)
        const result = await db.listCollections().toArray()
        result.forEach((collection) => {
            instance.push(collection.name)
        })

        return res.json({
            error: false,
            message: 'All active instance',
            data: instance,
        })
    }

    let instance = Object.keys(instances).map(async (key) =>
        instances[key].getInstanceDetail(key)
    )
    let data = await Promise.all(instance)
    
    return res.json({
        error: false,
        message: 'All instance listed',
        data: data,
    })
}
