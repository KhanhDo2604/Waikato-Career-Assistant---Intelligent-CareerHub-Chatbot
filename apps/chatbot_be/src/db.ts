import { Collection, Db, MongoClient } from 'mongodb';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * This function retrieves the MongoDB connection URI from the environment variables
 * and attempts to create a connection. If the connection is successful, it returns
 * the Mongoose instance. In case of failure, it logs the error and rethrows it
 * for higher-level error handling.
 * */

let client: MongoClient | null = null;
let db: Db | null = null;
let connecting: Promise<void> | null = null;

export default async function connectToMongoDB<T extends Document = any>(
    collectionName: string,
): Promise<Collection<T>> {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!uri) throw new Error('MONGODB_URI is not defined');
    if (!dbName) throw new Error('MONGODB_DB_NAME is not defined');

    if (!db) {
        if (!connecting) {
            client = new MongoClient(uri, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
            });

            connecting = client.connect().then(() => {
                db = client!.db(dbName);
                console.log('✅ Connected to MongoDB');
            });
        }

        await connecting;
    }

    return db!.collection<T>(collectionName);
}
