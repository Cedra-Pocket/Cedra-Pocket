/**
 * User-related data models
 * Requirements: 1.2, 1.3, 1.4, 6.1, 6.2, 8.1
 */

/**
 * Core user data stored in the application
 */
export interface UserData {
  id: string;
  telegramId: string;
  username: string;
  avatarUrl?: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  tokenBalance: number;
  gemBalance: number;
  earningRate: number; // tokens per hour
  walletAddress?: string;
  lastDailyClaim?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User data retrieved from Telegram SDK
 */
export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
}

/**
 * Extended user profile with statistics
 */
export interface UserProfile extends UserData {
  totalQuests: number;
  completedQuests: number;
  totalReferrals: number;
  referralBonus: number;
}
