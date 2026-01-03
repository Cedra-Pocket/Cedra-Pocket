import axios from 'axios';

// Thay đổi URL này thành backend URL của bạn
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Request interceptor để thêm JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired hoặc invalid
          localStorage.removeItem('jwt_token');
          window.location.reload();
        }
        
        // Log error for debugging
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });
        
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async authenticate(initData) {
    return await this.client.post('/auth/verify', {
      initData: initData
    });
  }

  // User methods
  async getUserProfile() {
    return await this.client.get('/users/profile');
  }

  async connectWallet(walletAddress) {
    return await this.client.post('/users/connect-wallet', {
      wallet_address: walletAddress
    });
  }

  // Quest methods
  async getQuests() {
    return await this.client.get('/quests');
  }

  async getQuest(questId) {
    return await this.client.get(`/quests/${questId}`);
  }

  async verifyQuest(questId, proofData = {}) {
    return await this.client.post(`/quests/${questId}/verify`, {
      proof_data: proofData
    });
  }

  // Test methods (for development)
  async getTestQuests() {
    return await this.client.get('/test/quests');
  }

  async getTestAuth() {
    return await this.client.get('/test/auth');
  }

  async healthCheck() {
    return await this.client.get('/health');
  }
}

export default new ApiClient();