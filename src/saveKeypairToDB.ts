import { MongoClient } from 'mongodb';
import { Keypair } from '@solana/web3.js';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = 'Tokenflowzy';
const collectionName = 'Token';

export async function saveKeypairToDB(
  tokenName: string,
  tokenMint: string,
  keypair: Keypair
) {
  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');
    const db = client.db(dbName);
    console.log(db)
    const collection = db.collection(collectionName);

    const document = {
      tokenName,
      tokenMint,
      publicKey: keypair.publicKey.toString(),
      secretKey: Array.from(keypair.secretKey),
    };

    const result = await collection.insertOne(document);
    console.log(`Inserted with _id: ${result.insertedId}`);
  } catch (err) {
    console.error('❌ Error saving to MongoDB:', err);
  } finally {
    await client.close();
  }
}
