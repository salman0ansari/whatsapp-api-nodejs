/* eslint-disable no-unsafe-optional-chaining */
import QRCode from 'qrcode'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import { DisconnectReason, GroupMetadata, GroupParticipant, WAMessage, default as makeWASocket, proto } from '@whiskeysockets/baileys'
import { v4 as uuidv4 } from 'uuid'
import processButton, { ButtonDef } from '../helper/processbtn'
import generateVC, { VCardData } from '../helper/genVc'
import Chat, { ChatType } from '../models/chat.model'
import axios from 'axios'
import config from '../../config/config'
import downloadMessage from '../helper/downloadMsg'
import useMongoDBAuthState, { AuthState } from '../helper/mongoAuthState'
import { AppType, FileType, TypeOfPromise } from '../helper/types'
import getDatabase, { CollectionType } from '../service/database'
import processMessage, { MediaType } from '../helper/processmessage'

const logger = pino()

type WASocket = ReturnType<typeof makeWASocket>

// The following types are used instead of the ones from whiskeysockets because that's the public interface.
// except on the ByApp calls that are `private`, supposedly.

export type Lock = 'block' | 'unblock'

export type Status = 'unavailable' | 'available' | 'composing' | 'recording' | 'paused'

export type ParticipantAction = 'add' | 'remove' | 'promote' | 'demote'

export type GroupAction = 'announcement' | 'locked' | 'not_announcement' | 'unlocked'

export interface ButtonMessage {
    buttons: ButtonDef[]
    text?: string
    footerText?: string
}

export interface ListMessage { 
    text: string 
    sections?: any
    buttonText?: string
    description?: string
    title?: string 
}

export interface MediaButtonMessage {
    mediaType: MediaType
    image?: string
    footerText?: string
    text?: string
    buttons?: ButtonDef[]
    mimeType: string
}

export interface MessageKey {
    remoteJid?: (string|null);
    fromMe?: (boolean|null);
    id?: (string|null);
    participant?: (string|null);
}

class WhatsAppInstance {
    app: AppType
    socketConfig = {
        defaultQueryTimeoutMs: undefined,
        printQRInTerminal: false,
        logger: pino({
            level: config.log.level,
        }),
    }
    key = ''
    authState: AuthState | null = null
    collection: CollectionType | null = null
    allowWebhook: boolean | null = null
    webhook = undefined

    instance = {
        key: this.key,
        chats: <ChatType[]> [],
        qr: '',
        messages: <WAMessage[]> [],
        qrRetry: 0,
        customWebhook: '',
        sock: <WASocket | null> null,
        online: false,
    }

    axiosInstance = axios.create({
        baseURL: config.webhookUrl,
    })


    constructor(app: AppType, key?: string, allowWebhook?: boolean, webhook?: any) {
        this.app = app;
        this.key = key ? key : uuidv4()
        this.instance.customWebhook = this.webhook ? this.webhook : webhook
        this.allowWebhook = config.webhookEnabled
            ? config.webhookEnabled
            : (allowWebhook ?? null)
        if (this.allowWebhook && this.instance.customWebhook !== null) {
            this.allowWebhook = true
            this.instance.customWebhook = webhook
            this.axiosInstance = axios.create({
                baseURL: webhook,
            })
        }
    }

    async SendWebhook(type: string, body: any, key: string) {
        if (!this.allowWebhook) return
        this.axiosInstance
            .post('', {
                type,
                body,
                instanceKey: key,
            })
            .catch(() => {})
    }

    async init() {
        const db = getDatabase(this.app)
        this.collection = db.collection(this.key)
        const { state, saveCreds } = await useMongoDBAuthState(this.collection)
        this.authState = { state: state, saveCreds: saveCreds }
        const socketConfig = {
            auth: this.authState.state,
            browser: <[string, string, string]> Object.values(config.browser),
            ...this.socketConfig
        }
        this.instance.sock = makeWASocket(socketConfig)
        this.setHandler()
        return this
    }

