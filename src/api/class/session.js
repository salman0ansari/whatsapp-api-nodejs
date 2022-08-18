/* eslint-disable no-unsafe-optional-chaining */
const { WhatsAppInstance } = require('../class/instance')
const logger = require('pino')()
const Chat = require('../models/chat.model')
const config = require('../../config/config')

class Session {
    async restoreSessions() {
        let restoredSessions = new Array()
        let allCollections = []
        try {
            const db = mongoClient.db('whatsapp-api')
            const result = await db.listCollections().toArray()
            result.forEach((collection) => {
                allCollections.push(collection.name)
            })

            allCollections.map(async (key) => {
                const query = {}
                db.collection(key)
                    .find(query)
                    .toArray(async (err, result) => {
                        const chat = await Chat.findOne({ key: key })

                        const data = {
                            name: chat.key,
                            webhook: chat.config.allowWebhook,
                            webhookUrl: chat.config.customWebhook,
                        }
                        if (err) throw err
                        const webhook = chat.config.allowWebhook
                            ? chat.config.allowWebhook
                            : config.webhookEnabled
                        const webhookUrl = chat.config.customWebhook
                            ? chat.config.customWebhook
                            : config.webhookUrl
                        const instance = new WhatsAppInstance(
                            key,
                            webhook,
                            webhookUrl
                        )
                        await instance.init()
                        WhatsAppInstances[key] = instance
                    })
                restoredSessions.push(key)
            })
        } catch (e) {
            logger.error('Error restoring sessions')
            logger.error(e)
        }
        return restoredSessions
    }
}

exports.Session = Session
