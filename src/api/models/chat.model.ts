import mongoose from 'mongoose'

export interface ChatParticipant {
    id: string;
    admin: string | null;
}

const chatParticipant = new mongoose.Schema<ChatParticipant>({
    id: { type: String, required: true },
    admin: { type: String, required: true },
})

export interface ChatType {
    id: string;
    name: string;
    participant?: ChatParticipant[];
    messages?: any[];
    creation?: number;
    subjectOwner?: string;
}

const chatType = new mongoose.Schema<ChatType>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    participant: Array(chatParticipant),
    messages: Array(),
    creation: { type: Number },
    subjectOwner: { type: String },
})

export interface Chat {
    key: string;
    chat: ChatType[];
}

const chatSchema = new mongoose.Schema<Chat>({
    key: {
        type: String,
        required: [true, 'key is missing'],
        unique: true,
    },
    chat: {
        type: Array(chatType),
    },
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
