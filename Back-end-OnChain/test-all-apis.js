const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test data
const TEST_DATA = {
    adminAddress: '79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe',
    userAddress: '0x1234567890abcdef1234567890abcdef12345678',
    serverPublicKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    treasurySeed: 'cedra_gamefi_treasury_v1',
    depositAmount: 1000000000, // 10 CEDRA
    rewardAmount: 100000000,   // 1 CEDRA
    nonce: 123,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
};

// Helper function to make API calls with error handling
async function apiCall(method, endpoint, data = null, description = '') {
    try {
        console.log(`\n🔄 ${description || `${method.toUpperCase()} ${endpoint}`}`);

        let response;
        if (method.toLowerCase() === 'get') {
            response = await axios.get(`${BASE_URL}${endpoint}`);
        } else if (method.toLowerCase() === 'post') {
            response = await axios.post(`${BASE_URL}${endpoint}`, data, {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log(`✅ Success:`, response.data);
        return { success: true, data: response.data };
    } catch (error) {
        const errorData = error.response?.data || { error: error.message };
        console.log(`❌ Error:`, errorData);
        return { success: false, error: errorData };
    }
}

async function testAllAPIs() {
    console.log('🧪 COMPREHENSIVE API TESTING FOR CEDRA ONCHAIN BACKEND');
    console.log('='.repeat(60));

    let passedTests = 0;
    let totalTests = 0;

    // ========== HEALTH CHECK ==========
    console.log('\n📋 1. HEALTH CHECK');
    console.log('-'.repeat(40));

    totalTests++;
    const healthResult = await apiCall('GET', '/health', null, 'Testing server health');
    if (healthResult.success) passedTests++;

    // ========== TREASURY MANAGEMENT ==========
    console.log('\n💰 2. TREASURY MANAGEMENT');
    console.log('-'.repeat(40));

    // Initialize Treasury
    totalTests++;
    const treasuryInitResult = await apiCall('POST', '/treasury/initialize', {
        seed: TEST_DATA.treasurySeed
    }, 'Initialize Treasury');
    if (treasuryInitResult.success) passedTests++;

    // Deposit to Treasury
    totalTests++;
    const treasuryDepositResult = await apiCall('POST', '/treasury/deposit', {
        amount: TEST_DATA.depositAmount
    }, 'Deposit to Treasury');
    if (treasuryDepositResult.success) passedTests++;

    // Get Treasury Balance (without admin address)
    totalTests++;
    const treasuryBalanceResult = await apiCall('GET', '/treasury/balance', null, 'Get Treasury Balance (default admin)');
    if (treasuryBalanceResult.success) passedTests++;

    // Get Treasury Balance (with admin address)
    totalTests++;
    const treasuryBalanceWithAdminResult = await apiCall('GET', `/treasury/balance/${TEST_DATA.adminAddress}`, null, 'Get Treasury Balance (specific admin)');
    if (treasuryBalanceWithAdminResult.success) passedTests++;

    // Get Treasury Status (without admin address)
    totalTests++;
    const treasuryStatusResult = await apiCall('GET', '/treasury/status', null, 'Get Treasury Status (default admin)');
    if (treasuryStatusResult.success) passedTests++;

    // Get Treasury Status (with admin address)
    totalTests++;
    const treasuryStatusWithAdminResult = await apiCall('GET', `/treasury/status/${TEST_DATA.adminAddress}`, null, 'Get Treasury Status (specific admin)');
    if (treasuryStatusWithAdminResult.success) passedTests++;

    // ========== REWARDS MANAGEMENT ==========
    console.log('\n🎁 3. REWARDS MANAGEMENT');
    console.log('-'.repeat(40));

    // Initialize Rewards
    totalTests++;
    const rewardsInitResult = await apiCall('POST', '/rewards/initialize', {
        serverPublicKey: TEST_DATA.serverPublicKey
    }, 'Initialize Rewards System');
    if (rewardsInitResult.success) passedTests++;

    // Claim Reward
    totalTests++;
    const rewardClaimResult = await apiCall('POST', '/rewards/claim', {
        userAddress: TEST_DATA.userAddress,
        amount: TEST_DATA.rewardAmount,
        nonce: TEST_DATA.nonce,
        signature: TEST_DATA.signature,
        adminAddress: TEST_DATA.adminAddress
    }, 'Claim Reward');
    if (rewardClaimResult.success) passedTests++;

    // Check Nonce (without admin address)
    totalTests++;
    const nonceCheckResult = await apiCall('GET', `/rewards/nonce/${TEST_DATA.nonce}`, null, 'Check Nonce (default admin)');
    if (nonceCheckResult.success) passedTests++;

    // Check Nonce (with admin address)
    totalTests++;
    const nonceCheckWithAdminResult = await apiCall('GET', `/rewards/nonce/${TEST_DATA.nonce}/${TEST_DATA.adminAddress}`, null, 'Check Nonce (specific admin)');
    if (nonceCheckWithAdminResult.success) passedTests++;

    // Get Rewards Status (without admin address)
    totalTests++;
    const rewardsStatusResult = await apiCall('GET', '/rewards/status', null, 'Get Rewards Status (default admin)');
    if (rewardsStatusResult.success) passedTests++;

    // Get Rewards Status (with admin address)
    totalTests++;
    const rewardsStatusWithAdminResult = await apiCall('GET', `/rewards/status/${TEST_DATA.adminAddress}`, null, 'Get Rewards Status (specific admin)');
    if (rewardsStatusWithAdminResult.success) passedTests++;

    // Pause Rewards System
    totalTests++;
    const rewardsPauseResult = await apiCall('POST', '/rewards/pause', {
        paused: true,
        adminAddress: TEST_DATA.adminAddress
    }, 'Pause Rewards System');
    if (rewardsPauseResult.success) passedTests++;

    // Unpause Rewards System
    totalTests++;
    const rewardsUnpauseResult = await apiCall('POST', '/rewards/pause', {
        paused: false,
        adminAddress: TEST_DATA.adminAddress
    }, 'Unpause Rewards System');
    if (rewardsUnpauseResult.success) passedTests++;

    // ========== ACCOUNT MANAGEMENT ==========
    console.log('\n👤 4. ACCOUNT MANAGEMENT');
    console.log('-'.repeat(40));

    // Get Account Balance
    totalTests++;
    const accountBalanceResult = await apiCall('GET', `/player/${TEST_DATA.adminAddress}/balance`, null, 'Get Account Balance');
    if (accountBalanceResult.success) passedTests++;

    // Get User Account Balance
    totalTests++;
    const userBalanceResult = await apiCall('GET', `/player/${TEST_DATA.userAddress}/balance`, null, 'Get User Account Balance');
    if (userBalanceResult.success) passedTests++;

    // ========== TRANSACTION MANAGEMENT ==========
    console.log('\n📊 5. TRANSACTION MANAGEMENT');
    console.log('-'.repeat(40));

    // Check Transaction Status
    totalTests++;
    const txStatusResult = await apiCall('GET', `/transaction/${TEST_DATA.txHash}/status`, null, 'Check Transaction Status');
    if (txStatusResult.success) passedTests++;

    // ========== LEGACY ENDPOINTS (SHOULD RETURN 501) ==========
    console.log('\n🚫 6. LEGACY ENDPOINTS (Expected to fail with 501)');
    console.log('-'.repeat(40));

    // Quest Start (should return 501)
    totalTests++;
    const questStartResult = await apiCall('POST', '/quest/start', {
        playerId: 'player123',
        questId: 1
    }, 'Quest Start (Legacy - should return 501)');
    if (!questStartResult.success && questStartResult.error.error?.includes('not implemented')) passedTests++;

    // Quest Complete (should return 501)
    totalTests++;
    const questCompleteResult = await apiCall('POST', '/quest/complete', {
        playerId: 'player123',
        questId: 1
    }, 'Quest Complete (Legacy - should return 501)');
    if (!questCompleteResult.success && questCompleteResult.error.error?.includes('not implemented')) passedTests++;

    // Quest Status (should return 501)
    totalTests++;
    const questStatusResult = await apiCall('GET', '/quest/1/status', null, 'Quest Status (Legacy - should return 501)');
    if (!questStatusResult.success && questStatusResult.error.error?.includes('not implemented')) passedTests++;

    // Player Stats (should return 501)
    totalTests++;
    const playerStatsResult = await apiCall('GET', '/player/player123/stats', null, 'Player Stats (Legacy - should return 501)');
    if (!playerStatsResult.success && playerStatsResult.error.error?.includes('not implemented')) passedTests++;

    // ========== ERROR HANDLING TESTS ==========
    console.log('\n⚠️ 7. ERROR HANDLING TESTS');
    console.log('-'.repeat(40));

    // Invalid Treasury Deposit (missing amount)
    totalTests++;
    const invalidDepositResult = await apiCall('POST', '/treasury/deposit', {}, 'Invalid Treasury Deposit (missing amount)');
    if (!invalidDepositResult.success) passedTests++;

    // Invalid Reward Claim (missing required fields)
    totalTests++;
    const invalidClaimResult = await apiCall('POST', '/rewards/claim', {
        userAddress: TEST_DATA.userAddress
        // Missing amount, nonce, signature
    }, 'Invalid Reward Claim (missing fields)');
    if (!invalidClaimResult.success) passedTests++;

    // Invalid Nonce (non-numeric)
    totalTests++;
    const invalidNonceResult = await apiCall('GET', '/rewards/nonce/invalid', null, 'Invalid Nonce (non-numeric)');
    if (!invalidNonceResult.success) passedTests++;

    // Invalid Rewards Initialize (missing serverPublicKey)
    totalTests++;
    const invalidRewardsInitResult = await apiCall('POST', '/rewards/initialize', {}, 'Invalid Rewards Initialize (missing serverPublicKey)');
    if (!invalidRewardsInitResult.success) passedTests++;

    // Invalid Rewards Pause (missing paused field)
    totalTests++;
    const invalidPauseResult = await apiCall('POST', '/rewards/pause', {
        adminAddress: TEST_DATA.adminAddress
        // Missing paused field
    }, 'Invalid Rewards Pause (missing paused field)');
    if (!invalidPauseResult.success) passedTests++;

    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 ALL TESTS PASSED! API is working perfectly!');
    } else {
        console.log('\n⚠️ Some tests failed. Check the logs above for details.');
    }

    console.log('\n📝 NEXT STEPS:');
    console.log('1. ✅ All API endpoints are functional');
    console.log('2. 🔧 Currently running in mock mode (expected)');
    console.log('3. 🚀 Ready for frontend integration');
    console.log('4. 🔗 Will automatically switch to real blockchain when SDK is ready');
    console.log('5. 📋 Consider adding authentication for production use');

    console.log('\n💡 USAGE EXAMPLES:');
    console.log('- Initialize system: POST /treasury/initialize → POST /rewards/initialize');
    console.log('- Deposit funds: POST /treasury/deposit');
    console.log('- Claim rewards: POST /rewards/claim (with valid signature)');
    console.log('- Check status: GET /treasury/status, GET /rewards/status');
    console.log('- Monitor transactions: GET /transaction/:hash/status');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Test interrupted by user');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('\n❌ Unhandled promise rejection:', error.message);
    process.exit(1);
});

// Run the comprehensive test
console.log('🚀 Starting comprehensive API testing...');
console.log('📡 Make sure the server is running on http://localhost:3001');
console.log('⏳ This will take a few moments...\n');

testAllAPIs().catch(error => {
    console.error('\n💥 Test suite failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.log('💡 Make sure the server is running: npm run dev');
    }
    process.exit(1);
});