const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'key is missing'],
        unique: true,
    },
    config: {
        type: Object,
        required: [true, 'key is missing'],
    },
    chat: {
        type: Array,
    },
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
