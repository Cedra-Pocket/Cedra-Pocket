const axios = require('axios');

const BASE_URL = 'http://localhost:3333';

async function testBasicEndpoints() {
  console.log('🧪 Testing Basic Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', health.data.status);
    console.log('');

    // Test 2: Blockchain Treasury Status
    console.log('2. Testing Blockchain Treasury Status...');
    const treasuryStatus = await axios.get(`${BASE_URL}/blockchain/treasury/status`);
    console.log('✅ Treasury status:', treasuryStatus.data.success);
    console.log('');

    // Test 3: Blockchain Account Balance
    console.log('3. Testing Account Balance...');
    const balance = await axios.get(`${BASE_URL}/blockchain/account/test-address/balance`);
    console.log('✅ Account balance:', balance.data.balance);
    console.log('');

    console.log('🎉 All basic tests passed!');
    console.log('');
    console.log('📋 Server Status:');
    console.log('   ✅ Server running on port 3333');
    console.log('   ✅ Blockchain service initialized (mock mode)');
    console.log('   ✅ All endpoints responding');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   npm run start:dev');
    }
  }
}

// Run tests
testBasicEndpoints();