const { MongoClient } = require('mongodb')
const logger = require('pino')()

module.exports = async function connectToCluster(uri) {
    let mongoClient

    try {
        mongoClient = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        logger.info('STATE: Connecting to MongoDB')
        await mongoClient.connect()
        logger.info('STATE: Successfully connected to MongoDB')
        return mongoClient
    } catch (error) {
        logger.error('STATE: Connection to MongoDB failed!', error)
        process.exit()
    }
}
