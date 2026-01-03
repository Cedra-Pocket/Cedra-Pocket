# 🔗 Frontend Integration Guide

## 1. Frontend Setup (Telegram Mini App)

### Cài đặt dependencies:
```bash
npm install @telegram-apps/sdk axios
```

### Cấu hình Telegram SDK:
```javascript
// src/utils/telegram.js
import { initData, initDataUnsafe } from '@telegram-apps/sdk';

export const getTelegramInitData = () => {
  try {
    // Lấy initData từ Telegram
    const data = initData.raw();
    return data;
  } catch (error) {
    console.error('Failed to get Telegram init data:', error);
    return null;
  }
};

export const getTelegramUser = () => {
  try {
    return initDataUnsafe.user;
  } catch (error) {
    console.error('Failed to get Telegram user:', error);
    return null;
  }
};
```

### API Client setup:
```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999'; // Thay bằng production URL

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor để tự động thêm JWT token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor để handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('jwt_token');
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async authenticate(initData) {
    const response = await this.client.post('/auth/verify', {
      initData: initData
    });
    return response.data;
  }

  // User methods
  async getUserProfile() {
    const response = await this.client.get('/users/profile');
    return response.data;
  }

  async connectWallet(walletAddress) {
    const response = await this.client.post('/users/connect-wallet', {
      wallet_address: walletAddress
    });
    return response.data;
  }

  // Quest methods
  async getQuests() {
    const response = await this.client.get('/quests');
    return response.data;
  }

  async verifyQuest(questId, proofData = {}) {
    const response = await this.client.post(`/quests/${questId}/verify`, {
      proof_data: proofData
    });
    return response.data;
  }
}

export default new ApiClient();
```

## 2. Authentication Flow

### Login Component:
```javascript
// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { getTelegramInitData, getTelegramUser } from '../utils/telegram';
import apiClient from '../api/client';

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auto-login khi component mount
    handleLogin();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy initData từ Telegram
      const initData = getTelegramInitData();
      if (!initData) {
        throw new Error('Không thể lấy dữ liệu từ Telegram');
      }

      // Gửi lên backend để verify
      const response = await apiClient.authenticate(initData);
      
      // Lưu JWT token
      localStorage.setItem('jwt_token', response.access_token);
      
      // Callback success
      onLoginSuccess(response.user);

    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang đăng nhập...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Lỗi: {error}</p>
        <button onClick={handleLogin}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="login">
      <h2>Cedra Quest</h2>
      <p>Đang xác thực với Telegram...</p>
    </div>
  );
};

export default Login;
```

## 3. Quest Management

### Quest List Component:
```javascript
// src/components/QuestList.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

const QuestList = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      const data = await apiClient.getQuests();
      setQuests(data);
    } catch (error) {
      console.error('Failed to load quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyQuest = async (questId) => {
    try {
      const result = await apiClient.verifyQuest(questId);
      
      if (result.success) {
        // Reload quests để cập nhật status
        await loadQuests();
        alert('Quest hoàn thành thành công!');
      } else {
        alert(result.message || 'Verification thất bại');
      }
    } catch (error) {
      console.error('Quest verification failed:', error);
      alert('Có lỗi xảy ra khi verify quest');
    }
  };

  if (loading) {
    return <div className="loading">Đang tải quests...</div>;
  }

  return (
    <div className="quest-list">
      <h2>Danh sách Quest</h2>
      {quests.map(quest => (
        <QuestCard 
          key={quest.id} 
          quest={quest} 
          onVerify={() => handleVerifyQuest(quest.id)}
        />
      ))}
    </div>
  );
};

const QuestCard = ({ quest, onVerify }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      case 'FAILED': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'PENDING': return 'Đang xử lý';
      case 'FAILED': return 'Thất bại';
      default: return 'Chưa bắt đầu';
    }
  };

  return (
    <div className="quest-card">
      <div className="quest-header">
        <h3>{quest.title}</h3>
        <span 
          className="quest-status"
          style={{ color: getStatusColor(quest.user_status) }}
        >
          {getStatusText(quest.user_status)}
        </span>
      </div>
      
      <p className="quest-description">{quest.description}</p>
      
      <div className="quest-reward">
        <span>Phần thưởng: {quest.reward_amount} {quest.reward_type}</span>
      </div>

      <div className="quest-actions">
        {quest.type === 'SOCIAL' && quest.config?.url && (
          <button 
            onClick={() => window.open(quest.config.url, '_blank')}
            className="btn-secondary"
          >
            Thực hiện
          </button>
        )}
        
        {quest.user_status !== 'COMPLETED' && (
          <button 
            onClick={onVerify}
            className="btn-primary"
            disabled={quest.user_status === 'PENDING'}
          >
            {quest.user_status === 'PENDING' ? 'Đang xử lý...' : 'Verify'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestList;
```

## 4. Main App Component

```javascript
// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import QuestList from './components/QuestList';
import UserProfile from './components/UserProfile';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('quests');

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Load user profile
      loadUserProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await apiClient.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('jwt_token');
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cedra Quest</h1>
        <div className="user-info">
          <span>👋 {user.username || 'User'}</span>
          <span>🏆 {user.total_points} điểm</span>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={currentTab === 'quests' ? 'active' : ''}
          onClick={() => setCurrentTab('quests')}
        >
          Quests
        </button>
        <button 
          className={currentTab === 'profile' ? 'active' : ''}
          onClick={() => setCurrentTab('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="app-main">
        {currentTab === 'quests' && <QuestList />}
        {currentTab === 'profile' && <UserProfile user={user} />}
      </main>
    </div>
  );
};

export default App;
```

## 5. CSS Styling

```css
/* src/App.css */
.app {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
}

.app-nav {
  display: flex;
  margin-bottom: 20px;
}

.app-nav button {
  flex: 1;
  padding: 10px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
}

.app-nav button.active {
  background: #2196F3;
  color: white;
}

.quest-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: white;
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.quest-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-primary {
  background: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 50px;
}

.error {
  text-align: center;
  padding: 20px;
  color: #F44336;
}
```

## 6. Telegram Bot Setup

### Tạo bot và cấu hình:
1. Tạo bot với @BotFather
2. Lấy bot token
3. Setup Mini App URL
4. Cấu hình domain whitelist

### Bot commands:
```
/start - Khởi động Mini App
/help - Hướng dẫn sử dụng
```

## 7. Deployment

### Frontend (Vercel/Netlify):
```bash
npm run build
# Deploy dist folder
```

### Backend (Railway/Heroku):
```bash
# Set environment variables
# Deploy backend
```

### CORS Configuration:
Đảm bảo backend cho phép frontend domain trong CORS settings.