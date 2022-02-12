const QRCode = require('qrcode');
const pino = require("pino");
const {
    default: makeWASocket,
    BufferJSON,
    useSingleFileAuthState,
    DisconnectReason,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid')
const path = require("path")

// http://localhost:3333/instance/qr?key=

class WhatsAppInstance {

    key = uuidv4();

    instance = {
        key: this.key,
        qrcode: "",
        online: false
    };

    async init() {
        let { state, saveState } = useSingleFileAuthState(path.join(__dirname, `../sessiondata/${this.key}.json`));
        let conn = makeWASocket({
            auth: state,
            logger: pino({
                level: 'debug'
            }),
            printQRInTerminal: false
        });

        this.instance.conn = conn;

        this.instance.conn?.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                let qrcode = await QRCode.toDataURL(qr);
                this.instance.qrcode = qrcode
            }
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
                if (shouldReconnect) {
                    this.init();
                }
                if (lastDisconnect.error?.output?.statusCode === 401) {
                    if (fs.existsSync(path.join(__dirname, `../sessiondata/${this.key}.json`))) {
                        fs.unlinkSync(path.join(__dirname, `../sessiondata/${this.key}.json`))
                        this.instance.online = false
                    }
                }
                // if (lastDisconnect.error?.output?.statusCode === 411) {
                //     join multi device error
                // }
            } else if (connection === 'open') {
                console.log('opened connection')
                this.instance.online = true
                console.log(this.instance.conn.logout)
            }

        });

        this.instance.conn?.ev.on('auth-state.update', async () => {
            const session = this.instance.conn?.authState;
            await fs.writeFileSync(path.join(__dirname, `../sessiondata/${this.key}.json`) 
            ,JSON.stringify(session, BufferJSON.replacer, 2));
        });

        //
        // this.instance.conn?.ev.on("chats.update", async (data) => {
        //     if (data.messages) {
        //         data.messages?.all().forEach(async (msg) => {
        //             const newMsg = {
        //                 instance_key: this.key,
        //                 phone: this.instance.conn?.user.jid,
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
        //                 const mediaContent = await this.instance.conn?.downloadMediaMessage(
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
        this.instance.conn?.ev.on('creds.update', saveState);
        return this.instance;
    }

    async getInstanceDetail() {
        return {
            instance_key: this.key,
            phone_connected: this.instance?.online,
            user: this.instance?.online
                ? this.instance.conn?.user
                : {},
        };
    }

}
exports.WhatsAppInstance = WhatsAppInstance
