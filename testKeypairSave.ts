import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

const kp = Keypair.generate();

const keyData = {
  publicKey: kp.publicKey.toBase58(),
  secretKey: Array.from(kp.secretKey),
};

const outputDir = path.join(__dirname, 'secure_keys');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(path.join(outputDir, 'test_keypair.json'), JSON.stringify(keyData, null, 2));

console.log('Keypair saved to secure_keys/test_keypair.json');
