import { Request, Response } from 'express';
import { Keypair, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';
import { WalletData, validateWalletData } from '../utils/walletGenerator';
import { connectToDB } from '../db/mongoClient';

interface TokenCreationData {
  token: string;
  creatorWallet: string;
}

interface TokenDetails {
  token: string;
  creatorWallet: string;
  reflectionManagerWallet: string;
}

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

    // Optional: Save wallet data to MongoDB

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

export const saveTokenData = async (req: Request, res: Response) => {
  try {
    const { token, creatorWallet }: TokenCreationData = req.body;

    if (!token || !creatorWallet) {
      return res.status(400).json({
        success: false,
        error: 'Token and creator wallet are required'
      });
    }

    try {
      new PublicKey(token);
      new PublicKey(creatorWallet);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid public key format'
      });
    }

    // Optional: Save to DB

    return res.status(200).json({
      success: true,
      message: 'Token data received successfully',
      data: {
        token,
        creatorWallet
      }
    });
  } catch (error) {
    console.error('Error processing token data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process token data'
    });
  }
};

export const saveTokenDetails = async (req: Request, res: Response) => {
  try {
    const { token, creatorWallet, reflectionManagerWallet }: TokenDetails = req.body;

    if (!token || !creatorWallet || !reflectionManagerWallet) {
      return res.status(400).json({
        success: false,
        error: 'All fields (token, creatorWallet, reflectionManagerWallet) are required'
      });
    }

    try {
      new PublicKey(token);
      new PublicKey(creatorWallet);
      new PublicKey(reflectionManagerWallet);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid public key format'
      });
    }

    const db = await connectToDB();
    const tokensCollection = db.collection('tokens');

    const tokenData = {
      token,
      creatorWallet,
      reflectionManagerWallet,
      timestamp: new Date().toISOString()
    };

    await tokensCollection.insertOne(tokenData);

    return res.status(200).json({
      success: true,
      message: 'Token details saved successfully',
      data: tokenData
    });

  } catch (error) {
    console.error('Error saving token details:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save token details'
    });
  }
};
