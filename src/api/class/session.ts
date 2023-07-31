/* eslint-disable no-unsafe-optional-chaining */
import WhatsAppInstance from '../class/instance'
import pino from 'pino'
import config from '../../config/config'
import getDatabase from '../service/database'
import { AppType } from '../helper/types'
import { getInstanceService } from '../service/instance'

const logger = pino()

class Session {
    app: AppType

    constructor(app: AppType){
        this.app = app;
    }

    async restoreSessions() {
        let restoredSessions : string[] = []
        let allCollections : string[] = []
        try {
            let instances = getInstanceService(this.app).instances
            const db = getDatabase(this.app)
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
                            ? null
                            : config.webhookEnabled
                        const webhookUrl = !config.webhookUrl
                            ? null
                            : config.webhookUrl
                        const instance = new WhatsAppInstance(
                            this.app,
                            key,
                            webhook,
                            webhookUrl
                        )
                        await instance.init()
                        instances[key] = instance
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

export default Session
