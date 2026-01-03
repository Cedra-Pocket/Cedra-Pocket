import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import QuestList from './components/QuestList';
import UserProfile from './components/UserProfile';
import apiClient from './api/client';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('quests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        const userData = await apiClient.getUserProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('jwt_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎮 Cedra Quest</h1>
          <div className="user-info">
            <div className="user-stats">
              <span className="username">👋 {user.username || 'User'}</span>
              <span className="points">🏆 {user.total_points || 0} điểm</span>
              <span className="rank">🎖️ {user.current_rank || 'BRONZE'}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${currentTab === 'quests' ? 'active' : ''}`}
          onClick={() => setCurrentTab('quests')}
        >
          🎯 Quests
        </button>
        <button 
          className={`nav-btn ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentTab('profile')}
        >
          👤 Profile
        </button>
      </nav>

      <main className="app-main">
        {currentTab === 'quests' && <QuestList />}
        {currentTab === 'profile' && <UserProfile user={user} onUserUpdate={setUser} />}
      </main>
    </div>
  );
};

export default App;