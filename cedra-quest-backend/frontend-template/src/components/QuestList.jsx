import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { hapticFeedback, showTelegramAlert } from '../utils/telegram';
import './QuestList.css';

const QuestList = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const data = await apiClient.getQuests();
      setQuests(data);
    } catch (error) {
      console.error('Failed to load quests:', error);
      showTelegramAlert('Không thể tải danh sách quest. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    hapticFeedback('light');
    await loadQuests(false);
  };

  const handleVerifyQuest = async (quest) => {
    try {
      hapticFeedback('light');
      
      // Nếu là social quest và có URL, mở trước
      if (quest.type === 'SOCIAL' && quest.config?.url) {
        const shouldProceed = confirm(
          `Bạn sẽ được chuyển đến ${quest.config.platform} để thực hiện nhiệm vụ. Sau khi hoàn thành, quay lại để verify.`
        );
        
        if (shouldProceed) {
          window.open(quest.config.url, '_blank');
          
          // Đợi user confirm đã thực hiện
          const confirmed = confirm('Bạn đã hoàn thành nhiệm vụ chưa? Nhấn OK để verify.');
          if (!confirmed) return;
        } else {
          return;
        }
      }

      const result = await apiClient.verifyQuest(quest.id);
      
      if (result.success) {
        hapticFeedback('success');
        showTelegramAlert(`🎉 ${result.message}`);
        
        // Reload quests để cập nhật status
        await loadQuests(false);
      } else {
        hapticFeedback('error');
        showTelegramAlert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Quest verification failed:', error);
      hapticFeedback('error');
      
      let errorMessage = 'Có lỗi xảy ra khi verify quest';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showTelegramAlert(errorMessage);
    }
  };

  const filteredQuests = quests.filter(quest => {
    if (filter === 'all') return true;
    if (filter === 'available') return quest.user_status === 'NOT_STARTED';
    if (filter === 'completed') return quest.user_status === 'COMPLETED';
    if (filter === 'pending') return quest.user_status === 'PENDING';
    return true;
  });

  if (loading) {
    return (
      <div className="quest-list-container">
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Đang tải danh sách quest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quest-list-container">
      <div className="quest-header">
        <div className="header-top">
          <h2>🎯 Danh sách Quest</h2>
          <button 
            onClick={handleRefresh} 
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            disabled={refreshing}
          >
            🔄
          </button>
        </div>
        
        <div className="quest-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Tất cả ({quests.length})
          </button>
          <button 
            className={filter === 'available' ? 'active' : ''}
            onClick={() => setFilter('available')}
          >
            Có thể làm ({quests.filter(q => q.user_status === 'NOT_STARTED').length})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Hoàn thành ({quests.filter(q => q.user_status === 'COMPLETED').length})
          </button>
        </div>
      </div>

      <div className="quest-list">
        {filteredQuests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Không có quest nào</h3>
            <p>
              {filter === 'all' 
                ? 'Chưa có quest nào được tạo.'
                : `Không có quest nào trong danh mục "${filter}".`
              }
            </p>
          </div>
        ) : (
          filteredQuests.map(quest => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              onVerify={() => handleVerifyQuest(quest)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const QuestCard = ({ quest, onVerify }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'COMPLETED':
        return { color: '#4CAF50', text: '✅ Hoàn thành', icon: '🎉' };
      case 'PENDING':
        return { color: '#FF9800', text: '⏳ Đang xử lý', icon: '⏳' };
      case 'FAILED':
        return { color: '#F44336', text: '❌ Thất bại', icon: '❌' };
      default:
        return { color: '#2196F3', text: '🎯 Có thể làm', icon: '🎯' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SOCIAL': return '📱';
      case 'ONCHAIN': return '⛓️';
      default: return '🎯';
    }
  };

  const statusInfo = getStatusInfo(quest.user_status);
  const canVerify = quest.user_status !== 'COMPLETED' && quest.user_status !== 'PENDING';

  return (
    <div className={`quest-card ${quest.user_status?.toLowerCase()}`}>
      <div className="quest-card-header">
        <div className="quest-title">
          <span className="quest-type-icon">{getTypeIcon(quest.type)}</span>
          <h3>{quest.title}</h3>
        </div>
        <div className="quest-status" style={{ color: statusInfo.color }}>
          {statusInfo.text}
        </div>
      </div>
      
      <p className="quest-description">{quest.description}</p>
      
      <div className="quest-details">
        <div className="quest-reward">
          <span className="reward-label">Phần thưởng:</span>
          <span className="reward-value">
            {quest.reward_amount} {quest.reward_type === 'POINT' ? 'điểm' : quest.reward_type}
          </span>
        </div>
        
        <div className="quest-category">
          <span className="category-label">Loại:</span>
          <span className="category-value">{quest.category || quest.type}</span>
        </div>
      </div>

      <div className="quest-actions">
        {quest.type === 'SOCIAL' && quest.config?.url && (
          <button 
            onClick={() => window.open(quest.config.url, '_blank')}
            className="btn-secondary"
          >
            📱 Thực hiện
          </button>
        )}
        
        {canVerify && (
          <button 
            onClick={onVerify}
            className="btn-primary"
          >
            ✅ Verify
          </button>
        )}
        
        {quest.user_status === 'COMPLETED' && (
          <div className="completed-badge">
            {statusInfo.icon} Đã hoàn thành
          </div>
        )}
      </div>
      
      {quest.user_completed_at && (
        <div className="completion-time">
          Hoàn thành: {new Date(quest.user_completed_at).toLocaleString('vi-VN')}
        </div>
      )}
    </div>
  );
};

export default QuestList;