    setHandler() {
        const sock = this.instance.sock

        const baileysEvents = [
            'creds.update',
            'messaging-history.set',
            'chats.upsert',
            'chats.update',
            'chats.delete',
            'presence.update',
            // 'contacts.upsert',
            // 'contacts.update',
            'messages.delete',
            // 'messages.update',
            // 'messages.media-update',
            'messages.upsert',
            // 'messages.reaction',
            // 'message-receipt.update',
            'groups.upsert',
            'groups.update',
            'group-participants.update',
            // 'blocklist.set',
            // 'blocklist.update',
            // 'call',
            // 'labels.edit',
            // 'labels.association',
        ];

        // on credentials update save state
        sock?.ev.on('creds.update', async (creds) => {
            if (this.authState?.state) 
                this.authState.state.creds = {
                    ...this.authState.state.creds,
                    ...creds
                }
            this.authState?.saveCreds()
        })

        // on socket closed, opened, connecting
        sock?.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            if (connection === 'connecting') return

            if (connection === 'close') {
                // reconnect if not logged out
                if (
                    (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                ) {
                    await this.init()
                } else {
                    await this.collection?.drop().then((r: any) => {
                        logger.info('STATE: Droped collection')
                    })
                    this.instance.online = false
                }

                if (
                    [
                        'all',
                        'connection',
                        'connection.update',
                        'connection:close',
                    ].some((e) => config.webhookAllowedEvents.includes(e))
                )
                    await this.SendWebhook(
                        'connection',
                        {
                            connection: connection,
                        },
                        this.key
                    )
            } else if (connection === 'open') {
                if (config.mongoose.enabled) {
                    let alreadyThere = await Chat.findOne({
                        key: this.key,
                    }).exec()
                    if (!alreadyThere) {
                        const saveChat = new Chat({ key: this.key })
                        await saveChat.save()
                    }
                }
                this.instance.online = true
                if (
                    [
                        'all',
                        'connection',
                        'connection.update',
                        'connection:open',
                    ].some((e) => config.webhookAllowedEvents.includes(e))
                )
                    await this.SendWebhook(
                        'connection',
                        {
                            connection: connection,
                        },
                        this.key
                    )
            }

            if (qr) {
                QRCode.toDataURL(qr).then((url) => {
                    this.instance.qr = url
                    this.instance.qrRetry++
                    if (this.instance.qrRetry >= Number(config.instance.maxRetryQr)) {
                        // close WebSocket connection
                        this.instance.sock?.ws.close()
                        // remove all events
                        baileysEvents.forEach(ev => this.instance.sock?.ev.removeAllListeners(<any> ev))
                        // terminated
                        this.instance.qr = ' '
                        logger.info('socket connection terminated')
                    }
                })
            }
        })

        // sending presence
        sock?.ev.on('presence.update', async (json) => {
            if (
                ['all', 'presence', 'presence.update'].some((e) =>
                    config.webhookAllowedEvents.includes(e)
                )
            )
                await this.SendWebhook('presence', json, this.key)
        })

        // on receive all chats
        sock?.ev.on('messaging-history.set', async ({ chats }) => {
            this.instance.chats = []
            const receivedChats = chats.map((chat: any) => {
                return {
                    ...chat,
                    messages: [],
                }
            })
            this.instance.chats.push(...receivedChats)
            await this.updateDb(this.instance.chats)
            await this.updateDbGroupsParticipants()
        })

        // on receive new chat
        sock?.ev.on('chats.upsert', (newChat) => {
            //console.log('chats.upsert')
            //console.log(newChat)
            const chats = newChat.map((chat) => {
                return {
                    ...chat,
                    messages: [],
                    name: chat.name ?? '',
                    participant: this.toProtoParticipants(chat.participant)
                }
            })
            this.instance.chats.push(...chats)
        })

