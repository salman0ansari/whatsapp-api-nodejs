import { Document, Collection, MongoClient } from 'mongodb'

import { AppType } from "../helper/types";

interface Database
{
    mongoClient: MongoClient
}

export type CollectionType = Collection<Document>

export function initDatabaseService(app: AppType) {
    app.set('databaseService', <Database> {});
}

export function getDatabaseService(app: AppType): Database {
    const DatabaseService: Database = app.get('databaseService');
    return DatabaseService;
}

export default function getDatabase(app: AppType) {
    return getDatabaseService(app).mongoClient.db('whatsapp-api')
}
