/* eslint-disable no-unsafe-optional-chaining */
const { WhatsAppInstance } = require('../class/instance')
const logger = require('pino')()
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

            allCollections.map((key) => {
                const query = {}
                db.collection(key)
                    .find(query)
                    .toArray(async (err, result) => {
                        if (err) throw err
                        const webhook = !config.webhookEnabled
                            ? undefined
                            : config.webhookEnabled
                        const webhookUrl = !config.webhookUrl
                            ? undefined
                            : config.webhookUrl
                        const instance = new WhatsAppInstance(
                            key,
                            webhook,
                            webhookUrl
                        )

                        const typebotItem = result.find(items => items._id === 'typebot')
                        if (typebotItem) {
                            await instance.activeTypeBot(typebotItem.apiHost, typebotItem.typebotName, false)
                        }

                        await instance.init()
                        WhatsAppInstances[key] = instance
                    })

                // TODO:: remover essa gambiarra
                if (key !== 'audit_messages') {
                    restoredSessions.push(key)
                }
            })
        } catch (e) {
            logger.error('Error restoring sessions')
            logger.error(e)
        }
        return restoredSessions
    }
}

exports.Session = Session
