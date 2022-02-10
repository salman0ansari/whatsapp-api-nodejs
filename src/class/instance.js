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
}
