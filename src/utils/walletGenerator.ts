import { Keypair, PublicKey } from '@solana/web3.js';

export interface Wallet {
    token: string;
    creatorWallet: string;
    privateKey: string;
}

export const generateWallet = (): Keypair => {
    return Keypair.generate();
};

export interface WalletData {
    token: string;
    creatorWallet: string;
    privateKey: string;
}

export const validateWalletData = (data: WalletData): boolean => {
    try {
        // Validate public keys
        new PublicKey(data.token);
        new PublicKey(data.creatorWallet);
        
        // Validate private key format (should be a hex string)
        if (!/^[0-9a-fA-F]+$/.test(data.privateKey)) {
            return false;
        }
        
        return true;
    } catch (error) {
        return false;
    }
};