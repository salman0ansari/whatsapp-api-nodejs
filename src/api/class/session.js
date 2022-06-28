/* eslint-disable no-unsafe-optional-chaining */
const { WhatsAppInstance } = require('../class/instance')
const logger = require('pino')()

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
                        const instance = new WhatsAppInstance(key)
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
