# 🚀 Cedra Quest API Guide for Frontend Developers

Complete API reference for integrating with Cedra Quest Backend.

## 📋 Table of Contents

- [🔧 Base Configuration](#-base-configuration)
- [🔐 Authentication APIs](#-authentication-apis)
- [🐾 Pet System APIs](#-pet-system-apis)
- [⚡ Energy System APIs](#-energy-system-apis)
- [🎮 Game Session APIs](#-game-session-apis)
- [🏆 Ranking System APIs](#-ranking-system-apis)
- [🔄 Game Cycle APIs](#-game-cycle-apis)
- [📊 Dashboard API](#-dashboard-api)
- [🛡️ Error Handling](#️-error-handling)
- [💡 Integration Examples](#-integration-examples)

---

## 🔧 Base Configuration

### **Base URL**
```javascript
const API_BASE_URL = 'https://your-domain.com/api'; // Production
// const API_BASE_URL = 'http://localhost:3333'; // Development
```

### **Headers**
```javascript
const headers = {
  'Content-Type': 'application/json',
  // Add authorization headers if needed
};
```

---

## 🔐 Authentication APIs

### **1. User Login/Check**
Check if user exists or needs wallet creation.

**Endpoint:** `POST /auth/login`

**Request:**
```javascript
const loginUser = async (initData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      initData: window.Telegram.WebApp.initData // Get from Telegram
    })
  });
  return response.json();
};
```

**Response - Existing User:**
```json
{
  "success": true,
  "user": {
    "telegram_id": "123456789",
    "wallet_address": "john_doe.hot.tg",
    "username": "john_doe",
    "total_points": 1500,
    "level": 3,
    "current_xp": 250,
    "current_rank": "SILVER",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response - New User:**
```json
{
  "success": true,
  "suggestedWalletName": "john_doe.hot.tg"
}
```

### **2. Create Wallet**
Create wallet for new users (after client-side key generation).

**Endpoint:** `POST /auth/create-wallet`

**Request:**
```javascript
const createWallet = async (telegramId, walletName, publicKey) => {
  const response = await fetch(`${API_BASE_URL}/auth/create-wallet`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      telegram_id: telegramId,
      requested_address: walletName,
      public_key: publicKey // Generated client-side from seed phrase
    })
  });
  return response.json();
};
```

**Response - Success:**
```json
{
  "success": true,
  "wallet_address": "john_doe.hot.tg",
  "transaction_hash": "0x1a2b3c4d5e6f..."
}
```

### **3. Recover Wallet**
Recover wallet using public key from seed phrase.

**Endpoint:** `POST /auth/recover-wallet`

**Request:**
```javascript
const recoverWallet = async (publicKey) => {
  const response = await fetch(`${API_BASE_URL}/auth/recover-wallet`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      public_key: publicKey // Derived from seed phrase
    })
  });
  return response.json();
};
```

---

## 🐾 Pet System APIs

### **1. Get Pet Status**
Get current pet information and pending rewards.

**Endpoint:** `GET /game/pet/status/{userId}`

**Request:**
```javascript
const getPetStatus = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/game/pet/status/${userId}`);
  return response.json();
};
```

**Response:**
```json
{
  "level": 3,
  "currentXp": 800,
  "xpForNextLevel": 1200,
  "lastClaimTime": "2024-01-19T10:00:00.000Z",
  "pendingRewards": 150,
  "canLevelUp": false,
  "dailyFeedSpent": 200,
  "dailyFeedLimit": 600,
  "feedCost": 20
}
```

### **2. Feed Pet**
Feed pet to gain XP (costs points).

**Endpoint:** `POST /game/pet/feed/{userId}`

**Request:**
```javascript
const feedPet = async (userId, feedCount) => {
  const response = await fetch(`${API_BASE_URL}/game/pet/feed/${userId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      feedCount: feedCount // 1-30 feeds per request
    })
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "pointsSpent": 100,
  "xpGained": 100,
  "newXp": 900,
  "canLevelUp": false,
  "dailySpentTotal": 300
}
```

### **3. Claim Mining Rewards**
Claim accumulated mining rewards from pet.

**Endpoint:** `POST /game/pet/claim/{userId}`

**Request:**
```javascript
const claimRewards = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/game/pet/claim/${userId}`, {
    method: 'POST',
    headers
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "pointsEarned": 150,
  "newTotalPoints": 1650,
  "newLifetimePoints": 5000,
  "claimTime": "2024-01-19T12:00:00.000Z"
}
```

---

## ⚡ Energy System APIs

### **1. Get Energy Status**
Get current energy and regeneration info.

**Endpoint:** `GET /game/energy/status/{userId}`

**Request:**
```javascript
const getEnergyStatus = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/game/energy/status/${userId}`);
  return response.json();
};
```

**Response:**
```json
{
  "currentEnergy": 7,
  "maxEnergy": 10,
  "nextRegenTime": "2024-01-19T12:30:00.000Z",
  "timeToFullEnergy": 5400000
}
```

### **2. Refill Energy**
Buy energy with points.

**Endpoint:** `POST /game/energy/refill/{userId}`

**Request:**
```javascript
const refillEnergy = async (userId, energyAmount) => {
  const response = await fetch(`${API_BASE_URL}/game/energy/refill/${userId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      energyAmount: energyAmount // 1-10 energy
    })
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "pointsCost": 30,
  "newEnergy": 10
}
```

---

## 🎮 Game Session APIs

### **1. Start Game Session**
Start a game (consumes 1 energy).

**Endpoint:** `POST /game/session/start/{userId}`

**Request:**
```javascript
const startGame = async (userId, gameType) => {
  const response = await fetch(`${API_BASE_URL}/game/session/start/${userId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      gameType: gameType // 'arcade', 'puzzle', 'memory', 'reaction'
    })
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "energyUsed": 1
}
```

### **2. Complete Game Session**
Complete game and earn points based on score.

**Endpoint:** `POST /game/session/complete/{userId}`

**Request:**
```javascript
const completeGame = async (userId, gameType, score, duration) => {
  const response = await fetch(`${API_BASE_URL}/game/session/complete/${userId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      gameType: gameType,
      score: score,
      duration: duration // seconds (optional)
    })
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "pointsEarned": 200,
  "energyUsed": 1,
  "newEnergyLevel": 6,
  "newTotalPoints": 1850
}
```

### **3. Get Game Statistics**
Get user's game playing statistics.

**Endpoint:** `GET /game/session/stats/{userId}`

**Request:**
```javascript
const getGameStats = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/game/session/stats/${userId}`);
  return response.json();
};
```

**Response:**
```json
{
  "totalGamesPlayed": 25,
  "totalPointsEarned": 5000,
  "averageScore": 1200,
  "favoriteGameType": "arcade",
  "todayGamesPlayed": 5
}
```

---

## 🏆 Ranking System APIs

### **1. Get User Rank Info**
Get user's current rank and progress.

**Endpoint:** `GET /game/ranking/user/{userId}`

**Request:**
```javascript
const getUserRank = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/game/ranking/user/${userId}`);
  return response.json();
};
```

