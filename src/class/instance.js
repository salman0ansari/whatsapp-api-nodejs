// const QRCode = require('qrcode');
const pino = require("pino");
const {
    default: makeWASocket,
    BufferJSON,
    useSingleFileAuthState,
    DisconnectReason,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid')
const sleep = require("../helper/sleep")


// global values
class WhatsappInstance {

    key = uuidv4();

    instance = {
        key: this.key,
        qrcode: "",
    };

    async init() {
        let { state, saveState } = useSingleFileAuthState(`./sessiondata/${this.key}.data.json`);
        let conn = makeWASocket({
            auth: state,
            logger: pino({
                level: 'error'
            }),
            printQRInTerminal: false
        });

        this.instance.conn = conn;

        this.instance.conn?.ev.on('connection.update', async (update) => {
            const {
                connection,
                lastDisconnect,
                qr
            } = update;
            if (qr) {
                // let readQRCode = await QRCode.toDataURL(qr);
                this.instance.qrcode = qr
                console.log(qr)
            }
            if (connection === 'close') {
                if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                    this.init()
                }
                if (lastDisconnect.error.output.statusCode === 401) {
                    if (fs.existsSync(`./sessiondata/${this.key}.data.json`)) {
                        fs.unlinkSync(`./sessiondata/${this.key}.data.json`);
                        // this.init()
                    }
                }
            }
        });

        this.instance.conn.ev.on('auth-state.update', async () => {
            const infoSession = this.instance.conn.authState;
            await fs.writeFileSync(`./sessiondata/${this.key}.data.json`, JSON.stringify(infoSession, BufferJSON.replacer, 2),);
        });

        this.instance.conn.ev.on('creds.update', saveState);

        return this.instance;
    }
}

ins = new WhatsappInstance()
ins.init()
