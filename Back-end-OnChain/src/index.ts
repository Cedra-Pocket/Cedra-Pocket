import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameController } from './controllers/GameController';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize game controller
const gameController = new GameController();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Cedra OnChain Backend is running',
        timestamp: new Date().toISOString(),
        network: process.env.CEDRA_NETWORK_URL,
        contractAddress: process.env.CEDRA_GAMEFI_ADDRESS || '79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe'
    });
});

// Treasury Management endpoints
app.post('/treasury/initialize', async (req, res) => {
    try {
        const { seed } = req.body;
        const result = await gameController.initializeTreasury(seed);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.post('/treasury/deposit', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Valid amount is required'
            });
        }

        const result = await gameController.depositToTreasury(amount);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.get('/treasury/balance/:adminAddress?', async (req, res) => {
    try {
        const { adminAddress } = req.params;
        const result = await gameController.getTreasuryBalance(adminAddress);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.get('/treasury/status/:adminAddress?', async (req, res) => {
    try {
        const { adminAddress } = req.params;
        const result = await gameController.getTreasuryStatus(adminAddress);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

// Rewards Management endpoints
app.post('/rewards/initialize', async (req, res) => {
    try {
        const { serverPublicKey } = req.body;

        if (!serverPublicKey) {
            return res.status(400).json({
                success: false,
                error: 'serverPublicKey is required'
            });
        }

        const result = await gameController.initializeRewards(serverPublicKey);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.post('/rewards/claim', async (req, res) => {
    try {
        const { userAddress, amount, nonce, signature, adminAddress } = req.body;

        if (!userAddress || !amount || nonce === undefined || !signature) {
            return res.status(400).json({
                success: false,
                error: 'userAddress, amount, nonce, and signature are required'
            });
        }

        const result = await gameController.claimReward(
            userAddress,
            amount,
            nonce,
            signature,
            adminAddress
        );
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.get('/rewards/nonce/:nonce/:adminAddress?', async (req, res) => {
    try {
        const nonce = parseInt(req.params.nonce);
        const { adminAddress } = req.params;

        if (isNaN(nonce)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid nonce'
            });
        }

        const result = await gameController.checkNonce(nonce, adminAddress);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.get('/rewards/status/:adminAddress?', async (req, res) => {
    try {
        const { adminAddress } = req.params;
        const result = await gameController.getRewardsStatus(adminAddress);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.post('/rewards/pause', async (req, res) => {
    try {
        const { paused, adminAddress } = req.body;

        if (paused === undefined) {
            return res.status(400).json({
                success: false,
                error: 'paused status is required'
            });
        }

        const result = await gameController.setRewardsPause(paused, adminAddress);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

// Account balance endpoint
app.get('/player/:address/balance', async (req, res) => {
    try {
        const { address } = req.params;

        if (!address) {
            return res.status(400).json({
                success: false,
                error: 'address is required'
            });
        }

        const result = await gameController.getBalance(address);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

// Transaction endpoints
app.get('/transaction/:txHash/status', async (req, res) => {
    try {
        const { txHash } = req.params;

        if (!txHash) {
            return res.status(400).json({
                success: false,
                error: 'txHash is required'
            });
        }

        const result = await gameController.checkTransaction(txHash);
        res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

// Legacy endpoints (kept for compatibility but return not implemented)
app.post('/quest/start', async (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Quest functions not implemented in current contract. Use treasury and rewards endpoints instead.',
        availableEndpoints: [
            'POST /treasury/initialize',
            'POST /treasury/deposit',
            'GET /treasury/balance/:adminAddress?',
            'GET /treasury/status/:adminAddress?',
            'POST /rewards/initialize',
            'POST /rewards/claim',
            'GET /rewards/nonce/:nonce/:adminAddress?',
            'GET /rewards/status/:adminAddress?',
            'POST /rewards/pause'
        ]
    });
});

app.post('/quest/complete', async (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Quest functions not implemented in current contract. Use rewards/claim endpoint instead.'
    });
});

app.get('/quest/:questId/status', async (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Quest functions not implemented in current contract. Use rewards/status endpoint instead.'
    });
});

app.get('/player/:playerId/stats', async (req, res) => {
    res.status(501).json({
        success: false,
        error: 'Player stats not implemented in current contract. Use /player/:address/balance endpoint instead.'
    });
});

// Initialize server
async function startServer() {
    try {
        console.log('🚀 Initializing Cedra OnChain Backend...');

        // Initialize game controller
        await gameController.initialize();

        // Start server
        app.listen(PORT, () => {
            console.log(`✅ Cedra OnChain Backend server is running on port ${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📋 Available API endpoints:`);
            console.log(`   Treasury Management:`);
            console.log(`     POST /treasury/initialize - Initialize treasury`);
            console.log(`     POST /treasury/deposit - Deposit funds to treasury`);
            console.log(`     GET /treasury/balance/:adminAddress? - Get treasury balance`);
            console.log(`     GET /treasury/status/:adminAddress? - Get treasury status`);
            console.log(`   Rewards Management:`);
            console.log(`     POST /rewards/initialize - Initialize rewards system`);
            console.log(`     POST /rewards/claim - Claim reward with signature`);
            console.log(`     GET /rewards/nonce/:nonce/:adminAddress? - Check if nonce is used`);
            console.log(`     GET /rewards/status/:adminAddress? - Get rewards system status`);
            console.log(`     POST /rewards/pause - Pause/unpause rewards system`);
            console.log(`   General:`);
            console.log(`     GET /player/:address/balance - Get account balance`);
            console.log(`     GET /transaction/:txHash/status - Check transaction status`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Cedra OnChain Backend...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down Cedra OnChain Backend...');
    process.exit(0);
});

// Start the server
startServer();