**Response:**
```json
{
  "currentRank": "SILVER",
  "lifetimePoints": 15000,
  "nextRankThreshold": 50000,
  "pointsToNextRank": 35000,
  "rankProgress": 30
}
```

### **2. Get Leaderboard**
Get top players leaderboard.

**Endpoint:** `GET /game/ranking/leaderboard?limit=50&offset=0`

**Request:**
```javascript
const getLeaderboard = async (limit = 50, offset = 0) => {
  const response = await fetch(
    `${API_BASE_URL}/game/ranking/leaderboard?limit=${limit}&offset=${offset}`
  );
  return response.json();
};
```

**Response:**
```json
{
  "users": [
    {
      "telegram_id": "123456789",
      "username": "john_doe",
      "lifetime_points": 50000,
      "current_rank": "GOLD",
      "position": 1
    }
  ],
  "total": 1000
}
```

### **3. Get User Position**
Get user's position in global leaderboard.

**Endpoint:** `GET /game/ranking/position/{userId}`

**Request:**
```javascript
const getUserPosition = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/game/ranking/position/${userId}`);
  return response.json();
};
```

**Response:**
```json
{
  "position": 42
}
```

### **4. Get Rank Statistics**
Get distribution of users across ranks.

**Endpoint:** `GET /game/ranking/statistics`

**Request:**
```javascript
const getRankStats = async () => {
  const response = await fetch(`${API_BASE_URL}/game/ranking/statistics`);
  return response.json();
};
```

**Response:**
```json
{
  "BRONZE": 500,
  "SILVER": 300,
  "GOLD": 150,
  "PLATINUM": 40,
  "DIAMOND": 9,
  "LEVIATHAN": 1
}
```

---

## 🔄 Game Cycle APIs

### **1. Get Current Cycle**
Get active game cycle information.

**Endpoint:** `GET /game/cycle/current`

**Request:**
```javascript
const getCurrentCycle = async () => {
  const response = await fetch(`${API_BASE_URL}/game/cycle/current`);
  return response.json();
};
```

**Response:**
```json
{
  "cycleNumber": 2,
  "growthRate": 0.3,
  "maxSpeedCap": 3.0,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-03-31T23:59:59.000Z",
  "isActive": true
}
```

---

## 📊 Dashboard API

### **Get Complete Dashboard Data**
Get all user data in one request (recommended for dashboard).

**Endpoint:** `GET /game/dashboard/{userId}`

**Request:**
```javascript
const getDashboard = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/game/dashboard/${userId}`);
  return response.json();
};
```

