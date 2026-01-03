/**
 * Telegram Service
 * Provides integration with Telegram Mini Apps SDK
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import type { TelegramUser } from '../models';

/**
 * Haptic feedback intensity types
 */
export type HapticFeedbackType = 'light' | 'medium' | 'heavy';

/**
 * Telegram service interface
 */
export interface ITelegramService {
  initialize(): Promise<void>;
  getUserData(): TelegramUser | null;
  triggerHapticFeedback(type: HapticFeedbackType): void;
  handleBackButton(callback: () => void): void;
  closeApp(): void;
  shareReferralLink(link: string): void;
  isAvailable(): boolean;
}

/**
 * Type definitions for Telegram WebApp API
 * These match the @telegram-apps/sdk types
 */
interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  ready: () => void;
  close: () => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  openTelegramLink: (url: string) => void;
  switchInlineQuery: (query: string, chatTypes?: string[]) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/**
 * Check if Telegram WebApp is available
 */
function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.Telegram?.WebApp ?? null;
}

/**
 * Telegram service implementation
 */
export class TelegramService implements ITelegramService {
  private webApp: TelegramWebApp | null = null;
  private initialized: boolean = false;
  private backButtonCallback: (() => void) | null = null;

  /**
   * Initialize the Telegram SDK
   * Requirements: 8.1
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.webApp = getTelegramWebApp();

    if (this.webApp) {
      // Signal to Telegram that the app is ready
      this.webApp.ready();
      this.initialized = true;
    } else {
      console.warn('TelegramService: Telegram WebApp not available, running in fallback mode');
      this.initialized = true;
    }
  }

  /**
   * Check if Telegram SDK is available
   * Requirements: 8.5
   */
  isAvailable(): boolean {
    return this.webApp !== null;
  }

  /**
   * Get user data from Telegram SDK
   * Requirements: 8.1
   * @returns TelegramUser or null if unavailable
   */
  getUserData(): TelegramUser | null {
    if (!this.webApp?.initDataUnsafe?.user) {
      return null;
    }

    const user = this.webApp.initDataUnsafe.user;
    
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      photoUrl: user.photo_url,
      languageCode: user.language_code,
    };
  }

  /**
   * Trigger haptic feedback
   * Requirements: 8.2
   * @param type - Feedback intensity
   */
  triggerHapticFeedback(type: HapticFeedbackType): void {
    if (!this.webApp?.HapticFeedback) {
      return;
    }

    try {
      this.webApp.HapticFeedback.impactOccurred(type);
    } catch (error) {
      console.warn('TelegramService: Failed to trigger haptic feedback', error);
    }
  }

  /**
   * Handle back button press
   * Requirements: 8.3
   * @param callback - Function to call when back button is pressed
   */
  handleBackButton(callback: () => void): void {
    if (!this.webApp?.BackButton) {
      return;
    }

    // Remove previous callback if exists
    if (this.backButtonCallback) {
      this.webApp.BackButton.offClick(this.backButtonCallback);
    }

    this.backButtonCallback = callback;
    this.webApp.BackButton.onClick(callback);
    this.webApp.BackButton.show();
  }

  /**
   * Hide the back button
   */
  hideBackButton(): void {
    if (!this.webApp?.BackButton) {
      return;
    }

    if (this.backButtonCallback) {
      this.webApp.BackButton.offClick(this.backButtonCallback);
      this.backButtonCallback = null;
    }
    this.webApp.BackButton.hide();
  }

  /**
   * Close the Mini App
   * Requirements: 8.4
   */
  closeApp(): void {
    if (!this.webApp) {
      return;
    }

    try {
      this.webApp.close();
    } catch (error) {
      console.warn('TelegramService: Failed to close app', error);
    }
  }

  /**
   * Share a referral link via Telegram
   * @param link - Referral link to share
   */
  shareReferralLink(link: string): void {
    if (!this.webApp) {
      // Fallback: open in new tab
      if (typeof window !== 'undefined') {
        window.open(link, '_blank');
      }
      return;
    }

    try {
      // Use switchInlineQuery to share the link
      const shareText = `Join me on this awesome game! ${link}`;
      this.webApp.switchInlineQuery(shareText, ['users', 'groups', 'channels']);
    } catch (error) {
      // Fallback to openTelegramLink
      try {
        const encodedText = encodeURIComponent(`Join me on this awesome game! ${link}`);
        this.webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodedText}`);
      } catch (fallbackError) {
        console.warn('TelegramService: Failed to share referral link', fallbackError);
      }
    }
  }

  /**
   * Trigger notification haptic feedback
   * @param type - Notification type
   */
  triggerNotification(type: 'error' | 'success' | 'warning'): void {
    if (!this.webApp?.HapticFeedback) {
      return;
    }

    try {
      this.webApp.HapticFeedback.notificationOccurred(type);
    } catch (error) {
      console.warn('TelegramService: Failed to trigger notification feedback', error);
    }
  }

  /**
   * Trigger selection changed haptic feedback
   */
  triggerSelectionChanged(): void {
    if (!this.webApp?.HapticFeedback) {
      return;
    }

    try {
      this.webApp.HapticFeedback.selectionChanged();
    } catch (error) {
      console.warn('TelegramService: Failed to trigger selection feedback', error);
    }
  }
}

// Default singleton instance
export const telegramService = new TelegramService();
