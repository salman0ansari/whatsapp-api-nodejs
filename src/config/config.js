// Port number
const PORT = process.env.PORT || '3333'
const TOKEN = process.env.TOKEN || ''

const RESTORE_SESSIONS_ON_START_UP = !!(
  process.env.RESTORE_SESSIONS_ON_START_UP && process.env.RESTORE_SESSIONS_ON_START_UP === 'true'
)

const APP_URL = process.env.APP_URL || false

const LOG_LEVEL = process.env.LOG_LEVEL

const INSTANCE_MAX_RETRY_QR = process.env.INSTANCE_MAX_RETRY_QR || 2

const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || 'Whatsapp MD'
const CLIENT_BROWSER = process.env.CLIENT_BROWSER || ''
const CLIENT_VERSION = process.env.CLIENT_VERSION || '3.0'

// Enable or disable mongodb
const MONGODB_ENABLED = !!(
    process.env.MONGODB_ENABLED && process.env.MONGODB_ENABLED === 'true'
)
// URL of the Mongo DB
const MONGODB_URL =
    process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/WhatsAppInstance'
// Enable or disable webhook globally on project
const WEBHOOK_ENABLED = !!(
    process.env.WEBHOOK_ENABLED && process.env.WEBHOOK_ENABLED === 'true'
)
// Webhook URL
const WEBHOOK_URL =
    process.env.WEBHOOK_URL ||
    'https://webhook.site/d0122a66-18a3-432d-b63f-4772b190dd72'
// Receive message content in webhook (Base64 format)
const WEBHOOK_BASE64 = !!(
    process.env.WEBHOOK_BASE64 && process.env.WEBHOOK_BASE64 === 'true'
)

module.exports = {
    port: PORT,
    token: TOKEN,
    restoreSessionsOnStartup: RESTORE_SESSIONS_ON_START_UP,
    appUrl: APP_URL,
    log: {
        level: LOG_LEVEL
    },
    instance: {
        max_retry_qr: INSTANCE_MAX_RETRY_QR
    },
    mongoose: {
        enabled: MONGODB_ENABLED,
        url: MONGODB_URL,
        options: {
            // useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    browser: {
        platform: CLIENT_PLATFORM,
        browser: CLIENT_BROWSER,
        version: CLIENT_VERSION
    },
    webhookEnabled: WEBHOOK_ENABLED,
    webhookUrl: WEBHOOK_URL,
    webhookBase64: WEBHOOK_BASE64,
}
