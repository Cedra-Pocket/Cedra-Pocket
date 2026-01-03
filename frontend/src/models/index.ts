/**
 * Data Models Index
 * Central export for all TypeScript interfaces and types
 */

// User models
export type { UserData, TelegramUser, UserProfile } from './user';

// Quest models
export type {
  Quest,
  QuestReward,
  QuestResult,
  QuestType,
  QuestStatus,
  QuestRewardType,
} from './quest';

// Reward models
export type {
  Reward,
  DailyRewardData,
  ClaimResult,
  DailyClaimResult,
  RewardType,
} from './reward';

// Leaderboard models
export type { LeaderboardEntry, LeaderboardResponse } from './leaderboard';

// Card models
export type { Card, PurchaseResult, CardCategory } from './card';

// Friend/Referral models
export type { Friend, ReferralStats } from './friend';

// Wallet models
export type { WalletState } from './wallet';
