const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

module.exports = async function downloadMessage(msg, msgType) {
    let buffer = Buffer.from([])
    try {
        const stream = await downloadContentFromMessage(msg, msgType)
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
    } catch {
        return console.log('error downloading file-message')
    }
    return buffer.toString('base64')
}
