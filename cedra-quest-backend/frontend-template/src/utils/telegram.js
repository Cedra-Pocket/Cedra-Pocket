// Telegram Web App SDK utilities

export const getTelegramInitData = () => {
  try {
    // Kiểm tra xem có trong Telegram Web App không
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Expand app để full screen
      tg.expand();
      
      // Lấy initData
      const initData = tg.initData;
      
      if (!initData) {
        console.warn('⚠️ Không có initData từ Telegram');
        return null;
      }
      
      console.log('📱 Telegram initData received');
      return initData;
    }
    
    // Fallback cho development/testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode - using mock initData');
      return 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22username%22%3A%22testuser%22%7D&auth_date=' + Math.floor(Date.now() / 1000) + '&hash=test_hash';
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting Telegram init data:', error);
    return null;
  }
};

export const getTelegramUser = () => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      
      if (user) {
        console.log('👤 Telegram user:', user);
        return user;
      }
    }
    
    // Fallback cho development
    if (process.env.NODE_ENV === 'development') {
      return {
        id: 123456789,
        first_name: 'Test',
        username: 'testuser',
        language_code: 'en'
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting Telegram user:', error);
    return null;
  }
};

export const getTelegramTheme = () => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      return window.Telegram.WebApp.themeParams;
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting Telegram theme:', error);
    return null;
  }
};

export const showTelegramAlert = (message) => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  } catch (error) {
    console.error('❌ Error showing alert:', error);
    alert(message);
  }
};

export const hapticFeedback = (type = 'light') => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      switch (type) {
        case 'light':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
          break;
        case 'medium':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          break;
        case 'heavy':
          window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
          break;
        case 'success':
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          break;
        case 'error':
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
          break;
        default:
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    }
  } catch (error) {
    console.error('❌ Error with haptic feedback:', error);
  }
};

// Initialize Telegram Web App
export const initTelegramApp = () => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Cấu hình app
      tg.ready();
      tg.expand();
      
      // Set header color
      tg.setHeaderColor('#2196F3');
      
      console.log('🚀 Telegram Web App initialized');
      return tg;
    }
    
    console.warn('⚠️ Not running in Telegram Web App');
    return null;
  } catch (error) {
    console.error('❌ Error initializing Telegram app:', error);
    return null;
  }
};