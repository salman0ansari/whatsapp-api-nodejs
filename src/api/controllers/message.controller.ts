import { ReqHandler } from "../helper/types"
import getInstanceForReq from "../service/instance"

export const Text : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendTextMessage(
        req.body.id,
        req.body.message
    )
    return res.status(201).json({ error: false, data: data })
}

export const Image : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendMediaFile(
        req.body.id,
        req.file,
        'image',
        req.body?.caption
    )
    return res.status(201).json({ error: false, data: data })
}

export const Video : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendMediaFile(
        req.body.id,
        req.file,
        'video',
        req.body?.caption
    )
    return res.status(201).json({ error: false, data: data })
}

export const Audio : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendMediaFile(
        req.body.id,
        req.file,
        'audio'
    )
    return res.status(201).json({ error: false, data: data })
}

export const Document : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendMediaFile(
        req.body.id,
        req.file,
        'document',
        '',
        req.body.filename
    )
    return res.status(201).json({ error: false, data: data })
}

export const Mediaurl : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendUrlMediaFile(
        req.body.id,
        req.body.url,
        req.body.type, // Types are [image, video, audio, document]
        req.body.mimetype, // mimeType of mediaFile / Check Common mimetypes in `https://mzl.la/3si3and`
        req.body.caption
    )
    return res.status(201).json({ error: false, data: data })
}

export const Button : ReqHandler = async (req, res) => {
    // console.log(res.body)
    const data = await getInstanceForReq(req).sendButtonMessage(
        req.body.id,
        req.body.btndata
    )
    return res.status(201).json({ error: false, data: data })
}

export const Contact : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendContactMessage(
        req.body.id,
        req.body.vcard
    )
    return res.status(201).json({ error: false, data: data })
}

export const List : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendListMessage(
        req.body.id,
        req.body.msgdata
    )
    return res.status(201).json({ error: false, data: data })
}

export const MediaButton : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).sendMediaButtonMessage(
        req.body.id,
        req.body.btndata
    )
    return res.status(201).json({ error: false, data: data })
}

export const SetStatus : ReqHandler = async (req, res) => {
    const presenceList = [
        'unavailable',
        'available',
        'composing',
        'recording',
        'paused',
    ]
    if (presenceList.indexOf(req.body.status) === -1) {
        return res.status(400).json({
            error: true,
            message:
                'status parameter must be one of ' + presenceList.join(', '),
        })
    }

    const data = await getInstanceForReq(req)?.setStatus(
        req.body.status,
        req.body.id
    )
    return res.status(201).json({ error: false, data: data })
}

export const Read : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).readMessage(req.body.msg)
    return res.status(201).json({ error: false, data: data })
}

export const React : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).reactMessage(req.body.id, req.body.key, req.body.emoji)
    return res.status(201).json({ error: false, data: data })
}
