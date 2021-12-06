require('dotenv').config()
const {
    MessageType,
    WAConnection
} = require("@adiwajshing/baileys")
const QRCode = require("qrcode")
const { v4: uuidv4 } = require('uuid');
const Pusher = require("pusher")
const { ErrorHandler } = require("../Exceptions/InvalidNumber.exception")
const fs = require("fs")
const axios = require("axios")

class WhatsAppInstance {

    key = uuidv4();

    pusher = new Pusher({
        appId: process.env.PUSHER_APPID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        useTLS: true,
    });

    instance = {
        key: this.key,
        qrcode: "",
    };

    axiosInstance = axios.create({
        baseURL: process.env.WEBHOOK_URL,
        // headers: {
        //   Apikey: process.env.WEBHOOK_KEY,
        // },
    });

    async sendJsonData(data) {
        if (data.messageType == "text") {
            return await this.axiosInstance.post("/sendtextreplies", data);
        } else if (data.messageType == "media") {
            return await this.axiosInstance.post("/sendmediareplies", data);
        } else if (data.messageType == "location") {
            return await this.axiosInstance.post("/sendlocationreplies", data);
        }
    }

    getWhatsAppId(id) {
        return id.includes("-") ? `${id}@g.us` : `${id}@s.whatsapp.net`;
    }

    async verifyId(id) {
        if (id.includes("@g.us")) {
            return true
        }
        const isRegistered = await this.instance.conn?.isOnWhatsApp(id);
        if (isRegistered) {
            return true;
        }
        throw new ErrorHandler(404, 'Number is not registered on WhatsApp');
    }

    async getInstanceDetails() {
        return {
            instance_key: this.key,
            phone_connected: this.instance.conn?.phoneConnected,
            userData: this.instance.conn?.phoneConnected
                ? this.instance.userData
                : {},
        };
    }

    setHandlers() {
        this.instance.conn?.on("qr", async (qrcode) => {
            this.instance.qrcode = await QRCode.toDataURL(qrcode);
            this.pusher.trigger(this.key, "qrcode_update", {
                qrcode: this.instance.qrcode,
            });
        });

        this.instance.conn?.on("open", (data) => {
            const authInfo = this.instance.conn?.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
            const path = `./Instances/${this.key}.json`;
            // console.log(path);
            fs.writeFileSync(path, JSON.stringify(authInfo, null, "\t"), {
                flag: "w",
            });

            this.instance.userData = data.user;
            this.pusher.trigger(this.key, "qrcode_scanned", {
                number: this.instance.userData.jid.replace("@s.whatsapp.net", ""),
            });
        });

        this.instance.conn?.on("chat-update", async (data) => {
            if (data.messages) {
                data.messages?.all().forEach(async (msg) => {
                    const newMsg = {
                        instance_key: this.key,
                        phone: this.instance.conn?.user.jid,
                        messageType: "",
                        message: msg,
                    };
                    if (msg.message?.conversation) {
                        newMsg.message = msg;
                        newMsg.messageType = "text";
                    }
                    if (
                        msg.message?.audioMessage ||
                        msg.message?.imageMessage ||
                        msg.message?.videoMessage ||
                        msg.message?.documentMessage
                    ) {
                        const mediaContent = await this.instance.conn?.downloadMediaMessage(
                            msg
                        );
                        newMsg.message = msg;
                        newMsg.message.base64 = mediaContent?.toString("base64");
                        newMsg.messageType = "media";
                    }
                    if (msg.message?.locationMessage) {
                        newMsg.message = msg;
                        newMsg.messageType = "location";
                    }

                    this.sendJsonData(newMsg);
                });
            }
        });
        return true;
    }