        // on chat change
        sock?.ev.on('chats.update', (changedChat) => {
            //console.log('chats.update')
            //console.log(changedChat)
            changedChat.map((chat) => {
                const index = this.instance.chats.findIndex(
                    (pc) => pc.id === chat.id
                )
                const PrevChat = this.instance.chats[index]
                this.instance.chats[index] = {
                    ...PrevChat,
                    ...chat,
                    messages: chat.messages ?? [],
                    name: chat.name ?? '',
                    participant: this.toProtoParticipants(chat.participant)
                }
            })
        })

        // on chat delete
        sock?.ev.on('chats.delete', (deletedChats) => {
            //console.log('chats.delete')
            //console.log(deletedChats)
            deletedChats.map((chat) => {
                const index = this.instance.chats.findIndex(
                    (c) => c.id === chat
                )
                this.instance.chats.splice(index, 1)
            })
        })

        // on new mssage
        sock?.ev.on('messages.upsert', async (m) => {
            //console.log('messages.upsert')
            //console.log(m)
            if (m.type === 'append')
                this.instance.messages.push(...m.messages)

            if (m.type !== 'notify') return

            // https://adiwajshing.github.io/Baileys/#reading-messages
            if (config.markMessagesRead) {
                const unreadMessages = m.messages.map((msg) => {
                    return {
                        remoteJid: msg.key.remoteJid,
                        id: msg.key.id,
                        participant: msg.key?.participant,
                    }
                })
                await sock.readMessages(unreadMessages)
            }

            this.instance.messages.push(...m.messages)

            m.messages.map(async (msg) => {
                if (!msg.message) return

                const messageType = Object.keys(msg.message)[0]
                if (
                    [
                        'protocolMessage',
                        'senderKeyDistributionMessage',
                    ].includes(messageType)
                )
                    return

                const webhookData = {
                    ...{ key: this.key },
                    ...msg,                    
                    messageKey: msg.key,
                    instanceKey: this.key,
                    text: <typeof m | null> null,
                    msgContent: <string | null | void> null,
                }

                if (messageType === 'conversation') {
                    webhookData.text = m
                }
                if (config.webhookBase64) {
                    switch (messageType) {
                        case 'imageMessage':
                            webhookData.msgContent = await downloadMessage(
                                msg.message.imageMessage!,
                                'image'
                            )
                            break
                        case 'videoMessage':
                            webhookData.msgContent = await downloadMessage(
                                msg.message.videoMessage!,
                                'video'
                            )
                            break
                        case 'audioMessage':
                            webhookData.msgContent = await downloadMessage(
                                msg.message.audioMessage!,
                                'audio'
                            )
                            break
                        default:
                            webhookData.msgContent = ''
                            break
                    }
                }
                if (
                    ['all', 'messages', 'messages.upsert'].some((e) =>
                        config.webhookAllowedEvents.includes(e)
                    )
                )
                    await this.SendWebhook('message', webhookData, this.key)
            })
        })
        
        sock?.ev.on('messages.update', async (messages) => {
            //console.log('messages.update')
            //console.dir(messages);
        })

        sock?.ws.on('CB:call', async (data) => {
            if (data.content) {
                if (data.content.find((e: { tag: string }) => e.tag === 'offer')) {
                    const content = data.content.find((e: { tag: string }) => e.tag === 'offer')
                    if (
                        ['all', 'call', 'CB:call', 'call:offer'].some((e) =>
                            config.webhookAllowedEvents.includes(e)
                        )
                    )
                        await this.SendWebhook(
                            'call_offer',
                            {
                                id: content.attrs['call-id'],
                                timestamp: parseInt(data.attrs.t),
                                user: {
                                    id: data.attrs.from,
                                    platform: data.attrs.platform,
                                    platform_version: data.attrs.version,
                                },
                            },
                            this.key
                        )
                } else if (data.content.find((e: { tag: string }) => e.tag === 'terminate')) {
                    const content = data.content.find(
                        (e: { tag: string }) => e.tag === 'terminate'
                    )

                    if (
                        ['all', 'call', 'call:terminate'].some((e) =>
                            config.webhookAllowedEvents.includes(e)
                        )
                    )
                        await this.SendWebhook(
                            'call_terminate',
                            {
                                id: content.attrs['call-id'],
                                user: {
                                    id: data.attrs.from,
                                },
                                timestamp: parseInt(data.attrs.t),
                                reason: data.content[0].attrs.reason,
                            },
                            this.key
                        )
                }
            }
        })

