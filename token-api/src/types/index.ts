// filepath: /token-api/token-api/src/types/index.ts

export interface TokenResponse {
    token: string;
    creatorWallet: string;
    privateKey: string;
}

export interface Wallet {
    address: string;
    privateKey: string;
}