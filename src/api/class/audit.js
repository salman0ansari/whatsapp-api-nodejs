const useMongoDBAuthState = require('../helper/mongoAuthState');
const logger = require('pino')()

class AuditMessageType {
    constructor(data) {
        this.key = data.key;
        this.message = data.message;
        this.status = data.status;
        this.messageTimestamp = data.messageTimestamp;
        this.remoteJid = data.key.remoteJid;
    }
}

class AuditMessages {
    constructor() {
        this.messages = [];
        this.collectionName = 'audit_messages';
    }

    findHistory(remoteJid) {
        const finded = this.messages.find(message => message.remoteJid === remoteJid)
        if (finded) {
            return finded
        }

        const collection = mongoClient.db('whatsapp-api').collection(this.collectionName)
        return useMongoDBAuthState(collection)
            .then(async ({ readData }) => {
                const result = await readData({ remoteJid })
                this.messages.push(result)
                
                return result[0]
            })
    }

    append(message) {
        const newMessage = { 
            key: message.key, 
            message: message.message, 
            status: message.status,
            messageTimestamp: message.messageTimestamp
        }

        const collection = mongoClient.db('whatsapp-api').collection(this.collectionName)
        useMongoDBAuthState(collection)
            .then(({ insertData }) => {
                insertData(newMessage)
                    .then((result) => {
                        logger.info('Audit message requested save saved')
                        this.messages.push({ result, newMessage });
                    })
            })
    }

    update(message) {
        const remoteJid = message?.key?.remoteJid
        if (remoteJid) {
            this.findHistory(remoteJid)
                .then(history => {

                })
        }
    }
}

exports.AuditMessages = new AuditMessages();