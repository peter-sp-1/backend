import { client } from '../db/mongoClient';

const dbName = process.env.MONGODB_DB_NAME || 'reflectionDB';
const collectionName = process.env.MONGODB_COLLECTION || 'withdrawAuthorities';

export async function getKeypairsFromDB() {
  try {
    // Always safe to call in MongoDB v5+
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return await collection.find().toArray();
  } catch (err) {
    console.error('Failed to fetch keypairs:', err);
    return [];
  }
}
