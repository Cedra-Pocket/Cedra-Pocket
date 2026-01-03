/**
 * Reward-related data models
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5
 */

/**
 * Type of reward
 */
export type RewardType = 'token' | 'gem' | 'nft';

/**
 * A claimable reward earned from activities
 */
export interface Reward {
  id: string;
  type: RewardType;
  amount: number;
  source: string; // quest name or activity
  sourceId: string;
  claimed: boolean;
  claimedAt?: Date;
  createdAt: Date;
}

/**
 * Daily reward data with streak tracking
 */
export interface DailyRewardData {
  id: string;
  day: number; // streak day
  amount: number;
  claimed: boolean;
  nextClaimAt?: Date;
}

/**
 * Result of claiming a reward
 */
export interface ClaimResult {
  success: boolean;
  reward: Reward;
  newBalance: number;
}

/**
 * Result of claiming daily reward
 */
export interface DailyClaimResult {
  success: boolean;
  reward: DailyRewardData;
  newBalance: number;
  nextClaimAt: Date;
}
