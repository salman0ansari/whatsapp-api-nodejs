import { MongoClient } from 'mongodb'
import pino from 'pino'
import { AppType } from './types'
import { getDatabaseService } from '../service/database'

const logger = pino()

export default async function connectToCluster(app: AppType, uri: string) {
    const database = getDatabaseService(app)

    try {
        database.mongoClient = new MongoClient(uri, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })
        logger.info('STATE: Connecting to MongoDB')
        await database.mongoClient.connect()
        logger.info('STATE: Successfully connected to MongoDB')
        return database.mongoClient
    } catch (error) {
        logger.error('STATE: Connection to MongoDB failed!', error)
        process.exit()
    }
}
