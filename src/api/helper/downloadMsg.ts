import { downloadContentFromMessage } from '@whiskeysockets/baileys'

type MessageType = Parameters<typeof downloadContentFromMessage>[0];
type MessageTypeType = Parameters<typeof downloadContentFromMessage>[1];

export default async function downloadMessage(msg: MessageType, msgType: MessageTypeType) {
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
