/* eslint-disable no-unsafe-optional-chaining */
const QRCode = require('qrcode')
const pino = require('pino')
const {
    default: makeWASocket,
    useSingleFileAuthState,
    DisconnectReason,
} = require('@adiwajshing/baileys')
const { unlinkSync } = require('fs')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const processButton = require('../helper/processbtn')
const generateVC = require('../helper/genVc')
// const Chat = require("../models/chat.model")

class WhatsAppInstance {
    socketConfig = {
        printQRInTerminal: false,
        browser: ['Whatsapp MD', '', '3.0'],
    }
    key = ''
    authState
    allowWebhook = false
    instance = {
        key: this.key,
        chats: [],
        qr: '',
    }
    constructor(key, allowWebhook = false) {
        this.key = key ? key : uuidv4()
        this.allowWebhook = allowWebhook
        this.authState = useSingleFileAuthState(
            path.join(__dirname, `../sessiondata/${this.key}.json`)
        )
    }

    async init() {
        this.socketConfig.auth = this.authState.state
        this.instance.sock = makeWASocket(this.socketConfig)
        this.setHandler()
        // this.instance.sock = sock
        return this
        // return this.instance
    }

    setHandler() {
        const sock = this.instance.sock
        // on credentials update save state
        sock?.ev.on('creds.update', this.authState.saveState)

        // on socket closed, opened, connecting
        sock?.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            if (connection == 'connecting') return

            if (connection === 'close') {
                // reconnect if not logged out
                if (
                    lastDisconnect?.error?.output?.statusCode !==
                    DisconnectReason.loggedOut
                ) {
                    await this.init()
                } else {
                    unlinkSync(
                        path.join(__dirname, `../sessiondata/${this.key}.json`)
                    )
                    this.instance.online = false
                }
            } else if (connection === 'open') {
                console.log('opened connection')
                this.instance.online = true
            }

            if (qr) {
                QRCode.toDataURL(qr).then((url) => {
                    this.instance.qr = url
                })
            }
        })

        // on receive all chats
        sock?.ev.on('chats.set', async ({ chats }) => {
            console.log('recived all chat')
            const recivedChats = chats.map((chat) => {
                return {
                    ...chat,
                    messages: [],
                }
            })
            this.instance.chats.push(...recivedChats)
            //    const db = await Chat({key: this.key, chat: this.instance.chats})
            //    await db.save()
            //    console.log(db)
        })

        // on recive new chat
        sock?.ev.on('chats.upsert', (newChat) => {
            // console.log("recived new chat")
            const chats = newChat.map((chat) => {
                return {
                    ...chat,
                    messages: [],
                }
            })
            this.instance.chats.push(...chats)
        })

        // on chat change
        sock?.ev.on('chats.update', (changedChat) => {
            changedChat.map((chat) => {
                const index = this.instance.chats.findIndex(
                    (pc) => pc.id === chat.id
                )
                const PrevChat = this.instance.chats[index]
                this.instance.chats[index] = {
                    ...PrevChat,
                    ...chat,
                }
            })
        })

        // on chat delete
        sock?.ev.on('chats.delete', (deletedChats) => {
            deletedChats.map((chat) => {
                const index = this.instance.chats.findIndex(
                    (c) => c.id === chat
                )
                this.instance.chats.splice(index, 1)
            })
        })
    }

    async getInstanceDetail(key) {
        return {
            instance_key: key,
            phone_connected: this.instance?.online,
            user: this.instance?.online ? this.instance.sock?.user : {},
        }
    }

    getWhatsAppId(id) {
        if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id
        return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
    }

    async verifyId(id) {
        if (id.includes('@g.us')) return true
        const [result] = await this.instance.sock?.onWhatsApp(id)
        if (result?.exists) return true
        throw new Error('no account exists')
    }

    async sendTextMessage(to, message) {
        await this.verifyId(this.getWhatsAppId(to))
        const data = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            { text: message }
        )
        return data
    }

    async sendMediaFile(to, caption = '', file, type) {
        await this.verifyId(this.getWhatsAppId(to))
        // console.log([type]);
        const data = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                mimetype: file.mimetype,
                [type]: file.buffer,
                caption: caption,
                ptt: type === 'audio' ? true : false,
            }
        )
        return data
    }

    async sendUrlMediaFile(to, url, caption = '', type, mimeType) {
        await this.verifyId(this.getWhatsAppId(to))

        const data = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                [type]: {
                    url: url,
                },
                caption: caption,
                mimetype: mimeType,
            }
        )
        return data
    }

    async DownloadProfile(of) {
        await this.verifyId(this.getWhatsAppId(of))
        const ppUrl = await this.instance.sock?.profilePictureUrl(
            this.getWhatsAppId(of),
            'image'
        )
        return ppUrl
    }

    async sendButtonMessage(to, data) {
        await this.verifyId(this.getWhatsAppId(to))
        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                templateButtons: processButton(data.buttons),
                text: data.text ?? '',
                footer: data.footerText ?? '',
            }
        )
        return result
    }

    async sendContactMessage(to, data) {
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

    async sendListMessage(to, data) {
        await this.verifyId(this.getWhatsAppId(to))
        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                text: data.text,
                sections: data.sections,
                buttonText: data.buttonText,
                footer: data.description,
                title: data.title,
            }
        )
        return result
    }

    async sendMediaButtonMessage(to, data) {
        await this.verifyId(this.getWhatsAppId(to))

        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                [data.mediaType]: {
                    url: data.image,
                },
                footer: data.footerText ?? '',
                caption: data.text,
                templateButtons: processButton(data.buttons),
                mimetype: data.mimeType,
            }
        )
        return result
    }

    // Group Methods

    async createNewGroup(name, users) {
        const group = await this.instance.sock?.groupCreate(
            name,
            users.map(this.getWhatsAppId)
        )
        return group
    }

    async getAllGroups() {
        // let AllChat = await Chat.findOne({key: key}).exec();
        return this.instance.chats.filter((c) => c.id.includes('@g.us'))
    }
}

exports.WhatsAppInstance = WhatsAppInstance
