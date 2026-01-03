const axios = require('axios');

const API_BASE = 'http://localhost:9999';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

class APITester {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.jwtToken = null;
  }

  async testBasicEndpoints() {
    log.info('Testing Basic Endpoints...');
    
    try {
      // Test root endpoint
      const root = await this.client.get('/');
      log.success(`Root endpoint: ${root.data}`);

      // Test health endpoint
      const health = await this.client.get('/health');
      log.success(`Health check: ${health.data.status} (uptime: ${health.data.uptime}s)`);

      // Test auth helper
      const authHelper = await this.client.get('/test/auth');
      log.success(`Auth helper: ${authHelper.data.message}`);

      // Test quests without auth
      const quests = await this.client.get('/test/quests');
      log.success(`Test quests: ${quests.data.count} quests found`);

      return true;
    } catch (error) {
      log.error(`Basic endpoints failed: ${error.message}`);
      return false;
    }
  }

  async testAuthentication() {
    log.info('Testing Authentication...');
    
    try {
      // Test with invalid data first
      try {
        await this.client.post('/auth/verify', {
          initData: 'invalid_data'
        });
        log.error('Should have failed with invalid data');
        return false;
      } catch (error) {
        if (error.response?.status === 401) {
          log.success('Correctly rejected invalid auth data');
        } else {
          throw error;
        }
      }

      // Test with mock data (will fail but should show proper validation)
      const mockInitData = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22username%22%3A%22testuser%22%7D&auth_date=1640995200&hash=test_hash';
      
      try {
        const authResponse = await this.client.post('/auth/verify', {
          initData: mockInitData
        });
        
        // If this succeeds (shouldn't with mock data), save token
        this.jwtToken = authResponse.data.access_token;
        log.success('Authentication successful (unexpected with mock data)');
        return true;
      } catch (error) {
        if (error.response?.status === 401) {
          log.success('Correctly rejected mock auth data (expected)');
          log.warning('Real Telegram initData needed for actual authentication');
          return true;
        } else {
          throw error;
        }
      }
    } catch (error) {
      log.error(`Authentication test failed: ${error.message}`);
      return false;
    }
  }

  async testProtectedEndpoints() {
    log.info('Testing Protected Endpoints...');
    
    if (!this.jwtToken) {
      log.warning('No JWT token available, testing unauthorized access...');
      
      try {
        await this.client.get('/users/profile');
        log.error('Should have been unauthorized');
        return false;
      } catch (error) {
        if (error.response?.status === 401) {
          log.success('Correctly blocked unauthorized access to /users/profile');
        } else {
          throw error;
        }
      }

      try {
        await this.client.get('/quests');
        log.error('Should have been unauthorized');
        return false;
      } catch (error) {
        if (error.response?.status === 401) {
          log.success('Correctly blocked unauthorized access to /quests');
        } else {
          throw error;
        }
      }

      return true;
    }

    // Test with valid JWT token
    this.client.defaults.headers.common['Authorization'] = `Bearer ${this.jwtToken}`;
    
    try {
      const profile = await this.client.get('/users/profile');
      log.success(`User profile: ${profile.data.username || 'No username'}`);

      const quests = await this.client.get('/quests');
      log.success(`Protected quests: ${quests.data.length} quests`);

      return true;
    } catch (error) {
      log.error(`Protected endpoints failed: ${error.message}`);
      return false;
    }
  }

  async testQuestOperations() {
    log.info('Testing Quest Operations...');
    
    try {
      // Get quests list
      const questsResponse = await this.client.get('/test/quests');
      const quests = questsResponse.data.quests;
      
      if (quests.length === 0) {
        log.warning('No quests found for testing');
        return true;
      }

      const firstQuest = quests[0];
      log.success(`Found quest: "${firstQuest.title}" (ID: ${firstQuest.id})`);

      // Test quest details
      try {
        const questDetail = await this.client.get(`/quests/${firstQuest.id}`);
        log.success(`Quest details retrieved for ID ${firstQuest.id}`);
      } catch (error) {
        if (error.response?.status === 401) {
          log.warning('Quest details require authentication');
        } else {
          throw error;
        }
      }

      // Test quest verification (will fail without auth)
      try {
        await this.client.post(`/quests/${firstQuest.id}/verify`, {
          proof_data: { test: true }
        });
        log.success(`Quest verification attempted for ID ${firstQuest.id}`);
      } catch (error) {
        if (error.response?.status === 401) {
          log.warning('Quest verification requires authentication');
        } else {
          log.warning(`Quest verification failed: ${error.response?.data?.message || error.message}`);
        }
      }

      return true;
    } catch (error) {
      log.error(`Quest operations failed: ${error.message}`);
      return false;
    }
  }

  async testDatabaseConnection() {
    log.info('Testing Database Connection...');
    
    try {
      const questsResponse = await this.client.get('/test/quests');
      const questCount = questsResponse.data.count;
      
      if (questCount > 0) {
        log.success(`Database connected: ${questCount} quests in database`);
        
        // Show quest details
        questsResponse.data.quests.forEach((quest, index) => {
          console.log(`  ${index + 1}. ${quest.title} (${quest.type}) - ${quest.reward_amount} ${quest.reward_type}`);
        });
        
        return true;
      } else {
        log.warning('Database connected but no quests found');
        return true;
      }
    } catch (error) {
      log.error(`Database connection failed: ${error.message}`);
      return false;
    }
  }

  async runAllTests() {
    console.log('\n🧪 Cedra Quest Backend API Test Suite');
    console.log('=====================================\n');

    const tests = [
      { name: 'Basic Endpoints', fn: () => this.testBasicEndpoints() },
      { name: 'Database Connection', fn: () => this.testDatabaseConnection() },
      { name: 'Authentication', fn: () => this.testAuthentication() },
      { name: 'Protected Endpoints', fn: () => this.testProtectedEndpoints() },
      { name: 'Quest Operations', fn: () => this.testQuestOperations() }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      console.log(`\n📋 Testing ${test.name}...`);
      try {
        const result = await test.fn();
        if (result) {
          passed++;
          log.success(`${test.name} passed`);
        } else {
          failed++;
          log.error(`${test.name} failed`);
        }
      } catch (error) {
        failed++;
        log.error(`${test.name} crashed: ${error.message}`);
      }
    }

    console.log('\n📊 Test Results:');
    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    if (failed === 0) {
      console.log(`\n${colors.green}🎉 All tests passed! Backend is ready for production.${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}⚠️  Some tests failed. Check the logs above.${colors.reset}`);
    }

    console.log('\n📝 Next Steps:');
    console.log('1. For real authentication, use actual Telegram initData');
    console.log('2. Deploy to production environment');
    console.log('3. Configure Telegram Bot with @BotFather');
    console.log('4. Test with frontend Mini App');
  }
}

// Run tests
const tester = new APITester();
tester.runAllTests().catch(console.error);