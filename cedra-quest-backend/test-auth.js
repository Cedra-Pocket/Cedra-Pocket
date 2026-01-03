const axios = require('axios');

async function testAuth() {
  try {
    // Test với mock data
    const mockInitData = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22username%22%3A%22testuser%22%7D&auth_date=1640995200&hash=test_hash';
    
    console.log('🧪 Testing Telegram Authentication...');
    console.log('📤 Sending initData to /auth/verify');
    
    const response = await axios.post('http://localhost:9999/auth/verify', {
      initData: mockInitData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Authentication Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Authentication Failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Details:', error.response?.data);
  }
}

testAuth();