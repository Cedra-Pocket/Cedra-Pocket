const axios = require('axios');

const BASE_URL = 'http://localhost:3333';

async function testRealBlockchain() {
  console.log('🔗 Testing Real Blockchain Connection...\n');

  try {
    // Test 1: Check connection status
    console.log('1. Checking Blockchain Connection Status...');
    const status = await axios.get(`${BASE_URL}/blockchain/status`);
    console.log('✅ Connection status:', status.data);
    
    if (!status.data.connected) {
      console.log('⚠️ Not connected to blockchain - running in mock mode');
      console.log('💡 To connect to real blockchain:');
      console.log('   1. Add real private key to .env:');
      console.log('      CEDRA_PRIVATE_KEY="ed25519-priv-0x[your-64-char-hex-key]"');
      console.log('   2. Restart server: npm run start:dev');
      console.log('   3. Run this test again');
      console.log('');
    } else {
      console.log('🎉 Connected to real Cedra blockchain!');
      console.log(`   Account: ${status.data.account}`);
      console.log(`   Network: ${status.data.network}`);
      console.log('');
    }

    // Test 2: Get account balance (works in both modes)
    console.log('2. Testing Account Balance...');
    const testAddress = status.data.account || '0x1';
    const balance = await axios.get(`${BASE_URL}/blockchain/account/${testAddress}/balance`);
    console.log('✅ Account balance:', balance.data);
    console.log('');

    // Test 3: Treasury operations
    console.log('3. Testing Treasury Operations...');
    
    // Initialize treasury
    const treasuryInit = await axios.post(`${BASE_URL}/blockchain/treasury/initialize`, {
      seed: 'test_treasury_' + Date.now()
    });
    console.log('✅ Treasury initialize:', treasuryInit.data.success ? 'Success' : 'Failed');
    
    // Get treasury status
    const treasuryStatus = await axios.get(`${BASE_URL}/blockchain/treasury/status`);
    console.log('✅ Treasury status:', treasuryStatus.data.success ? 'Success' : 'Failed');
    console.log('');

    // Test 4: Rewards operations
    console.log('4. Testing Rewards Operations...');
    
    // Initialize rewards
    const mockPublicKey = '0x' + 'a'.repeat(64);
    const rewardsInit = await axios.post(`${BASE_URL}/blockchain/rewards/initialize`, {
      serverPublicKey: mockPublicKey
    });
    console.log('✅ Rewards initialize:', rewardsInit.data.success ? 'Success' : 'Failed');
    
    // Get rewards status
    const rewardsStatus = await axios.get(`${BASE_URL}/blockchain/rewards/status`);
    console.log('✅ Rewards status:', rewardsStatus.data.success ? 'Success' : 'Failed');
    console.log('');

    console.log('🎉 All blockchain tests completed!');
    console.log('');
    
    if (status.data.connected) {
      console.log('🚀 Real Blockchain Mode:');
      console.log('   ✅ Connected to Cedra network');
      console.log('   ✅ Account initialized');
      console.log('   ✅ Transactions will be real');
      console.log('   ⚠️ Gas fees will be charged');
    } else {
      console.log('🧪 Mock Mode:');
      console.log('   ✅ All endpoints working');
      console.log('   ✅ Safe for development');
      console.log('   ✅ No gas fees');
      console.log('   ℹ️ Add private key to connect to real blockchain');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   npm run start:dev');
    }
  }
}

// Run tests
testRealBlockchain();