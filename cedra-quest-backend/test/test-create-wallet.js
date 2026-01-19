// Test wallet creation specifically
const BASE_URL = 'http://localhost:3333';

async function testCreateWallet() {
  console.log('🔧 Testing Wallet Creation...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/create-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegram_id: '123456789',
        requested_address: 'testuser.hot.tg',
        public_key: 'mock_public_key_for_testing_0x123456789abcdef'
      })
    });

    const result = await response.json();
    console.log('Create Wallet Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Wallet created successfully!');
      console.log('   Address:', result.wallet_address);
      console.log('   Transaction Hash:', result.transaction_hash);
    } else {
      console.log('❌ Wallet creation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function testLoginAfterWalletCreation() {
  console.log('\n🔍 Testing Login After Wallet Creation...');
  
  const mockInitData = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22username%22%3A%22testuser%22%7D&auth_date=1642680000&hash=mock_hash_for_testing';
  
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData: mockInitData
      })
    });

    const result = await response.json();
    console.log('Login Response:', JSON.stringify(result, null, 2));
    
    if (result.success && result.user) {
      console.log('✅ User login successful!');
      console.log('   Telegram ID:', result.user.telegram_id);
      console.log('   Wallet Address:', result.user.wallet_address);
      console.log('   Level:', result.user.level);
      console.log('   Points:', result.user.total_points);
    } else {
      console.log('❌ Login failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function runTest() {
  await testCreateWallet();
  await testLoginAfterWalletCreation();
}

runTest().catch(console.error);