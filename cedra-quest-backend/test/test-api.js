// Test script for Cedra Quest Backend API
const BASE_URL = 'http://localhost:3333';

// Mock Telegram initData for testing
const mockInitData = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22username%22%3A%22testuser%22%7D&auth_date=1642680000&hash=mock_hash_for_testing';

async function testLogin() {
  console.log('\n=== Testing Login API ===');
  
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
    
    if (result.success && result.suggestedWalletName) {
      console.log('✅ New user detected, suggested wallet name:', result.suggestedWalletName);
      return result.suggestedWalletName;
    } else if (result.success && result.user) {
      console.log('✅ Existing user login successful');
      return null;
    } else {
      console.log('❌ Login failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Login request failed:', error.message);
    return null;
  }
}

async function testCreateWallet(suggestedName) {
  if (!suggestedName) {
    console.log('⏭️  Skipping wallet creation (no suggested name)');
    return;
  }

  console.log('\n=== Testing Create Wallet API ===');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/create-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegram_id: '123456789',
        requested_address: suggestedName,
        public_key: 'mock_public_key_for_testing_0x123456789abcdef'
      })
    });

    const result = await response.json();
    console.log('Create Wallet Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Wallet created successfully:', result.wallet_address);
    } else {
      console.log('❌ Wallet creation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Create wallet request failed:', error.message);
  }
}

async function testRecoverWallet() {
  console.log('\n=== Testing Recover Wallet API ===');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/recover-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_key: 'mock_public_key_for_testing_0x123456789abcdef'
      })
    });

    const result = await response.json();
    console.log('Recover Wallet Response:', JSON.stringify(result, null, 2));
    
    if (result.success && result.user) {
      console.log('✅ Wallet recovered successfully for user:', result.user.telegram_id);
    } else {
      console.log('❌ Wallet recovery failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Recover wallet request failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('Server URL:', BASE_URL);
  
  // Test 1: Login (should suggest wallet name for new user)
  const suggestedName = await testLogin();
  
  // Test 2: Create wallet (if new user)
  await testCreateWallet(suggestedName);
  
  // Test 3: Login again (should return user info now)
  console.log('\n=== Testing Login Again (Should Return User Info) ===');
  await testLogin();
  
  // Test 4: Recover wallet
  await testRecoverWallet();
  
  console.log('\n🏁 Tests completed!');
}

// Run tests
runTests().catch(console.error);