**Response:**
```json
{
  "pet": {
    "level": 3,
    "currentXp": 800,
    "xpForNextLevel": 1200,
    "pendingRewards": 150,
    "canLevelUp": false,
    "dailyFeedSpent": 200,
    "dailyFeedLimit": 600,
    "feedCost": 20
  },
  "energy": {
    "currentEnergy": 7,
    "maxEnergy": 10,
    "nextRegenTime": "2024-01-19T12:30:00.000Z",
    "timeToFullEnergy": 5400000
  },
  "ranking": {
    "currentRank": "SILVER",
    "lifetimePoints": 15000,
    "nextRankThreshold": 50000,
    "pointsToNextRank": 35000,
    "rankProgress": 30
  },
  "gameStats": {
    "totalGamesPlayed": 25,
    "totalPointsEarned": 5000,
    "averageScore": 1200,
    "favoriteGameType": "arcade",
    "todayGamesPlayed": 5
  },
  "success": true
}
```

---

## 🛡️ Error Handling

### **Common Error Responses**

**Authentication Error:**
```json
{
  "success": false,
  "error": "Invalid Telegram signature",
  "statusCode": 401
}
```

**Insufficient Resources:**
```json
{
  "success": false,
  "error": "Insufficient points",
  "pointsCost": 100,
  "newEnergy": 0
}
```

**Validation Error:**
```json
{
  "message": [
    "feedCount must not be greater than 30",
    "feedCount must not be less than 1"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### **Error Handling Pattern**
```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const result = await apiFunction();
    
    if (result.success === false) {
      // Handle business logic errors
      showError(result.error);
      return null;
    }
    
    return result;
  } catch (error) {
    // Handle network/server errors
    console.error('API Error:', error);
    showError('Network error. Please try again.');
    return null;
  }
};
```

---

## 💡 Integration Examples

### **1. Complete Authentication Flow**
```javascript
class AuthService {
  async authenticateUser() {
    // Get Telegram initData
    const initData = window.Telegram.WebApp.initData;
    
    // Check if user exists
    const loginResult = await loginUser(initData);
    
    if (loginResult.success && loginResult.user) {
      // Existing user - go to dashboard
      this.setCurrentUser(loginResult.user);
      return { type: 'existing', user: loginResult.user };
    }
    
    if (loginResult.success && loginResult.suggestedWalletName) {
      // New user - start wallet creation
      return { 
        type: 'new', 
        suggestedName: loginResult.suggestedWalletName 
      };
    }
    
    throw new Error(loginResult.error);
  }
  
