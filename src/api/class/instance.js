/* eslint-disable no-unsafe-optional-chaining */
const QRCode = require('qrcode')
const pino = require('pino')
const {
    default: makeWASocket,
    BufferJSON,
    useSingleFileAuthState,
    DisconnectReason,
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
// const APIError = require("../errors/api.error")
// const httpStatus = require('http-status');
// var httpError = require('express-exception-handler').exception

// http://localhost:3333/instance/qr?key=
class WhatsAppInstance {
    constructor() {
        this.key = uuidv4()
        this.instance = {
            key: this.key,
            qrcode: '',
            online: false,
        }
    }

    async init() {
        let { state, saveState } = useSingleFileAuthState(
            path.join(__dirname, `../sessiondata/${this.key}.json`)
        )
        let sock = makeWASocket({
            auth: state,
            logger: pino({
                level: 'debug',
            }),
            printQRInTerminal: false,
            version: [2, 2204, 13],
            browser: ['Whatsapp MD', '', '3.0'],
        })

        this.instance.sock = sock

        this.instance.sock?.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update
            if (qr) {
                let qrcode = await QRCode.toDataURL(qr)
                this.instance.qrcode = qrcode
            }
            if (connection === 'close') {
                const shouldReconnect =
                    lastDisconnect.error?.output?.statusCode !==
                    DisconnectReason.loggedOut
                if (shouldReconnect) {
                    this.init()
                }
                if (lastDisconnect.error?.output?.statusCode === 401) {
                    if (
                        fs.existsSync(
                            path.join(
                                __dirname,
                                `../sessiondata/${this.key}.json`
                            )
                        )
                    ) {
                        fs.unlinkSync(
                            path.join(
                                __dirname,
                                `../sessiondata/${this.key}.json`
                            )
                        )
                        this.instance.online = false
                    }
                }
                // if (lastDisconnect.error?.output?.statusCode === 411) {
                //     join multi device error
                // }
            } else if (connection === 'open') {
                console.log('opened connection')
                this.instance.online = true
                // console.log(this.instance)
            }
        })

        this.instance.sock?.ev.on('auth-state.update', async () => {
            const session = this.instance.sock?.authState
            await fs.writeFileSync(
                path.join(__dirname, `../sessiondata/${this.key}.json`),
                JSON.stringify(session, BufferJSON.replacer, 2)
            )
        })

        //
        // this.instance.sock?.ev.on("chats.update", async (data) => {
        //     if (data.messages) {
        //         data.messages?.all().forEach(async (msg) => {
        //             const newMsg = {
        //                 instance_key: this.key,
        //                 phone: this.instance.sock?.user.jid,
        //                 messageType: "",
        //                 message: msg,
        //             };
        //             if (msg.message?.conversation) {
        //                 newMsg.message = msg;
        //                 newMsg.messageType = "text";
        //             }
        //             if (
        //                 msg.message?.audioMessage ||
        //                 msg.message?.imageMessage ||
        //                 msg.message?.videoMessage ||
        //                 msg.message?.documentMessage
        //             ) {
        //                 const mediaContent = await this.instance.sock?.downloadMediaMessage(
        //                     msg
        //                 );
        //                 newMsg.message = msg;
        //                 newMsg.messageType = "media";
        //                 if (options['fullsize']) {
        //                     newMsg.base64 = mediaContent?.toString("base64");
        //                 }
        //             }
        //             if (msg.message?.locationMessage) {
        //                 newMsg.message = msg;
        //                 newMsg.messageType = "location";
        //             }
        //             if (options['webhook']) {
        //                 this.sendJsonData(newMsg);
        //             }

        //             // return true;
        //         })
        //     }
        // })
        this.instance.sock?.ev.on('creds.update', saveState)
        return this.instance
    }

    async getInstanceDetail() {
        return {
            instance_key: this.key,
            phone_connected: this.instance?.online,
            user: this.instance?.online ? this.instance.sock?.user : {},
        }
    }

    getWhatsAppId(id) {
        return id?.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
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
}

exports.WhatsAppInstance = WhatsAppInstance
