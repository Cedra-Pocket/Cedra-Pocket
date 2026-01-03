import * as fc from 'fast-check';
import type {
  UserData,
  TelegramUser,
  Quest,
  QuestReward,
  Reward,
  DailyRewardData,
  LeaderboardEntry,
  Card,
  Friend,
  ReferralStats,
  WalletState,
} from '../models';

// User Data Generators
export const userDataArb: fc.Arbitrary<UserData> = fc.record({
  id: fc.uuid(),
  telegramId: fc.string({ minLength: 5, maxLength: 15 }).filter((s) => /^\d+$/.test(s)),
  username: fc.string({ minLength: 1, maxLength: 32 }),
  avatarUrl: fc.option(fc.webUrl()),
  level: fc.integer({ min: 1, max: 100 }),
  currentXP: fc.integer({ min: 0, max: 100000 }),
  requiredXP: fc.integer({ min: 100, max: 100000 }),
  tokenBalance: fc.integer({ min: 0, max: 10000000 }),
  gemBalance: fc.integer({ min: 0, max: 1000000 }),
  earningRate: fc.integer({ min: 0, max: 10000 }),
  walletAddress: fc.option(
    fc.string({ minLength: 40, maxLength: 40 }).filter((s) => /^[0-9a-fA-F]+$/.test(s))
  ),
  lastDailyClaim: fc.option(fc.date()),
  createdAt: fc.date(),
  updatedAt: fc.date(),
});

export const telegramUserArb: fc.Arbitrary<TelegramUser> = fc.record({
  id: fc.integer({ min: 1, max: 999999999 }),
  firstName: fc.string({ minLength: 1, maxLength: 64 }),
  lastName: fc.option(fc.string({ minLength: 1, maxLength: 64 })),
  username: fc.option(fc.string({ minLength: 5, maxLength: 32 })),
  photoUrl: fc.option(fc.webUrl()),
  languageCode: fc.option(fc.constantFrom('en', 'ru', 'es', 'de', 'fr', 'zh')),
});

// Quest Generators
export const questRewardArb: fc.Arbitrary<QuestReward> = fc.record({
  type: fc.constantFrom('token' as const, 'gem' as const, 'nft' as const, 'xp' as const),
  amount: fc.integer({ min: 1, max: 10000 }),
  nftId: fc.option(fc.uuid()),
});

export const questArb: fc.Arbitrary<Quest> = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  iconUrl: fc.webUrl(),
  type: fc.constantFrom(
    'social' as const,
    'daily' as const,
    'achievement' as const,
    'referral' as const
  ),
  status: fc.constantFrom('active' as const, 'completed' as const, 'locked' as const),
  progress: fc.integer({ min: 0, max: 100 }),
  currentValue: fc.integer({ min: 0, max: 1000 }),
  targetValue: fc.integer({ min: 1, max: 1000 }),
  reward: questRewardArb,
  expiresAt: fc.option(fc.date()),
});

// Reward Generators
export const rewardArb: fc.Arbitrary<Reward> = fc.record({
  id: fc.uuid(),
  type: fc.constantFrom('token' as const, 'gem' as const, 'nft' as const),
  amount: fc.integer({ min: 1, max: 100000 }),
  source: fc.string({ minLength: 1, maxLength: 100 }),
  sourceId: fc.uuid(),
  claimed: fc.boolean(),
  claimedAt: fc.option(fc.date()),
  createdAt: fc.date(),
});

export const dailyRewardDataArb: fc.Arbitrary<DailyRewardData> = fc.record({
  id: fc.uuid(),
  day: fc.integer({ min: 1, max: 365 }),
  amount: fc.integer({ min: 1, max: 10000 }),
  claimed: fc.boolean(),
  nextClaimAt: fc.option(fc.date()),
});

// Leaderboard Generators
export const leaderboardEntryArb: fc.Arbitrary<LeaderboardEntry> = fc.record({
  userId: fc.uuid(),
  username: fc.string({ minLength: 1, maxLength: 32 }),
  avatarUrl: fc.option(fc.webUrl()),
  xp: fc.integer({ min: 0, max: 10000000 }),
  level: fc.integer({ min: 1, max: 100 }),
  rank: fc.integer({ min: 1, max: 1000 }),
});

// Card Generators
export const cardArb: fc.Arbitrary<Card> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  imageUrl: fc.webUrl(),
  category: fc.constantFrom('equipment' as const, 'mining' as const, 'infrastructure' as const),
  bonusRate: fc.integer({ min: 1, max: 1000 }),
  cost: fc.integer({ min: 10, max: 100000 }),
  level: fc.integer({ min: 1, max: 10 }),
  maxLevel: fc.integer({ min: 1, max: 10 }),
  upgradeCost: fc.integer({ min: 10, max: 100000 }),
  owned: fc.boolean(),
});

// Friend/Referral Generators
export const friendArb: fc.Arbitrary<Friend> = fc.record({
  id: fc.uuid(),
  username: fc.string({ minLength: 1, maxLength: 32 }),
  avatarUrl: fc.option(fc.webUrl()),
  joinedAt: fc.date(),
  contribution: fc.integer({ min: 0, max: 100000 }),
});

export const referralStatsArb: fc.Arbitrary<ReferralStats> = fc.record({
  totalReferrals: fc.integer({ min: 0, max: 10000 }),
  totalBonus: fc.integer({ min: 0, max: 1000000 }),
  referralLink: fc.webUrl(),
  friends: fc.array(friendArb, { minLength: 0, maxLength: 50 }),
});

// Wallet Generators
export const walletStateArb: fc.Arbitrary<WalletState> = fc.record({
  connected: fc.boolean(),
  address: fc.option(
    fc
      .string({ minLength: 40, maxLength: 40 })
      .filter((s) => /^[0-9a-fA-F]+$/.test(s))
      .map((s: string) => `0x${s}`)
  ),
  chainId: fc.option(fc.constantFrom(1, 56, 137, 42161)),
  connecting: fc.boolean(),
  error: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
});

// Navigation Generators
export const activeTabArb = fc.constantFrom(
  'earn' as const,
  'cards' as const,
  'home' as const,
  'shop' as const,
  'friends' as const
);

// Currency Generators
export const currencyArb = fc.constantFrom('coin' as const, 'gem' as const);
export const rewardTypeArb = fc.constantFrom('token' as const, 'gem' as const, 'nft' as const);
