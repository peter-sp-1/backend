// db/mongoClient.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || ''; 
console.log(uri)
if (!uri) throw new Error('Missing MONGODB_URI in environment variables');
export const client = new MongoClient(uri);

export async function connectToDB() {
    // MongoClient.connect() is safe to call multiple times; it will reuse the connection if already connected.
    await client.connect();
    return client.db('reflectionDB'); 
}






