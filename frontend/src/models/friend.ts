/**
 * Friend/Referral-related data models
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

/**
 * A referred friend
 */
export interface Friend {
  id: string;
  username: string;
  avatarUrl?: string;
  joinedAt: Date;
  contribution: number; // bonus earned from this referral
}

/**
 * Referral statistics and friend list
 */
export interface ReferralStats {
  totalReferrals: number;
  totalBonus: number;
  referralLink: string;
  friends: Friend[];
}
