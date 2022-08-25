/* eslint-disable no-unsafe-optional-chaining */
const { WhatsAppInstance } = require('../class/instance')
const logger = require('pino')()
const config = require('../../config/config')
const WebHook = require('../models/webhook.model')

class Session {
    async restoreSessions() {
        let restoredSessions = new Array()
        let allCollections = []
        try {
            const db = mongoClient.db('whatsapp-api')

            const result = await db.listCollections().toArray()

            result.forEach((collection) => {
                allCollections.push(collection.name);
            })

            allCollections.map((key) => {
                const query = {}
                db.collection(key).find(query).toArray(async (err, result) => {
                    if (err) throw err

                    // webhook db
                    let allowWebhook    = false;
                    let url_webhook     = '';
                    let dbResult        = await WebHook.findOne({ key: key }).exec();
                    if (dbResult && dbResult.webhook[0].allowWebhook) {
                        url_webhook = dbResult.webhook[0].url_message
                        allowWebhook = true;
                    }
                    const instance = new WhatsAppInstance(key, allowWebhook, url_webhook)
                    await instance.init()
                    WhatsAppInstances[key] = instance

                })
                restoredSessions.push(key)
            })
        } catch (e) {
            logger.error(e)
        }
        return restoredSessions
    }
}

exports.Session = Session
