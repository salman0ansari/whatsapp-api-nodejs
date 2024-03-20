const useMongoDBAuthState = require('../helper/mongoAuthState');
const logger = require('pino')()

function statusHandler(numberStatus) {
    switch (numberStatus) {
        case 1:
            return 'pending'
        case 3:
            return 'played'
        default:
            return 'unknown'
    }
}

class AuditMessageType {
    constructor(data) {
        this.key = data.key;
        this.remoteJid = data.key.remoteJid;
        this.identificator = data.id;
        this.id = data.key.id;
        this.messag = data.message;
        this.status = statusHandler(data.status);
        this.messageTimestamp = data.messageTimestamp;
    }
}

class AuditMessages {
    constructor(id) {
        this.messages = [];
        this.collectionName = 'audit_messages';
        this.id = id;
    }

    find(query) {
        const collection = mongoClient.db('whatsapp-api').collection(this.collectionName)
        return useMongoDBAuthState(collection)
            .then(({ find }) => {
                return find(query)
            })
    }

    findHistory(remoteJid) {
        const findes = this.messages.filter(message => message.remoteJid === remoteJid)
        if (findes.length > 0) {
            return new Promise(resolve => resolve(findes))
        }

        const collection = mongoClient.db('whatsapp-api').collection(this.collectionName)
        return useMongoDBAuthState(collection)
            .then(({ find }) => {
                return find({ remoteJid })
            })
    }

    append(message) {
        const messageStruct = new AuditMessageType({
            key: message.key,
            message: message.message,
            status: message.status,
            messageTimestamp: message.messageTimestamp,
            id: this.id,
            remoteJid: message.key.remoteJid,
        });

        const collection = mongoClient.db('whatsapp-api').collection(this.collectionName)
        useMongoDBAuthState(collection)
            .then(({ insertData }) => {
                insertData(messageStruct)
                    .then((result) => {
                        logger.info('Audit message requested save saved', result)
                        this.messages.push(messageStruct);
                    })
            })
    }

    update(message) {
        const remoteJid = message?.key?.remoteJid
        if (remoteJid) {
            this.findHistory(remoteJid)
                .then(entities => {
                    const collection = mongoClient.db('whatsapp-api').collection(this.collectionName)
                    const id = message.key.id;
                    entities.forEach(entitie => {
                        if (entitie.id === id) {
                            useMongoDBAuthState(collection).then(({ updateOne }) => {
                                updateOne(
                                    { id: entitie.id, remoteJid: entitie.remoteJid },
                                    { $set: { status: statusHandler(message.update.status), updateAt: new Date() } }
                                )
                            })

                        }

                    })
                })
        }
    }
}

exports.AuditMessages = new AuditMessages();