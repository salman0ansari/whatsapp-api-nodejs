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

class WhatsAppInstance {

    key = uuidv4();

    instance = {
        key: this.key,
        qrcode: "",
        online: false
    };

    async init() {
        let { state, saveState } = useSingleFileAuthState(path.join(__dirname,`../sessiondata/${this.key}.data.json`));
        let conn = makeWASocket({
            auth: state,
            logger: pino({
                level: 'error'
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
                if(shouldReconnect){
                    this.init();
                    this.instance.online = true
                }
                if (lastDisconnect.error?.output?.statusCode === 401) {
                    if (fs.existsSync(path.join(__dirname,`../sessiondata/${this.key}.data.json`))) {
                        fs.unlinkSync(path.join(__dirname,`../sessiondata/${this.key}.data.json`));
                        this.instance.online = false
                    }
                }
            }
        });

        this.instance.conn.ev.on('auth-state.update', async () => {
            const infoSession = this.instance.conn.authState;
            await fs.writeFileSync(path.join(__dirname,`../sessiondata/${this.key}.data.json`), JSON.stringify(infoSession, BufferJSON.replacer, 2),);
        });

        this.instance.conn.ev.on('creds.update', saveState);

        return this.instance;
    }
}
exports.WhatsAppInstance = WhatsAppInstance
