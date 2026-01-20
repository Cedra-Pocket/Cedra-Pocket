const axios = require('axios');

const BASE_URL = 'http://localhost:3333';

// Test data
const TEST_USER_ID = '123456789';
const TEST_WALLET_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
const TEST_SERVER_PUBLIC_KEY = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab';

async function testBlockchainIntegration() {
  console.log('🧪 Testing Blockchain Integration...\n');

  try {
    // Test 1: Initialize Treasury
    console.log('1. Testing Treasury Initialization...');
    const treasuryInit = await axios.post(`${BASE_URL}/blockchain/treasury/initialize`, {
      seed: 'cedra_gamefi_treasury_test'
    });
    console.log('✅ Treasury initialized:', treasuryInit.data);
    console.log('');

    // Test 2: Get Treasury Status
    console.log('2. Testing Treasury Status...');
    const treasuryStatus = await axios.get(`${BASE_URL}/blockchain/treasury/status`);
    console.log('✅ Treasury status:', treasuryStatus.data);
    console.log('');

    // Test 3: Deposit to Treasury
    console.log('3. Testing Treasury Deposit...');
    const treasuryDeposit = await axios.post(`${BASE_URL}/blockchain/treasury/deposit`, {
      amount: 1000000000 // 10 CEDRA (assuming 8 decimals)
    });
    console.log('✅ Treasury deposit:', treasuryDeposit.data);
    console.log('');

    // Test 4: Get Treasury Balance
    console.log('4. Testing Treasury Balance...');
    const treasuryBalance = await axios.get(`${BASE_URL}/blockchain/treasury/balance`);
    console.log('✅ Treasury balance:', treasuryBalance.data);
    console.log('');

    // Test 5: Initialize Rewards System
    console.log('5. Testing Rewards Initialization...');
    const rewardsInit = await axios.post(`${BASE_URL}/blockchain/rewards/initialize`, {
      serverPublicKey: TEST_SERVER_PUBLIC_KEY
    });
    console.log('✅ Rewards initialized:', rewardsInit.data);
    console.log('');

    // Test 6: Get Rewards Status
    console.log('6. Testing Rewards Status...');
    const rewardsStatus = await axios.get(`${BASE_URL}/blockchain/rewards/status`);
    console.log('✅ Rewards status:', rewardsStatus.data);
    console.log('');

    // Test 7: Check Nonce (should be unused)
    console.log('7. Testing Nonce Check...');
    const nonceCheck = await axios.get(`${BASE_URL}/blockchain/rewards/nonce/1`);
    console.log('✅ Nonce check:', nonceCheck.data);
    console.log('');

    // Test 8: Claim Reward
    console.log('8. Testing Reward Claim...');
    const mockSignature = '0x' + '1234567890abcdef'.repeat(8); // Mock signature
    const rewardClaim = await axios.post(`${BASE_URL}/blockchain/rewards/claim`, {
      userAddress: TEST_WALLET_ADDRESS,
      amount: 100000000, // 1 CEDRA
      nonce: 1,
      signature: mockSignature
    });
    console.log('✅ Reward claim:', rewardClaim.data);
    console.log('');

    // Test 9: Get Account Balance
    console.log('9. Testing Account Balance...');
    const accountBalance = await axios.get(`${BASE_URL}/blockchain/account/${TEST_WALLET_ADDRESS}/balance`);
    console.log('✅ Account balance:', accountBalance.data);
    console.log('');

    // Test 10: Test Pet Claim with Blockchain Integration
    console.log('10. Testing Pet Claim with Blockchain...');
    try {
      const petClaim = await axios.post(`${BASE_URL}/game/pet/claim/${TEST_USER_ID}`);
      console.log('✅ Pet claim (with blockchain integration):', petClaim.data);
    } catch (error) {
      console.log('ℹ️ Pet claim failed (expected if user not found):', error.response?.data || error.message);
    }
    console.log('');

    console.log('🎉 All blockchain integration tests completed!');
    console.log('');
    console.log('📋 Available Blockchain Endpoints:');
    console.log('   Treasury Management:');
    console.log('     POST /blockchain/treasury/initialize');
    console.log('     POST /blockchain/treasury/deposit');
    console.log('     GET  /blockchain/treasury/balance/:adminAddress?');
    console.log('     GET  /blockchain/treasury/status/:adminAddress?');
    console.log('   Rewards Management:');
    console.log('     POST /blockchain/rewards/initialize');
    console.log('     POST /blockchain/rewards/claim');
    console.log('     GET  /blockchain/rewards/nonce/:nonce/:adminAddress?');
    console.log('     GET  /blockchain/rewards/status/:adminAddress?');
    console.log('     POST /blockchain/rewards/pause');
    console.log('   Account Management:');
    console.log('     GET  /blockchain/account/:address/balance');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   npm run start:dev');
    }
  }
}

// Run tests
testBlockchainIntegration();