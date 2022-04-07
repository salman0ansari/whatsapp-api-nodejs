// Port number
const PORT = '3333'
// URL of the Mongo DB
const MONGODB_URL = 'mongodb://127.0.0.1:27017/WhatsAppInstance'
// Webhook URL
const WEBHOOK_URL = 'https://webhook.site/d0122a66-18a3-432d-b63f-4772b190dd72'
// Receive message content in webhook (Base64 format)
const WEBHOOK_BASE64 = false

module.exports = {
    port: PORT,
    mongoose: {
        url: MONGODB_URL,
        options: {
            // useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    webhookUrl: WEBHOOK_URL,
    webhookBase64: WEBHOOK_BASE64,
}
