const textmsg = require("./textmsg")
const image = require("./image")
const video = require("./video")
const audio = require("./audio")
const documentt = require("./document")
const location = require("./location")
const vcard = require("./vcard")
const button = require("./button")

module.exports = {
        '/sendText':{
            ...textmsg
        },
        '/sendImage':{
            ...image
        },
        '/sendVideo':{
            ...video
        },
        '/sendAudio':{
            ...audio
        },
        '/sendDocument':{
            ...documentt
        },
        '/sendLocation':{
            ...location
        },
        '/sendVCard':{
            ...vcard
        },
        '/sendButton':{
            ...button
        }


}