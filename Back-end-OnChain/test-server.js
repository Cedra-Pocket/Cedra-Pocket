const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Cedra OnChain Backend is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/test', (req, res) => {
    res.json({
        message: 'Test endpoint working',
        config: {
            contractAddress: '79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe',
            packageName: 'CedraMiniApp'
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ Cedra OnChain Backend server is running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});