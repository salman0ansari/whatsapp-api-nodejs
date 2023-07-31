import type { Readable } from 'stream';

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'sticker'

export type MessageType = {
    type: MediaType
    url?: string
    mimeType?: string
    caption?: string
    fileName?: string
    buffer?: Readable
}

export default function processMessage(msg: MessageType) {
    const baseMsg = {
        ...(msg.mimeType ? { mimetype: msg.mimeType } : {})
    }
    const withCaption = {
        ...baseMsg,
        ...(msg.caption ? { caption: msg.caption } : {})
    }
    const mediaUpload = msg.buffer ? {
        stream: msg.buffer
    } : {
        url: msg.url!
    }
    switch(msg.type) {
        case 'image':
            return { image: mediaUpload, ...withCaption }
        case 'video':
            return { video: mediaUpload, ...withCaption }
        case 'document':
            return { 
                document: mediaUpload, 
                mimetype: msg.mimeType ?? 'application/octet-stream',
                ...(msg.fileName ? { fileName: msg.fileName } : {})
            }
        case 'audio':
            return { audio: mediaUpload, ptt: true, ...baseMsg }
        case 'sticker':
            return { sticker: mediaUpload, ...baseMsg }
        default:
            throw new Error(`Unsupported media type: ${msg.type}`);
    }
}
