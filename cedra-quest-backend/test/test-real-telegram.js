// Test script with real Telegram data
const BASE_URL = 'http://localhost:3333';

// INSTRUCTIONS:
// 1. Replace YOUR_REAL_BOT_TOKEN_HERE in .env with your actual bot token
// 2. Get real initData from your Telegram Mini App
// 3. Replace REAL_INIT_DATA_HERE with the actual initData string
// 4. Run: node test-real-telegram.js

const REAL_INIT_DATA = 'REAL_INIT_DATA_HERE'; // Replace this with real initData from Telegram

async function testRealTelegramAuth() {
  console.log('🔐 Testing Real Telegram Authentication...');
  
  if (REAL_INIT_DATA === 'REAL_INIT_DATA_HERE') {
    console.log('❌ Please replace REAL_INIT_DATA with actual initData from Telegram Mini App');
    console.log('');
    console.log('📋 How to get real initData:');
    console.log('1. Create a Telegram Mini App');
    console.log('2. In your Mini App frontend, use: window.Telegram.WebApp.initData');
    console.log('3. Copy the full initData string and replace REAL_INIT_DATA_HERE');
    console.log('4. Make sure your bot token in .env is real');
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData: REAL_INIT_DATA
      })
    });

    const result = await response.json();
    console.log('Authentication Response:', JSON.stringify(result, null, 2));
    
    if (result.success && result.user) {
      console.log('✅ Existing user authenticated successfully!');
      console.log('   User ID:', result.user.telegram_id);
      console.log('   Wallet:', result.user.wallet_address);
      console.log('   Username:', result.user.username);
    } else if (result.success && result.suggestedWalletName) {
      console.log('✅ New user detected!');
      console.log('   Suggested wallet name:', result.suggestedWalletName);
      
      // Test wallet creation for new user
      await testWalletCreation(result.suggestedWalletName);
    } else {
      console.log('❌ Authentication failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function testWalletCreation(suggestedName) {
  console.log('\n💼 Testing Wallet Creation...');
  
  // Extract user ID from initData for wallet creation
  const params = new URLSearchParams(REAL_INIT_DATA);
  const userStr = params.get('user');
  const userData = JSON.parse(userStr);
  const telegramId = userData.id.toString();
  
  try {
    const response = await fetch(`${BASE_URL}/auth/create-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegram_id: telegramId,
        requested_address: suggestedName,
        public_key: 'real_public_key_from_frontend_' + Date.now() // In real app, this comes from client-side key generation
      })
    });

    const result = await response.json();
    console.log('Wallet Creation Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Wallet created successfully!');
      console.log('   Address:', result.wallet_address);
      
      // Test login again to verify user is now registered
      console.log('\n🔄 Testing login after wallet creation...');
      await testRealTelegramAuth();
    } else {
      console.log('❌ Wallet creation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Wallet creation request failed:', error.message);
  }
}

console.log('🚀 Real Telegram Data Test');
console.log('Server URL:', BASE_URL);
console.log('');

testRealTelegramAuth().catch(console.error);