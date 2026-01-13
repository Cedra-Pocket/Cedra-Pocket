const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
    console.log('🧪 Testing Cedra OnChain Backend API...\n');

    try {
        // Test health check
        console.log('1. Testing health check...');
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check:', health.data);
        console.log('');

        // Test treasury status
        console.log('2. Testing treasury status...');
        try {
            const treasuryStatus = await axios.get(`${BASE_URL}/treasury/status`);
            console.log('✅ Treasury status:', treasuryStatus.data);
        } catch (error) {
            console.log('⚠️ Treasury status error (expected if not initialized):', error.response?.data || error.message);
        }
        console.log('');

        // Test rewards status
        console.log('3. Testing rewards status...');
        try {
            const rewardsStatus = await axios.get(`${BASE_URL}/rewards/status`);
            console.log('✅ Rewards status:', rewardsStatus.data);
        } catch (error) {
            console.log('⚠️ Rewards status error (expected if not initialized):', error.response?.data || error.message);
        }
        console.log('');

        // Test account balance
        console.log('4. Testing account balance...');
        try {
            const balance = await axios.get(`${BASE_URL}/player/79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe/balance`);
            console.log('✅ Account balance:', balance.data);
        } catch (error) {
            console.log('⚠️ Account balance error:', error.response?.data || error.message);
        }
        console.log('');

        // Test nonce check
        console.log('5. Testing nonce check...');
        try {
            const nonceCheck = await axios.get(`${BASE_URL}/rewards/nonce/1`);
            console.log('✅ Nonce check:', nonceCheck.data);
        } catch (error) {
            console.log('⚠️ Nonce check error (expected if rewards not initialized):', error.response?.data || error.message);
        }
        console.log('');

        console.log('🎉 API testing completed!');
        console.log('\n📝 Next steps:');
        console.log('1. Make sure your .env file has the correct PRIVATE_KEY and CEDRA_NETWORK_URL');
        console.log('2. Initialize treasury: POST /treasury/initialize');
        console.log('3. Initialize rewards: POST /rewards/initialize with serverPublicKey');
        console.log('4. Test contract interactions with real transactions');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the server is running: npm run dev');
        }
    }
}

// Run tests
testAPI();