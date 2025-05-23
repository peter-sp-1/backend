import express, { Router } from 'express';
import cors from 'cors';
import { generateToken, saveWalletData, saveTokenData, saveTokenDetails } from '../controllers/tokenController';
import { setupReflectionToken } from '../distribute'; // or correct path
import dotenv from 'dotenv';
dotenv.config();

const router: Router = express.Router();

// Enable CORS for all routes on this router
router.use(cors());

// Handle preflight OPTIONS requests for /setup-reflection
router.options('/setup-reflection', (req, res) => {
  console.log('📩 Received reflection setup request with body:', req.body);
  res.sendStatus(200);
});

router.post('/generate', async (req, res) => {
  try {
    await generateToken(req, res);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/generate-token', generateToken);
router.post('/save-wallet', saveWalletData);
router.post('/create', saveTokenData);
router.post('/save-token-details', saveTokenDetails);

router.post('/setup-reflection', async (req, res) => {
  try {
    const { tokenName, tokenSymbol, decimals, tokenMint } = req.body;

    const reflectionSetup = await setupReflectionToken(
      tokenName,
      tokenSymbol,
      decimals,
      tokenMint
    );

    res.status(200).json({
      success: true,
      data: reflectionSetup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to setup reflection',
    });
  }
});

export default router;

// Mock implementation for setting up a reflection token.
// In a real scenario, this would interact with Solana programs and on-chain logic.









