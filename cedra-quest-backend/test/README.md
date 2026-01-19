# 🧪 Test Scripts

This folder contains various test scripts for the Cedra Quest Backend API.

## 📁 Test Files

### **Authentication Tests**
- `test-api.js` - Basic API testing with mock data
- `test-real-telegram.js` - Testing with real Telegram initData
- `test-create-wallet.js` - Wallet creation flow testing

### **Game Economy Tests**
- `test-game-economy.js` - Complete game economy system testing
- `test-simple.js` - Simple connectivity tests

## 🚀 How to Run Tests

### **Prerequisites**
1. Backend server running on `http://localhost:3333`
2. Database connected and migrated
3. Environment variables configured

### **Run Individual Tests**
```bash
# Test authentication flow
node test/test-api.js

# Test with real Telegram data (requires bot token)
node test/test-real-telegram.js

# Test wallet creation
node test/test-create-wallet.js

# Test complete game economy
node test/test-game-economy.js

# Simple connectivity test
node test/test-simple.js
```

### **Run All Tests**
```bash
# Run all tests sequentially
for file in test/*.js; do
  echo "Running $file..."
  node "$file"
  echo "---"
done
```

## 📊 Test Coverage

### **Authentication System** ✅
- Telegram initData validation
- User lookup and registration
- Wallet name generation
- Wallet creation flow
- Error handling

### **Game Economy System** ✅
- Pet feeding and leveling
- Energy management
- Game sessions
- Ranking system
- Leaderboard
- Game cycles

### **Expected Results**
- All APIs should return proper JSON responses
- Error cases should be handled gracefully
- Database operations should complete successfully
- Business logic should work as expected

## 🔧 Troubleshooting

### **Common Issues**

**Connection Refused:**
```bash
# Make sure server is running
npm run start:dev
```

**Database Errors:**
```bash
# Run migrations
npx prisma db push
```

**Authentication Errors:**
```bash
# Check TELEGRAM_BOT_TOKEN in .env
# For testing, use mock data in test-api.js
```

**Insufficient Points:**
```bash
# Some tests require user to have points
# Run test-game-economy.js to earn points first
```

## 📝 Adding New Tests

To add new test files:

1. Create `test-[feature].js` in this folder
2. Follow the existing pattern:
   ```javascript
   const BASE_URL = 'http://localhost:3333';
   
   async function testFeature() {
     // Your test logic here
   }
   
   testFeature().catch(console.error);
   ```
3. Update this README with the new test description

## 🎯 Test Data

**Test User ID:** `123456789`
**Mock InitData:** Available in `test-api.js`
**Real InitData:** Follow `HOW_TO_GET_REAL_INITDATA.md` guide