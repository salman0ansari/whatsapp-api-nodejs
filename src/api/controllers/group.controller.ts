import { ReqHandler } from '../helper/types'
import getInstanceForReq from '../service/instance'
    
export const create : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).createNewGroup(
        req.body.name,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

export const addNewParticipant : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).addNewParticipant(
        req.body.id,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

export const makeAdmin : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).makeAdmin(
        req.body.id,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

export const demoteAdmin : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).demoteAdmin(
        req.body.id,
        req.body.users
    )
    return res.status(201).json({ error: false, data: data })
}

export const listAll : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).getAllGroups(
        req.query.key
    )
    return res.status(201).json({ error: false, data: data })
}

export const leaveGroup : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).leaveGroup(<string> req.query.id)
    return res.status(201).json({ error: false, data: data })
}

export const getInviteCodeGroup : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).getInviteCodeGroup(
        <string> req.query.id
    )
    return res
        .status(201)
        .json({ error: false, link: 'https://chat.whatsapp.com/' + data })
}

export const getInstanceInviteCodeGroup : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).getInstanceInviteCodeGroup(<string> req.query.id)
    return res
        .status(201)
        .json({ error: false, link: 'https://chat.whatsapp.com/' + data })
}

export const getAllGroups : ReqHandler = async (req, res) => {
    const instance = getInstanceForReq(req)
    let data
    try {
        data = await instance.groupFetchAllParticipating()
    } catch (error) {
        data = {}
    }
    return res.json({
        error: false,
        message: 'Instance fetched successfully',
        instance_data: data,
    })
}

export const groupParticipantsUpdate : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).groupParticipantsUpdate(
        req.body.id,
        req.body.users,
        req.body.action
    )
    return res.status(201).json({ error: false, data: data })
}

export const groupSettingUpdate : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).groupSettingUpdate(
        req.body.id,
        req.body.action
    )
    return res.status(201).json({ error: false, data: data })
}

export const groupUpdateSubject : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).groupUpdateSubject(
        req.body.id,
        req.body.subject
    )
    return res.status(201).json({ error: false, data: data })
}

export const groupUpdateDescription : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).groupUpdateDescription(
        req.body.id,
        req.body.description
    )
    return res.status(201).json({ error: false, data: data })
}

export const groupInviteInfo : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).groupGetInviteInfo(
        req.body.code
    )
    return res.status(201).json({ error: false, data: data })
}

export const groupJoin : ReqHandler = async (req, res) => {
    const data = await getInstanceForReq(req).groupAcceptInvite(
        req.body.code
    )
    return res.status(201).json({ error: false, data: data })
}