        sock?.ev.on('groups.upsert', async (newChat) => {
            //console.log('groups.upsert')
            //console.log(newChat)
            this.createGroupByApp(newChat)
            if (
                ['all', 'groups', 'groups.upsert'].some((e) =>
                    config.webhookAllowedEvents.includes(e)
                )
            )
                await this.SendWebhook(
                    'group_created',
                    {
                        data: newChat,
                    },
                    this.key
                )
        })

        sock?.ev.on('groups.update', async (newChat) => {
            //console.log('groups.update')
            //console.log(newChat)
            this.updateGroupSubjectByApp(newChat)
            if (
                ['all', 'groups', 'groups.update'].some((e) =>
                    config.webhookAllowedEvents.includes(e)
                )
            )
                await this.SendWebhook(
                    'group_updated',
                    {
                        data: newChat,
                    },
                    this.key
                )
        })

        sock?.ev.on('group-participants.update', async (newChat) => {
            //console.log('group-participants.update')
            //console.log(newChat)
            this.updateGroupParticipantsByApp(newChat)
            if (
                [
                    'all',
                    'groups',
                    'group_participants',
                    'group-participants.update',
                ].some((e) => config.webhookAllowedEvents.includes(e))
            )
                await this.SendWebhook(
                    'group_participants_updated',
                    {
                        data: newChat,
                    },
                    this.key
                )
        })
    }

    toProtoParticipants(parts: proto.IGroupParticipant[] | null | undefined) {
        const rank = [null, 'admin', 'superadmin']
        return parts?.map(p => ({ id: p.userJid, admin: rank[p.rank ?? 0] }))
    }
 
    async deleteInstance(key: string) {
        try {
            await Chat.findOneAndDelete({ key: key })
        } catch (e) {
            logger.error('Error updating document failed')
        }
    }

    async getInstanceDetail(key: string) {
        return {
            instance_key: key,
            phone_connected: this.instance?.online,
            webhookUrl: this.instance.customWebhook,
            user: this.instance?.online ? this.instance.sock?.user : {},
        }
    }

    getWhatsAppId(id: string) {
        if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id
        return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
    }

    async verifyId(id: string) {
        if (id.includes('@g.us')) return true
        const [result] = await this.instance.sock?.onWhatsApp(id)!
        if (result?.exists) return true
        throw new Error('no account exists')
    }

    async sendTextMessage(to: string, message: string) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            { text: message }
        )
        return data
    }

    async sendMediaFile(to: string, file: FileType, type: MediaType, caption?: string, filename?: string) {
        await this.verifyId(this.getWhatsAppId(to))

        const data = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            processMessage({
                type,
                caption,
                mimeType: file?.mimetype,
                buffer: file?.stream,
                fileName: filename ? filename : file?.originalname,
            })
        )
        return data
    }

    async sendUrlMediaFile(to: string, url: string, type: MediaType, mimeType: string, caption?: string) {
        await this.verifyId(this.getWhatsAppId(to))

        const data = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),  
            processMessage({ 
                type, 
                caption, 
                url, 
                mimeType 
            })
        )
        return data
    }

    async DownloadProfile(of: string) {
        await this.verifyId(this.getWhatsAppId(of))
        const ppUrl = await this.instance.sock?.profilePictureUrl(
            this.getWhatsAppId(of),
            'image'
        )
        return ppUrl
    }

    async getUserStatus(of: string) {
        await this.verifyId(this.getWhatsAppId(of))
        const status = await this.instance.sock?.fetchStatus(
            this.getWhatsAppId(of)
        )
        return status
    }

    async blockUnblock(to: string, data: Lock) {
        await this.verifyId(this.getWhatsAppId(to))
        const status = await this.instance.sock?.updateBlockStatus(
            this.getWhatsAppId(to),
            data
        )
        return status
    }

    async sendButtonMessage(to: string, data: ButtonMessage) {
        await this.verifyId(this.getWhatsAppId(to))
        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                templateButtons: processButton(data.buttons),
                text: data.text ?? '',
                footer: data.footerText ?? '',
                viewOnce: true,
            }
        )
        return result
    }

    async sendContactMessage(to: string, data: VCardData) {
        await this.verifyId(this.getWhatsAppId(to))
        const vcard = generateVC(data)
        const result = await this.instance.sock?.sendMessage(
            await this.getWhatsAppId(to),
            {
                contacts: {
                    displayName: data.fullName,
                    contacts: [{ displayName: data.fullName, vcard }],
                },
            }
        )
        return result
    }

    async sendListMessage(to: string, data: ListMessage) {
        await this.verifyId(this.getWhatsAppId(to))
        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                text: data.text,
                sections: data.sections,
                buttonText: data.buttonText,
                footer: data.description,
                title: data.title,
                viewOnce: true,
            }
        )
        return result
    }

    async sendMediaButtonMessage(to: string, data: MediaButtonMessage) {
        await this.verifyId(this.getWhatsAppId(to))

        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                image: { url: data.image! },
                footer: data.footerText ?? '',
                caption: data.text,
                templateButtons: processButton(data.buttons),
                mimetype: data.mimeType,
                viewOnce: true,
            }
        )
        return result
    }

    async setStatus(status: Status, to: string) {
        await this.verifyId(this.getWhatsAppId(to))

        const result = await this.instance.sock?.sendPresenceUpdate(status, to)
        return result
    }

    // change your display picture or a group's
    async updateProfilePicture(id: string, url: string) {
        try {
            const img = await axios.get(url, { responseType: 'arraybuffer' })
            const res = await this.instance.sock?.updateProfilePicture(
                id,
                img.data
            )
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message: 'Unable to update profile picture',
            }
        }
    }

    // get user or group object from db by id
    async getUserOrGroupById(id: string) {
        try {
            let Chats = await this.getChat()
            const group = Chats?.find((c) => c.id === this.getWhatsAppId(id))
            if (!group)
                throw new Error(
                    'unable to get group, check if the group exists'
                )
            return group
        } catch (e) {
            logger.error(e)
            logger.error('Error get group failed')
        }
    }

    // Group Methods
    parseParticipants(users: string[]) {
        return users.map((users) => this.getWhatsAppId(users))
    }

    toParticipants(participants: GroupParticipant[]) {
        return participants.map(p => ({ id: p.id, admin: p.admin ?? null }))
    }

    async updateDbGroupsParticipants() {
        try {
            let groups = await this.groupFetchAllParticipating()
            let Chats = await this.getChat()
            if (groups && Chats) {
                for (const [key, value] of Object.entries(groups)) {
                    let group = Chats.find((c) => c.id === value.id)
                    if (group) {
                        let participants = []
                        for (const [
                            key_participant,
                            participant,
                        ] of Object.entries(value.participants)) {
                            participants.push(participant)
                        }
                        group.participant = this.toParticipants(participants)
                        if (value.creation) {
                            group.creation = value.creation
                        }
                        if (value.subjectOwner) {
                            group.subjectOwner = value.subjectOwner
                        }
                        Chats.filter((c) => c.id === value.id)[0] = group
                    }
                }
                await this.updateDb(Chats)
            }
        } catch (e) {
            logger.error(e)
            logger.error('Error updating groups failed')
        }
    }

    async createNewGroup(name: string, users: string[]) {
        try {
            const group = await this.instance.sock?.groupCreate(
                name,
                users.map(this.getWhatsAppId)
            )
            return group
        } catch (e) {
            logger.error(e)
            logger.error('Error create new group failed')
        }
    }

    async addNewParticipant(id: string, users: string[]) {
        try {
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getWhatsAppId(id),
                this.parseParticipants(users),
                'add'
            )
            return res
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }

    async makeAdmin(id: string, users: string[]) {
        try {
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getWhatsAppId(id),
                this.parseParticipants(users),
                'promote'
            )
            return res
        } catch {
            return {
                error: true,
                message:
                    'unable to promote some participants, check if you are admin in group or participants exists',
            }
        }
    }

    async demoteAdmin(id: string, users: string[]) {
        try {
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getWhatsAppId(id),
                this.parseParticipants(users),
                'demote'
            )
            return res
        } catch {
            return {
                error: true,
                message:
                    'unable to demote some participants, check if you are admin in group or participants exists',
            }
        }
    }

    async getAllGroups() {
        let Chats = await this.getChat()
        return Chats?.filter((c) => c.id.includes('@g.us')).map((data, i) => {
            return {
                index: i,
                name: data.name,
                jid: data.id,
                participant: data.participant,
                creation: data.creation,
                subjectOwner: data.subjectOwner,
            }
        })
    }

    async leaveGroup(id: string) {
        try {
            let Chats = await this.getChat()
            const group = Chats?.find((c) => c.id === id)
            if (!group) throw new Error('no group exists')
            return await this.instance.sock?.groupLeave(id)
        } catch (e) {
            logger.error(e)
            logger.error('Error leave group failed')
        }
    }

    async getInviteCodeGroup(id: string) {
        try {
            let Chats = await this.getChat()
            const group = Chats?.find((c) => c.id === id)
            if (!group)
                throw new Error(
                    'unable to get invite code, check if the group exists'
                )
            return await this.instance.sock?.groupInviteCode(id)
        } catch (e) {
            logger.error(e)
            logger.error('Error get invite group failed')
        }
    }

    async getInstanceInviteCodeGroup(id: string) {
        try {
            return await this.instance.sock?.groupInviteCode(id)
        } catch (e) {
            logger.error(e)
            logger.error('Error get invite group failed')
        }
    }

    // get Chat object from db
    async getChat(key = this.key) {
        let dbResult = await Chat.findOne({ key: key }).exec()
        let ChatObj = dbResult?.chat
        return ChatObj
    }

    // create new group by application
    async createGroupByApp(newChat: GroupMetadata[]) {
        try {
            let Chats = await this.getChat()
            let group = {
                id: newChat[0].id,
                name: newChat[0].subject,
                participant: this.toParticipants(newChat[0].participants),
                messages: [],
                creation: newChat[0].creation,
                subjectOwner: newChat[0].subjectOwner,
            }
            Chats?.push(group)
            await this.updateDb(Chats)
        } catch (e) {
            logger.error(e)
            logger.error('Error updating document failed')
        }
    }

    async updateGroupSubjectByApp(newChat: Partial<GroupMetadata>[]) {
        //console.log(newChat)
        try {
            if (newChat[0] && newChat[0].subject) {
                let Chats = await this.getChat()
                let Chat = Chats?.find((c) => c.id === newChat[0].id)
                Chat!.name = newChat[0].subject
                await this.updateDb(Chats)
            }
        } catch (e) {
            logger.error(e)
            logger.error('Error updating document failed')
        }
    }

    async updateGroupParticipantsByApp(newChat: { id: string; participants: string[]; action: ParticipantAction }
    ) {
        //console.log(newChat)
        try {
            if (newChat && newChat.id) {
                let Chats = await this.getChat()
                let chat = Chats?.find((c) => c.id === newChat.id)
                let is_owner = false
                if (chat) {
                    if (chat.participant == undefined) {
                        chat.participant = []
                    }
                    if (chat.participant && newChat.action == 'add') {
                        for (const participant of newChat.participants) {
                            chat.participant.push({
                                id: participant,
                                admin: null,
                            })
                        }
                    }
                    if (chat.participant && newChat.action == 'remove') {
                        for (const participant of newChat.participants) {
                            // remove group if they are owner
                            if (chat.subjectOwner == participant) {
                                is_owner = true
                            }
                            chat.participant = chat.participant.filter(
                                (p: { id: any }) => p.id != participant
                            )
                        }
                    }
                    if (chat.participant && newChat.action == 'demote') {
                        for (const participant of newChat.participants) {
                            if (
                                chat.participant.filter(
                                    (p: { id: any }) => p.id == participant
                                )[0]
                            ) {
                                chat.participant.filter(
                                    (p: { id: any }) => p.id == participant
                                )[0].admin = null
                            }
                        }
                    }
                    if (chat.participant && newChat.action == 'promote') {
                        for (const participant of newChat.participants) {
                            if (
                                chat.participant.filter(
                                    (p: { id: any }) => p.id == participant
                                )[0]
                            ) {
                                chat.participant.filter(
                                    (p: { id: any }) => p.id == participant
                                )[0].admin = 'superadmin'
                            }
                        }
                    }
                    if (is_owner) {
                        Chats = Chats?.filter((c) => c.id !== newChat.id)
                    } else {
                        Chats = Chats?.filter((c) => c.id === newChat.id)
                        Chats![0] = chat
                    }
                    await this.updateDb(Chats)
                }
            }
        } catch (e) {
            logger.error(e)
            logger.error('Error updating document failed')
        }
    }

    async groupFetchAllParticipating() {
        try {
            const result =
                await this.instance.sock?.groupFetchAllParticipating()
            return result
        } catch (e) {
            logger.error('Error group fetch all participating failed')
        }
    }

    // update promote demote remove
    async groupParticipantsUpdate(id: string, users: string[], action: ParticipantAction) {
        try {
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getWhatsAppId(id),
                this.parseParticipants(users),
                action
            )
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'unable to ' +
                    action +
                    ' some participants, check if you are admin in group or participants exists',
            }
        }
    }

    // update group settings like
    // only allow admins to send messages
    async groupSettingUpdate(id: string, action: GroupAction) {
        try {
            const res = await this.instance.sock?.groupSettingUpdate(
                this.getWhatsAppId(id),
                action
            )
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'unable to ' + action + ' check if you are admin in group',
            }
        }
    }

    async groupUpdateSubject(id: string, subject: string) {
        try {
            const res = await this.instance.sock?.groupUpdateSubject(
                this.getWhatsAppId(id),
                subject
            )
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'unable to update subject check if you are admin in group',
            }
        }
    }

    async groupUpdateDescription(id: string, description?: string) {
        try {
            const res = await this.instance.sock?.groupUpdateDescription(
                this.getWhatsAppId(id),
                description
            )
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'unable to update description check if you are admin in group',
            }
        }
    }

    // update db document -> chat
    async updateDb(object?: ChatType[]) {
        try {
            await Chat.updateOne({ key: this.key }, { chat: object })
        } catch (e) {
            logger.error('Error updating document failed')
        }
    }

    async readMessage(msgObj: MessageKey) {
        try {
            const key = {
                remoteJid: msgObj.remoteJid,
                id: msgObj.id,
                participant: msgObj?.participant, // required when reading a msg from group
            }
            const res = await this.instance.sock?.readMessages([key])
            return res
        } catch (e) {
            logger.error('Error read message failed')
        }
    }

    async reactMessage(id: string, key: MessageKey, emoji: string | null) {
        try {
            const reactionMessage = {
                react: {
                    text: emoji, // use an empty string to remove the reaction
                    key: key,
                },
            }
            const res = await this.instance.sock?.sendMessage(
                this.getWhatsAppId(id),
                reactionMessage
            )
            return res
        } catch (e) {
            logger.error('Error react message failed')
        }
    }
}

export default WhatsAppInstance
