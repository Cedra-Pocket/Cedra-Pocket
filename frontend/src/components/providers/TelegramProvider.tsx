'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { telegramService } from '../../services/telegram.service';
import { useAppStore } from '../../store/useAppStore';
import type { TelegramUser } from '../../models';

/**
 * Telegram context value interface
 */
interface TelegramContextValue {
  isInitialized: boolean;
  isAvailable: boolean;
  user: TelegramUser | null;
  triggerHapticFeedback: (type: 'light' | 'medium' | 'heavy') => void;
  closeApp: () => void;
  shareReferralLink: (link: string) => void;
}

/**
 * Telegram context
 */
const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * TelegramProvider props
 */
interface TelegramProviderProps {
  children: ReactNode;
}

/**
 * TelegramProvider component
 * Requirements: 8.1, 8.3, 8.4
 * - 8.1: Retrieve user data from Telegram SDK on initialization
 * - 8.3: Handle navigation using Telegram's back button API
 * - 8.4: Use Telegram SDK's close method when requested
 */
export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const { setUser, activeTab, setActiveTab } = useAppStore();

  // Initialize Telegram SDK
  useEffect(() => {
    const initialize = async () => {
      try {
        await telegramService.initialize();
        
        // Get user data from Telegram SDK
        const user = telegramService.getUserData();
        setTelegramUser(user);

        // If we have Telegram user data, create/update app user
        if (user) {
          const appUser = {
            id: `user_${user.id}`,
            telegramId: String(user.id),
            username: user.username || user.firstName,
            avatarUrl: user.photoUrl,
            level: 1,
            currentXP: 0,
            requiredXP: 1000,
            tokenBalance: 0,
            gemBalance: 0,
            earningRate: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUser(appUser);
        }
      } catch (error) {
        console.error('Failed to initialize Telegram SDK:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [setUser]);

  // Set up back button handler
  // Requirements: 8.3 - Handle navigation using Telegram's back button API
  useEffect(() => {
    if (!isInitialized) return;

    const handleBackButton = () => {
      // Get current tab from store
      const currentTab = useAppStore.getState().activeTab;
      // If not on home tab, navigate to home
      if (currentTab !== 'home') {
        setActiveTab('home');
        window.history.replaceState(null, '', '#home');
      } else {
        // If on home, close the app
        telegramService.closeApp();
      }
    };

    telegramService.handleBackButton(handleBackButton);

    return () => {
      telegramService.hideBackButton();
    };
  }, [isInitialized, setActiveTab]);

  // Memoized context value
  const contextValue: TelegramContextValue = {
    isInitialized,
    isAvailable: telegramService.isAvailable(),
    user: telegramUser,
    triggerHapticFeedback: useCallback((type: 'light' | 'medium' | 'heavy') => {
      telegramService.triggerHapticFeedback(type);
    }, []),
    closeApp: useCallback(() => {
      telegramService.closeApp();
    }, []),
    shareReferralLink: useCallback((link: string) => {
      telegramService.shareReferralLink(link);
    }, []),
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
}

/**
 * Hook to access Telegram context
 */
export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}

export default TelegramProvider;
