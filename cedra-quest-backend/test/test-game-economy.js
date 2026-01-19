// Test script for Game Economy APIs
const BASE_URL = 'http://localhost:3333';
const TEST_USER_ID = '123456789'; // Use the same test user from auth

async function testPetSystem() {
  console.log('\n🐾 === Testing Pet System ===');
  
  try {
    // Get pet status
    console.log('\n📊 Getting pet status...');
    const statusResponse = await fetch(`${BASE_URL}/game/pet/status/${TEST_USER_ID}`);
    const petStatus = await statusResponse.json();
    console.log('Pet Status:', JSON.stringify(petStatus, null, 2));

    // Feed pet
    console.log('\n🍖 Feeding pet...');
    const feedResponse = await fetch(`${BASE_URL}/game/pet/feed/${TEST_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedCount: 5 })
    });
    const feedResult = await feedResponse.json();
    console.log('Feed Result:', JSON.stringify(feedResult, null, 2));

    // Claim rewards
    console.log('\n💰 Claiming rewards...');
    const claimResponse = await fetch(`${BASE_URL}/game/pet/claim/${TEST_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const claimResult = await claimResponse.json();
    console.log('Claim Result:', JSON.stringify(claimResult, null, 2));

  } catch (error) {
    console.error('❌ Pet system test failed:', error.message);
  }
}

async function testEnergySystem() {
  console.log('\n⚡ === Testing Energy System ===');
  
  try {
    // Get energy status
    console.log('\n📊 Getting energy status...');
    const statusResponse = await fetch(`${BASE_URL}/game/energy/status/${TEST_USER_ID}`);
    const energyStatus = await statusResponse.json();
    console.log('Energy Status:', JSON.stringify(energyStatus, null, 2));

    // Refill energy (if user has points)
    console.log('\n🔋 Refilling energy...');
    const refillResponse = await fetch(`${BASE_URL}/game/energy/refill/${TEST_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energyAmount: 2 })
    });
    const refillResult = await refillResponse.json();
    console.log('Refill Result:', JSON.stringify(refillResult, null, 2));

  } catch (error) {
    console.error('❌ Energy system test failed:', error.message);
  }
}

async function testGameSessions() {
  console.log('\n🎮 === Testing Game Sessions ===');
  
  try {
    // Start game session
    console.log('\n🚀 Starting game session...');
    const startResponse = await fetch(`${BASE_URL}/game/session/start/${TEST_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameType: 'arcade' })
    });
    const startResult = await startResponse.json();
    console.log('Start Game Result:', JSON.stringify(startResult, null, 2));

    if (startResult.success) {
      // Complete game session
      console.log('\n🏁 Completing game session...');
      const completeResponse = await fetch(`${BASE_URL}/game/session/complete/${TEST_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gameType: 'arcade',
          score: 1500,
          duration: 45
        })
      });
      const completeResult = await completeResponse.json();
      console.log('Complete Game Result:', JSON.stringify(completeResult, null, 2));
    }

    // Get game stats
    console.log('\n📈 Getting game stats...');
    const statsResponse = await fetch(`${BASE_URL}/game/session/stats/${TEST_USER_ID}`);
    const gameStats = await statsResponse.json();
    console.log('Game Stats:', JSON.stringify(gameStats, null, 2));

  } catch (error) {
    console.error('❌ Game sessions test failed:', error.message);
  }
}

async function testRankingSystem() {
  console.log('\n🏆 === Testing Ranking System ===');
  
  try {
    // Get user rank info
    console.log('\n👤 Getting user rank info...');
    const rankResponse = await fetch(`${BASE_URL}/game/ranking/user/${TEST_USER_ID}`);
    const rankInfo = await rankResponse.json();
    console.log('Rank Info:', JSON.stringify(rankInfo, null, 2));

    // Get leaderboard
    console.log('\n🥇 Getting leaderboard...');
    const leaderboardResponse = await fetch(`${BASE_URL}/game/ranking/leaderboard?limit=10`);
    const leaderboard = await leaderboardResponse.json();
    console.log('Leaderboard:', JSON.stringify(leaderboard, null, 2));

    // Get user position
    console.log('\n📍 Getting user position...');
    const positionResponse = await fetch(`${BASE_URL}/game/ranking/position/${TEST_USER_ID}`);
    const position = await positionResponse.json();
    console.log('User Position:', JSON.stringify(position, null, 2));

    // Get rank statistics
    console.log('\n📊 Getting rank statistics...');
    const statsResponse = await fetch(`${BASE_URL}/game/ranking/statistics`);
    const rankStats = await statsResponse.json();
    console.log('Rank Statistics:', JSON.stringify(rankStats, null, 2));

  } catch (error) {
    console.error('❌ Ranking system test failed:', error.message);
  }
}

async function testGameCycles() {
  console.log('\n🔄 === Testing Game Cycles ===');
  
  try {
    // Get current cycle
    console.log('\n📅 Getting current cycle...');
    const currentResponse = await fetch(`${BASE_URL}/game/cycle/current`);
    const currentCycle = await currentResponse.json();
    console.log('Current Cycle:', JSON.stringify(currentCycle, null, 2));

    // Get all cycles
    console.log('\n📋 Getting all cycles...');
    const allResponse = await fetch(`${BASE_URL}/game/cycle/all`);
    const allCycles = await allResponse.json();
    console.log('All Cycles:', JSON.stringify(allCycles, null, 2));

  } catch (error) {
    console.error('❌ Game cycles test failed:', error.message);
  }
}

async function testDashboard() {
  console.log('\n📊 === Testing Dashboard ===');
  
  try {
    const dashboardResponse = await fetch(`${BASE_URL}/game/dashboard/${TEST_USER_ID}`);
    const dashboard = await dashboardResponse.json();
    console.log('Dashboard Data:', JSON.stringify(dashboard, null, 2));

  } catch (error) {
    console.error('❌ Dashboard test failed:', error.message);
  }
}

async function runGameEconomyTests() {
  console.log('🚀 Starting Game Economy Tests...');
  console.log('Server URL:', BASE_URL);
  console.log('Test User ID:', TEST_USER_ID);
  
  // Run tests in sequence
  await testPetSystem();
  await testEnergySystem();
  await testGameSessions();
  await testRankingSystem();
  await testGameCycles();
  await testDashboard();
  
  console.log('\n🏁 Game Economy Tests Completed!');
}

// Run tests
runGameEconomyTests().catch(console.error);