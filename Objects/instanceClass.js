const {
    MessageType,
    WAConnection
} = require("@adiwajshing/baileys")
const QRCode = require("qrcode")
const { v4: uuidv4 } = require('uuid');
const Pusher = require("pusher")
const { Exceptions } = require('../Exceptions/InvalidNumber.exception')
const fs = require("fs")

class WhatsAppInstance {

    key = uuidv4();

    pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        useTLS: true,
    });

    instance = {
        key: this.key,
        qrcode: "",
    };

    getWhatsAppId(id) {
        return id.includes("-") ? `${id}@g.us` : `${id}@s.whatsapp.net`;
    }

    async verifyId(id) {
        if (id.includes("@g.us")) {
            return true
        }
        const isRegistered = await this.instance.conn.isOnWhatsApp(id);
        if (isRegistered) {
            return true;
        }
        let error = new Exceptions();
        throw error.InvalidNumber()
    }

    async getInstanceDetails() {
        return {
            instance_key: this.key,
            phone_connected: this.instance.conn.phoneConnected,
            userData: this.instance.conn.phoneConnected
                ? this.instance.userData
                : {},
        };
    }

    setHandlers() {
        this.instance.conn.on("qr", async (qrcode) => {
            this.instance.qrcode = await QRCode.toDataURL(qrcode);
            this.pusher.trigger(this.key, "qrcode_update", {
                qrcode: this.instance.qrcode,
            });
        });

        this.instance.conn.on("open", (data) => {
            const authInfo = this.instance.conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
            const path = `./Instances/${this.key}.json`;
            console.log(path);
            fs.writeFileSync(path, JSON.stringify(authInfo, null, "\t"), {
                flag: "w",
            });

            this.instance.userData = data.user;
            this.pusher.trigger(this.key, "qrcode_scanned", {
                number: this.instance.userData.jid.replace("@s.whatsapp.net", ""),
            });
        });

        this.instance.conn.on("chat-update", async (data) => {
            if (data.messages) {
                data.messages.all().forEach(async (msg) => {
                    const newMsg = {
                        instance_key: this.key,
                        phone: this.instance.conn.user.jid,
                        messageType: "",
                        message: msg,
                    };

                    if (msg.message.conversation) {
                        newMsg.message = msg;
                        newMsg.messageType = "text";
                    }

                    if (
                        msg.message.audioMessage ||
                        msg.message.imageMessage ||
                        msg.message.videoMessage ||
                        msg.message.documentMessage
                    ) {
                        const mediaContent = await this.instance.conn.downloadMediaMessage(
                            msg
                        );
                        newMsg.message = msg;
                        newMsg.message.base64 = mediaContent.toString("base64");
                        newMsg.messageType = "media";
                    }

                    if (msg.message.locationMessage) {
                        newMsg.message = msg;
                        newMsg.messageType = "location";
                    }
                });
            }
        });
        return true;
    }

    getAllContacts() {
        const chats = this.instance.conn.chats;
        const toReturn = [];

        for (const chat of chats.all()) {
            (chat.messages) = undefined;
            toReturn.push(chat);
        }

        return toReturn;
    }

    async sendMediaFile(
        to,
        caption,
        messageType,
        file
    ) {
        await this.verifyId(this.getWhatsAppId(to));
        // eslint-disable-next-line
        const data = await this.instance.conn.sendMessage(
            this.getWhatsAppId(to),
            file,
            messageType,
            {
                caption: caption,
                thumbnail: null,
            }
        );
        return data;
    }

    async sendDocument(
        to,
        messageType,
        file
    ) {
        await this.verifyId(this.getWhatsAppId(to));
        const data = await this.instance.conn.sendMessage(
            this.getWhatsAppId(to),
            file.data,
            messageType,
            {
                mimetype: file.mimetype,
                filename: file.name,
            }
        );
        return data;
    }

    async sendTextMessage(to, message) {
        await this.verifyId(this.getWhatsAppId(to));
        const data = await this.instance.conn.sendMessage(
            this.getWhatsAppId(to),
            message,
            MessageType.text
        );
        return data;
    }

    async sendLocationMessage(to, lat, long) {
        await this.verifyId(this.getWhatsAppId(to));
        const data = await this.instance.conn.sendMessage(
            this.getWhatsAppId(to),
            { degreesLatitude: lat, degreesLongitude: long },
            MessageType.location
        );
        return data;
    }

    async sendVCardMessage(to, cardData) {
        await this.verifyId(this.getWhatsAppId(to));
        const vcard =
            "BEGIN:VCARD\n" +
            "VERSION:3.0\n" +
            `FN:${cardData.fullName}\n` +
            `ORG:${cardData.organization};\n` +
            `TEL;type=CELL;type=VOICE;waid=${cardData.phoneNumber}:${cardData.phoneNumber}\n` +
            "END:VCARD";

        const data = await this.instance.conn.sendMessage(
            this.getWhatsAppId(to),
            {
                displayName: cardData.displayName,
                vcard: vcard,
            },
            MessageType.contact
        );
        return data;
    }

    init(whatsappData) {
        const conn = new WAConnection();

        if (whatsappData) {
            const path = `./Instances/${whatsappData}`;
            conn.loadAuthInfo(path);
        }

        conn.browserDescription = [
            "whatsappAPI",
            "Chrome",
            "1.0",
        ];
        this.instance.conn = conn;
        this.instance.conn.removeAllListeners("qr");
        this.setHandlers();
        this.instance.conn.connect();
        return this.instance;
    }

    async logout() {
        await this.instance.conn.logout();
        this.instance.userData = {};
        return { status: 200, message: "logout successfull" };
    }

    async resetSession() {
        await this.logout();
        return this.init();
    }

}

exports.WhatsAppInstance = WhatsAppInstance
