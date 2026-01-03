import React, { useState, useEffect } from 'react';
import { getTelegramInitData, getTelegramUser } from '../utils/telegram';
import apiClient from '../api/client';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ Telegram
    const user = getTelegramUser();
    setTelegramUser(user);
    
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
        throw new Error('Không thể lấy dữ liệu từ Telegram. Vui lòng mở app trong Telegram.');
      }

      console.log('🔐 Đang xác thực với Telegram...');

      // Gửi lên backend để verify
      const response = await apiClient.authenticate(initData);
      
      // Lưu JWT token
      localStorage.setItem('jwt_token', response.access_token);
      
      console.log('✅ Xác thực thành công!');
      
      // Callback success
      onLoginSuccess(response.user);

    } catch (error) {
      console.error('❌ Login failed:', error);
      
      let errorMessage = 'Đăng nhập thất bại';
      
      if (error.response?.status === 401) {
        errorMessage = 'Xác thực Telegram không hợp lệ';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Không thể kết nối đến server';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🎮 Cedra Quest</h1>
            <p>Hoàn thành nhiệm vụ, nhận phần thưởng</p>
          </div>
          
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Đang xác thực với Telegram...</p>
            {telegramUser && (
              <div className="user-preview">
                <p>👋 Xin chào, {telegramUser.first_name}!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🎮 Cedra Quest</h1>
          </div>
          
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h3>Lỗi xác thực</h3>
            <p>{error}</p>
            
            <div className="error-actions">
              <button onClick={handleLogin} className="retry-btn">
                🔄 Thử lại
              </button>
            </div>
            
            <div className="help-section">
              <h4>💡 Gợi ý:</h4>
              <ul>
                <li>Đảm bảo mở app trong Telegram</li>
                <li>Kiểm tra kết nối internet</li>
                <li>Thử đóng và mở lại app</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎮 Cedra Quest</h1>
          <p>Đang khởi tạo...</p>
        </div>
      </div>
    </div>
  );
};

export default Login;