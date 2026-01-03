'use client';

import { useEffect, useCallback } from 'react';
import { useAppStore, useQuests, useQuestsLoading } from '../../store/useAppStore';
import { QuestCard } from './QuestCard';
import { apiService } from '../../services/api.service';
import { telegramService } from '../../services/telegram.service';
import { LoadingSpinner } from '../shared/LoadingSpinner';

/**
 * QuestScreen component
 * Split into Daily Login and Tasks sections
 */
export function QuestScreen() {
  const quests = useQuests();
  const questsLoading = useQuestsLoading();
  const { setQuests, setQuestsLoading, updateQuest, updateBalance, addXP } = useAppStore();

  // Filter quests by type
  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const taskQuests = quests.filter((q) => q.type !== 'daily');

  // Calculate total progress
  const totalProgress = quests.length > 0 
    ? Math.round(quests.reduce((sum, q) => sum + q.progress, 0) / quests.length)
    : 0;
  const completedCount = quests.filter(q => q.progress === 100).length;

  // Load quests on mount - always reload to get latest data
  useEffect(() => {
    const loadQuests = async () => {
      setQuestsLoading(true);
      try {
        const fetchedQuests = await apiService.getQuests();
        setQuests(fetchedQuests);
      } catch (error) {
        console.error('Failed to load quests:', error);
      } finally {
        setQuestsLoading(false);
      }
    };

    loadQuests();
  }, []);

  // Handle quest selection/action
  const handleQuestSelect = useCallback(async (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    telegramService.triggerHapticFeedback('light');

    if (quest.status === 'completed') {
      try {
        const result = await apiService.completeQuest(questId);
        if (result.success && result.earnedReward) {
          if (result.earnedReward.type === 'token') {
            updateBalance(result.earnedReward.amount, 'token');
          } else if (result.earnedReward.type === 'gem') {
            updateBalance(result.earnedReward.amount, 'gem');
          } else if (result.earnedReward.type === 'xp') {
            addXP(result.earnedReward.amount);
          }
          updateQuest(questId, { status: 'completed', progress: 100 });
          telegramService.triggerHapticFeedback('medium');
        }
      } catch (error) {
        console.error('Failed to claim quest reward:', error);
        telegramService.triggerHapticFeedback('heavy');
      }
    } else if (quest.status === 'active') {
      try {
        const result = await apiService.completeQuest(questId);
        if (result.success) {
          updateQuest(questId, result.quest);
          telegramService.triggerHapticFeedback('medium');
        }
      } catch (error) {
        console.error('Failed to complete quest:', error);
      }
    }
  }, [quests, updateQuest, updateBalance, addXP]);

  if (questsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col hide-scrollbar" 
      style={{ 
        paddingTop: '50px', 
        backgroundColor: 'transparent',
        height: 'calc(100vh - 80px)',
        overflowY: 'auto',
        paddingBottom: '20px'
      }}
    >
      {/* Header */}
      <header className="mb-8 px-6 text-center flex-shrink-0">
        <div className="flex justify-center mb-3">
          <img 
            src="/icons/quest.png" 
            alt="Quest" 
            className="w-20 h-20 object-contain drop-shadow-lg animate-float-medium"
          />
        </div>
        <h1 style={{ color: '#1a1a2e' }} className="text-3xl font-extrabold drop-shadow-[0_0_15px_rgba(0,0,0,0.1)]">
          Quests
        </h1>

        {/* Total Progress Bar */}
        <div style={{ marginTop: '16px', marginBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.1)' }} className="w-full h-8 rounded-full overflow-hidden relative">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${totalProgress}%`,
                background: 'linear-gradient(90deg, #FFD700, #FFA500)'
              }}
            />
            <span style={{ color: '#1a1a2e' }} className="absolute inset-0 flex items-center justify-center text-sm font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              {completedCount}/{quests.length} completed
            </span>
          </div>
        </div>
      </header>

      {/* Daily Login Section - No title */}
      <section style={{ marginBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }} className="flex-shrink-0">
        <div className="flex flex-col gap-3">
          {dailyQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onAction={() => handleQuestSelect(quest.id)}
            />
          ))}
        </div>
      </section>

      {/* Tasks Section */}
      <section style={{ paddingLeft: '24px', paddingRight: '24px' }} className="flex-shrink-0">
        <h2 style={{ color: '#1a1a2e', marginBottom: '16px' }} className="text-xl font-extrabold flex items-center gap-2">
          ⚡ Tasks
        </h2>
        <div className="flex flex-col gap-3">
          {taskQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onAction={() => handleQuestSelect(quest.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default QuestScreen;