  async createUserWallet(suggestedName) {
    // Generate seed phrase (client-side)
    const seedPhrase = this.generateSeedPhrase();
    
    // Show seed phrase to user and require confirmation
    await this.showSeedPhraseBackup(seedPhrase);
    
    // Generate keys from seed phrase
    const { publicKey, privateKey } = this.deriveKeys(seedPhrase);
    
    // Store private key securely (client-side only)
    this.storePrivateKey(privateKey);
    
    // Create wallet on server
    const telegramId = this.getTelegramUserId();
    const result = await createWallet(telegramId, suggestedName, publicKey);
    
    if (result.success) {
      // Wallet created successfully
      return result;
    }
    
    throw new Error(result.error);
  }
}
```

### **2. Game Loop Implementation**
```javascript
class GameService {
  async playGame(gameType) {
    // Check energy first
    const energyStatus = await getEnergyStatus(this.userId);
    
    if (energyStatus.currentEnergy < 1) {
      throw new Error('Insufficient energy');
    }
    
    // Start game session
    const startResult = await startGame(this.userId, gameType);
    
    if (!startResult.success) {
      throw new Error(startResult.error);
    }
    
    // Play game (your game logic here)
    const gameResult = await this.playGameLogic(gameType);
    
    // Complete game session
    const completeResult = await completeGame(
      this.userId, 
      gameType, 
      gameResult.score, 
      gameResult.duration
    );
    
    return completeResult;
  }
  
  async feedPet(feedCount) {
    const result = await feedPet(this.userId, feedCount);
    
    if (result.success) {
      // Update UI with new XP
      this.updatePetUI(result);
      
      if (result.canLevelUp) {
        // Show level up option
        this.showLevelUpOption();
      }
    }
    
    return result;
  }
}
```

### **3. Real-time Dashboard Updates**
```javascript
class DashboardService {
  constructor(userId) {
    this.userId = userId;
    this.updateInterval = null;
  }
  
  async loadDashboard() {
    const data = await getDashboard(this.userId);
    this.updateUI(data);
    return data;
  }
  
  startAutoUpdate() {
    // Update dashboard every 30 seconds
    this.updateInterval = setInterval(async () => {
      try {
        await this.loadDashboard();
      } catch (error) {
        console.error('Dashboard update failed:', error);
      }
    }, 30000);
  }
  
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
  
  updateUI(data) {
    // Update pet info
    this.updatePetDisplay(data.pet);
    
    // Update energy bar
    this.updateEnergyBar(data.energy);
    
    // Update rank progress
    this.updateRankProgress(data.ranking);
    
    // Update game stats
    this.updateGameStats(data.gameStats);
  }
}
```

### **4. Energy Management**
```javascript
class EnergyManager {
  constructor(userId) {
    this.userId = userId;
    this.regenTimer = null;
  }
  
  async updateEnergyDisplay() {
    const status = await getEnergyStatus(this.userId);
    
    // Update UI
    this.displayEnergy(status.currentEnergy, status.maxEnergy);
    
    // Set up regeneration timer
    if (status.nextRegenTime) {
      this.scheduleRegenUpdate(status.nextRegenTime);
    }
    
    return status;
  }
  
  scheduleRegenUpdate(nextRegenTime) {
    const now = new Date();
    const regenTime = new Date(nextRegenTime);
    const delay = regenTime.getTime() - now.getTime();
    
    if (delay > 0) {
      this.regenTimer = setTimeout(() => {
        this.updateEnergyDisplay();
      }, delay);
    }
  }
  
  async refillEnergy(amount) {
    const result = await refillEnergy(this.userId, amount);
    
    if (result.success) {
      // Update display immediately
      await this.updateEnergyDisplay();
    }
    
    return result;
  }
}
```

---

## 🎯 Best Practices

### **1. API Call Optimization**
- Use dashboard API for initial load
- Cache data when possible
- Implement retry logic for failed requests
- Use loading states for better UX

### **2. Error Handling**
- Always check `success` field in responses
- Provide user-friendly error messages
- Implement offline handling
- Log errors for debugging

### **3. Security**
- Never send private keys to server
- Validate all user inputs
- Use HTTPS in production
- Store sensitive data securely

### **4. Performance**
- Batch API calls when possible
- Implement proper loading states
- Use pagination for large lists
- Cache frequently accessed data

---

## 📞 Support

- **API Issues**: Check server logs and error responses
- **Authentication**: Follow Telegram integration guide
- **Game Logic**: Review business rules in game economy docs
- **Performance**: Monitor API response times and optimize calls

**Happy coding! 🚀**