    getAllContacts() {
        const chats = this.instance.conn?.chats;
        const toReturn = [];

        for (const chat of chats?.all()) {
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
        try {
            await this.verifyId(this.getWhatsAppId(to));
        } catch (error) {
            return { error: true, error }
        }
        const data = await this.instance.conn?.sendMessage(
            this.getWhatsAppId(to),
            file.buffer,
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
        try {
            await this.verifyId(this.getWhatsAppId(to));
        } catch (error) {
            return { error: true, error }
        }
        const data = await this.instance.conn?.sendMessage(
            this.getWhatsAppId(to),
            file.buffer,
            messageType,
            {
                mimetype: file.mimetype,
                filename: file.name,
            }
        );
        return data;
    }

    async sendTextMessage(to, message) {
        try {
            await this.verifyId(this.getWhatsAppId(to));
        } catch (error) {
            return { error: true, error }
        }
        const data = await this.instance.conn?.sendMessage(
            this.getWhatsAppId(to),
            message,
            MessageType.text
        );
        return data;
    }

    async sendLocationMessage(to, lat, long) {
        try {
            await this.verifyId(this.getWhatsAppId(to));
        } catch (error) {
            return { error: true, error }
        }
        const data = await this.instance.conn?.sendMessage(
            this.getWhatsAppId(to),
            { degreesLatitude: lat, degreesLongitude: long },
            MessageType.location
        );
        return data;
    }

    async isOnWhatsApp(number) {
        const data = await this.instance.conn?.isOnWhatsApp(
            `${number}@s.whatsapp.net`
        );
        return data ? data : { exists: false, jid: `${number}@s.whatsapp.net` };
    }

    async sendVCardMessage(to, cardData) {
        try {
            await this.verifyId(this.getWhatsAppId(to));
        } catch (error) {
            return { error: true, error }
        }
        const vcard =
            "BEGIN:VCARD\n" +
            "VERSION:3.0\n" +
            `FN:${cardData.fullName}\n` +
            `ORG:${cardData.organization};\n` +
            `TEL;type=CELL;type=VOICE;waid=${cardData.phoneNumber}:${cardData.phoneNumber}\n` +
            "END:VCARD";

        const data = await this.instance.conn?.sendMessage(
            this.getWhatsAppId(to),
            {
                displayName: cardData.displayName,
                vcard: vcard,
            },
            MessageType.contact
        );
        return data;
    }

    async sendButtonMessage(to, btnData) {
        try {
            await this.verifyId(this.getWhatsAppId(to));
        } catch (error) {
            return { error: true, error }
        }
        await this.verifyId(this.getWhatsAppId(to));
        const data = await this.instance.conn?.sendMessage(
            this.getWhatsAppId(to),
            btnData,
            MessageType.buttonsMessage
        );
        return data;
    }

    init(whatsappData) {
        const conn = new WAConnection();
        conn.logger.level = 'warn';
        if (whatsappData) {
            const path = `./Instances/${whatsappData}`;
            conn.loadAuthInfo(path);
        }
        conn.version = [3, 3234, 9];
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
        await this.instance.conn?.logout();
        this.instance.userData = {};
        return { error: false, message: "logout successfull" };
    }

    async resetSession() {
        await this.logout();
        return this.init();
    }

    //Group Functions
    parseParticipants(participants) {
        return participants.map((participant) => this.getWhatsAppId(participant));
    }

    async getAllGroups() {

        const { chats } = this.instance.conn?.loadChats(1000, null);

        const groups =
            chats?.filter((c) =>
                c.jid.includes("@g.us")
            ) ?? [];

        const finalGroups = [];
        groups.map((g) => {
            g.messages = undefined;
            finalGroups.push(g);
        });

        return { groups: finalGroups };
    }

    async getGroupFromId(groupId) {
        const id = this.getWhatsAppId(groupId);
        const group = await this.instance.conn?.chats
            .all()
            .filter((chat) => chat.jid == id);
        try {
            if (group) return await this.instance.conn?.groupMetadata(id);
        } catch (error) {
            return { error: true, message: "requested group was not found" }
        }
    }

    async getAdminGroups(withParticipants) {
        const data = await this.instance.conn?.loadChats(1000, null);
        const groups = data?.chats?.filter((c) => c.jid.includes("@g.us")) ?? [];
        const groupsMetadataArray = [];
        for (const g of groups) {
            const metaData = (await this.instance.conn?.groupMetadata(
                g.jid
            ))
            metaData.messages = undefined;
            groupsMetadataArray.push(metaData);
            await new Promise((r) => setTimeout(r, 1000));
        }
        const adminGroups = groupsMetadataArray.filter((c) =>
            c.participants?.filter(
                (p) => p.jid === this.instance.userData?.jid && p.isAdmin
            ).length == 0
                ? false
                : true
        );
        const finalGroups = [];
        adminGroups.map((g) => {
            g.messages = undefined;
            if (!withParticipants) {
                g.participants = undefined;
            }

            finalGroups.push(g);
        });

        return { groups: finalGroups };
    }

    async addNewParticipant(data) {
        try {
            const res = await this.instance.conn?.groupAdd(
                this.getWhatsAppId(data.group_id),
                this.parseParticipants(data.participants)
            );
            return res;
        } catch {
            return { error: true, message: "unable to add participant, check if you are admin in group" }
        }
    }

}

exports.WhatsAppInstance = WhatsAppInstance
