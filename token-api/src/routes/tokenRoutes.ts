import express, { Router } from 'express';
import { generateToken, saveWalletData } from '../controllers/tokenController';

const router: Router = express.Router();

// Define the route handler
router.post('/generate', async (req, res) => {
	try {
		await generateToken(req, res);
	} catch (error) {
		res.status(500).send({ error: 'Internal Server Error' });
	}
});

router.post('/save-wallet', saveWalletData);

export default router;