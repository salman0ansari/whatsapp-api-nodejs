const mongoose = require('mongoose')

const WebHookSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'key is missing'],
        unique: true,
    },
    webhook: {
        type: Array,
    },
})

const WebHook = mongoose.model('WebHook', WebHookSchema)

module.exports = WebHook 
