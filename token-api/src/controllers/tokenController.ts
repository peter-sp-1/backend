import { Request, Response } from 'express';
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';
import { WalletData, validateWalletData } from '../utils/walletGenerator';

export const generateToken = async (req: Request, res: Response) => {
    try {
        const wallet = Keypair.generate();
        const secretKey = JSON.stringify(Array.from(wallet.secretKey));
        
        const walletPath = path.join(process.cwd(), 'wallet.json');
        fs.writeFileSync(walletPath, secretKey, 'utf-8');

        return res.status(200).json({
            success: true,
            data: {
                publicKey: wallet.publicKey.toString(),
                message: 'Wallet keypair generated and saved successfully'
            }
        });
    } catch (error) {
        console.error('Error generating token:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate token and wallet'
        });
    }
};

export const saveWalletData = async (req: Request, res: Response) => {
    try {
        const walletData: WalletData = req.body;
        
        if (!validateWalletData(walletData)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid wallet data format'
            });
        }

        // Here you can add logic to store the wallet data if needed
        
        return res.status(200).json({
            success: true,
            message: 'Wallet data received successfully'
        });
    } catch (error) {
        console.error('Error processing wallet data:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process wallet data'
        });
    }
};