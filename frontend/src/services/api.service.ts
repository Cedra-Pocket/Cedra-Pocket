/**
 * API Service
 * Provides stub/mock implementations for all API calls
 * Requirements: All API-related requirements
 */

import type {
  UserData,
  Quest,
  QuestResult,
  Reward,
  ClaimResult,
  DailyRewardData,
  DailyClaimResult,
  LeaderboardResponse,
  Card,
  PurchaseResult,
  ReferralStats,
} from '../models';

/**
 * API service interface
 */
export interface IAPIService {
  // User endpoints
  getUser(telegramId: string): Promise<UserData>;
  updateUser(data: Partial<UserData>): Promise<UserData>;
  
  // Quest endpoints
  getQuests(): Promise<Quest[]>;
  completeQuest(questId: string): Promise<QuestResult>;
  
  // Reward endpoints
  getRewards(): Promise<Reward[]>;
  claimReward(rewardId: string): Promise<ClaimResult>;
  getDailyReward(): Promise<DailyRewardData>;
  claimDailyReward(): Promise<DailyClaimResult>;
  
  // Leaderboard endpoints
  getLeaderboard(page: number, limit: number): Promise<LeaderboardResponse>;
  
  // Card endpoints
  getCards(): Promise<Card[]>;
  purchaseCard(cardId: string): Promise<PurchaseResult>;
  upgradeCard(cardId: string): Promise<PurchaseResult>;
  
  // Referral endpoints
  getReferralStats(): Promise<ReferralStats>;
}

/**
 * API error class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random UUID
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * API Service stub implementation
 * Returns mock data for development and testing
 */
export class APIService implements IAPIService {
  private mockUser: UserData | null = null;
  private mockQuests: Quest[] = [];
  private mockRewards: Reward[] = [];
  private mockCards: Card[] = [];
  private mockDailyReward: DailyRewardData | null = null;

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data
   */
  private initializeMockData(): void {
    // Initialize mock quests
    this.mockQuests = [
      {
        id: generateId(),
        title: 'Follow on Twitter',
        description: 'Follow our official Twitter account',
        iconUrl: '', // Will use emoji fallback
        type: 'social',
        status: 'active',
        progress: 0,
        currentValue: 0,
        targetValue: 1,
        reward: { type: 'token', amount: 100 },
      },
      {
        id: generateId(),
        title: 'Daily Login',
        description: 'Log in to the app today',
        iconUrl: '', // Will use emoji fallback
        type: 'daily',
        status: 'completed',
        progress: 100,
        currentValue: 1,
        targetValue: 1,
        reward: { type: 'token', amount: 50 },
      },
      {
        id: generateId(),
        title: 'Invite 5 Friends',
        description: 'Invite 5 friends to join the game',
        iconUrl: '', // Will use emoji fallback
        type: 'referral',
        status: 'active',
        progress: 40,
        currentValue: 2,
        targetValue: 5,
        reward: { type: 'gem', amount: 10 },
      },
      {
        id: generateId(),
        title: 'First Purchase',
        description: 'Buy your first card from the shop',
        iconUrl: '', // Will use emoji fallback
        type: 'achievement',
        status: 'locked',
        progress: 0,
        currentValue: 0,
        targetValue: 1,
        reward: { type: 'xp', amount: 500 },
      },
      {
        id: generateId(),
        title: 'Join Telegram Group',
        description: 'Join our official Telegram community',
        iconUrl: '',
        type: 'social',
        status: 'active',
        progress: 0,
        currentValue: 0,
        targetValue: 1,
        reward: { type: 'token', amount: 150 },
      },
      {
        id: generateId(),
        title: 'Complete 10 Spins',
        description: 'Spin the wheel 10 times',
        iconUrl: '',
        type: 'achievement',
        status: 'active',
        progress: 30,
        currentValue: 3,
        targetValue: 10,
        reward: { type: 'token', amount: 200 },
      },
      {
        id: generateId(),
        title: 'Play 5 Games',
        description: 'Play any 5 games in Game Center',
        iconUrl: '',
        type: 'achievement',
        status: 'active',
        progress: 20,
        currentValue: 1,
        targetValue: 5,
        reward: { type: 'gem', amount: 5 },
      },
      {
        id: generateId(),
        title: 'Share on Facebook',
        description: 'Share the app on Facebook',
        iconUrl: '',
        type: 'social',
        status: 'active',
        progress: 0,
        currentValue: 0,
        targetValue: 1,
        reward: { type: 'token', amount: 80 },
      },
      {
        id: generateId(),
        title: 'Reach Level 5',
        description: 'Level up your account to level 5',
        iconUrl: '',
        type: 'achievement',
        status: 'active',
        progress: 60,
        currentValue: 3,
        targetValue: 5,
        reward: { type: 'xp', amount: 1000 },
      },
      {
        id: generateId(),
        title: 'Collect 1000 Coins',
        description: 'Accumulate 1000 coins total',
        iconUrl: '',
        type: 'achievement',
        status: 'active',
        progress: 45,
        currentValue: 450,
        targetValue: 1000,
        reward: { type: 'token', amount: 300 },
      },
      {
        id: generateId(),
        title: 'Subscribe YouTube',
        description: 'Subscribe to our YouTube channel',
        iconUrl: '',
        type: 'social',
        status: 'active',
        progress: 0,
        currentValue: 0,
        targetValue: 1,
        reward: { type: 'token', amount: 120 },
      },
      {
        id: generateId(),
        title: 'Win 3 Games',
        description: 'Win 3 games in Game Center',
        iconUrl: '',
        type: 'achievement',
        status: 'locked',
        progress: 0,
        currentValue: 0,
        targetValue: 3,
        reward: { type: 'gem', amount: 15 },
      },
      {
        id: generateId(),
        title: 'Invite 10 Friends',
        description: 'Invite 10 friends to join',
        iconUrl: '',
        type: 'referral',
        status: 'active',
        progress: 20,
        currentValue: 2,
        targetValue: 10,
        reward: { type: 'gem', amount: 25 },
      },
    ];

    // Initialize mock cards
    this.mockCards = [
      {
        id: generateId(),
        name: 'Basic Pickaxe',
        description: 'A simple mining tool',
        imageUrl: '', // Will use emoji fallback
        category: 'equipment',
        bonusRate: 10,
        cost: 100,
        level: 1,
        maxLevel: 5,
        upgradeCost: 200,
        owned: false,
      },
      {
        id: generateId(),
        name: 'Iron Sword',
        description: 'A sturdy weapon for battles',
        imageUrl: '', // Will use emoji fallback
        category: 'equipment',
        bonusRate: 15,
        cost: 150,
        level: 1,
        maxLevel: 5,
        upgradeCost: 300,
        owned: false,
      },
      {
        id: generateId(),
        name: 'Mining Rig',
        description: 'Automated mining equipment',
        imageUrl: '', // Will use emoji fallback
        category: 'mining',
        bonusRate: 50,
        cost: 500,
        level: 1,
        maxLevel: 10,
        upgradeCost: 750,
        owned: false,
      },
      {
        id: generateId(),
        name: 'Gold Drill',
        description: 'Extracts gold efficiently',
        imageUrl: '', // Will use emoji fallback
        category: 'mining',
        bonusRate: 75,
        cost: 800,
        level: 1,
        maxLevel: 10,
        upgradeCost: 1200,
        owned: false,
      },
      {
        id: generateId(),
        name: 'Power Plant',
        description: 'Generates power for operations',
        imageUrl: '', // Will use emoji fallback
        category: 'infrastructure',
        bonusRate: 100,
        cost: 1000,
        level: 1,
        maxLevel: 10,
        upgradeCost: 1500,
        owned: false,
      },
      {
        id: generateId(),
        name: 'Factory',
        description: 'Produces resources automatically',
        imageUrl: '', // Will use emoji fallback
        category: 'infrastructure',
        bonusRate: 150,
        cost: 2000,
        level: 1,
        maxLevel: 10,
        upgradeCost: 3000,
        owned: false,
      },
    ];

    // Initialize mock daily reward
    this.mockDailyReward = {
      id: generateId(),
      day: 1,
      amount: 100,
      claimed: false,
    };
  }

  /**
   * Get user data
   */
  async getUser(telegramId: string): Promise<UserData> {
    await delay(100);

    if (!this.mockUser) {
      this.mockUser = {
        id: generateId(),
        telegramId,
        username: 'Player',
        level: 1,
        currentXP: 0,
        requiredXP: 100,
        tokenBalance: 1000,
        gemBalance: 10,
        earningRate: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return { ...this.mockUser };
  }

  /**
   * Update user data
   */
  async updateUser(data: Partial<UserData>): Promise<UserData> {
    await delay(100);

    if (!this.mockUser) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    this.mockUser = {
      ...this.mockUser,
      ...data,
      updatedAt: new Date(),
    };

    return { ...this.mockUser };
  }

  /**
   * Get all quests
   */
  async getQuests(): Promise<Quest[]> {
    await delay(100);
    return [...this.mockQuests];
  }

  /**
   * Complete a quest
   */
  async completeQuest(questId: string): Promise<QuestResult> {
    await delay(100);

    const questIndex = this.mockQuests.findIndex((q) => q.id === questId);
    if (questIndex === -1) {
      throw new APIError('Quest not found', 404, 'QUEST_NOT_FOUND');
    }

    const quest = this.mockQuests[questIndex];
    if (quest.status === 'completed') {
      return { success: false, quest };
    }

    // Update quest status
    this.mockQuests[questIndex] = {
      ...quest,
      status: 'completed',
      progress: 100,
      currentValue: quest.targetValue,
    };

    // Add reward to pending rewards
    this.mockRewards.push({
      id: generateId(),
      type: quest.reward.type === 'xp' ? 'token' : quest.reward.type,
      amount: quest.reward.amount,
      source: quest.title,
      sourceId: quest.id,
      claimed: false,
      createdAt: new Date(),
    });

    return {
      success: true,
      quest: this.mockQuests[questIndex],
      earnedReward: quest.reward,
    };
  }

  /**
   * Get all rewards
   */
  async getRewards(): Promise<Reward[]> {
    await delay(100);
    return [...this.mockRewards];
  }

  /**
   * Claim a reward
   */
  async claimReward(rewardId: string): Promise<ClaimResult> {
    await delay(100);

    const rewardIndex = this.mockRewards.findIndex((r) => r.id === rewardId);
    if (rewardIndex === -1) {
      throw new APIError('Reward not found', 404, 'REWARD_NOT_FOUND');
    }

    const reward = this.mockRewards[rewardIndex];
    if (reward.claimed) {
      throw new APIError('Reward already claimed', 400, 'ALREADY_CLAIMED');
    }

    // Mark as claimed
    this.mockRewards[rewardIndex] = {
      ...reward,
      claimed: true,
      claimedAt: new Date(),
    };

    // Update user balance
    if (this.mockUser) {
      if (reward.type === 'token') {
        this.mockUser.tokenBalance += reward.amount;
      } else if (reward.type === 'gem') {
        this.mockUser.gemBalance += reward.amount;
      }
    }

    return {
      success: true,
      reward: this.mockRewards[rewardIndex],
      newBalance: this.mockUser?.tokenBalance ?? 0,
    };
  }

  /**
   * Get daily reward status
   */
  async getDailyReward(): Promise<DailyRewardData> {
    await delay(100);

    if (!this.mockDailyReward) {
      this.mockDailyReward = {
        id: generateId(),
        day: 1,
        amount: 100,
        claimed: false,
      };
    }

    return { ...this.mockDailyReward };
  }

  /**
   * Claim daily reward
   */
  async claimDailyReward(): Promise<DailyClaimResult> {
    await delay(100);

    if (!this.mockDailyReward) {
      throw new APIError('Daily reward not available', 404, 'NOT_FOUND');
    }

    if (this.mockDailyReward.claimed) {
      throw new APIError('Daily reward already claimed', 400, 'ALREADY_CLAIMED');
    }

    const amount = this.mockDailyReward.amount;
    const nextClaimAt = new Date();
    nextClaimAt.setHours(nextClaimAt.getHours() + 24);

    // Update daily reward
    this.mockDailyReward = {
      ...this.mockDailyReward,
      claimed: true,
      nextClaimAt,
    };

    // Update user balance
    if (this.mockUser) {
      this.mockUser.tokenBalance += amount;
    }

    return {
      success: true,
      reward: { ...this.mockDailyReward },
      newBalance: this.mockUser?.tokenBalance ?? amount,
      nextClaimAt,
    };
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(page: number, limit: number): Promise<LeaderboardResponse> {
    await delay(100);

    // Generate mock leaderboard entries
    const totalCount = 100;
    const startIndex = (page - 1) * limit;
    const entries = [];

    for (let i = 0; i < limit && startIndex + i < totalCount; i++) {
      const rank = startIndex + i + 1;
      entries.push({
        userId: generateId(),
        username: `Player${rank}`,
        xp: Math.max(0, 10000 - rank * 100 + Math.floor(Math.random() * 50)),
        level: Math.max(1, Math.floor((10000 - rank * 100) / 1000)),
        rank,
      });
    }

    return {
      entries,
      totalCount,
      currentUserRank: this.mockUser ? 42 : undefined,
      hasMore: startIndex + limit < totalCount,
    };
  }

  /**
   * Get all cards
   */
  async getCards(): Promise<Card[]> {
    await delay(100);
    return [...this.mockCards];
  }

  /**
   * Purchase a card
   */
  async purchaseCard(cardId: string): Promise<PurchaseResult> {
    await delay(100);

    const cardIndex = this.mockCards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      throw new APIError('Card not found', 404, 'CARD_NOT_FOUND');
    }

    const card = this.mockCards[cardIndex];
    if (card.owned) {
      throw new APIError('Card already owned', 400, 'ALREADY_OWNED');
    }

    if (!this.mockUser || this.mockUser.tokenBalance < card.cost) {
      throw new APIError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
    }

    // Deduct cost and add bonus
    this.mockUser.tokenBalance -= card.cost;
    this.mockUser.earningRate += card.bonusRate;

    // Mark card as owned
    this.mockCards[cardIndex] = { ...card, owned: true };

    return {
      success: true,
      card: this.mockCards[cardIndex],
      newBalance: this.mockUser.tokenBalance,
      newEarningRate: this.mockUser.earningRate,
    };
  }

  /**
   * Upgrade a card
   */
  async upgradeCard(cardId: string): Promise<PurchaseResult> {
    await delay(100);

    const cardIndex = this.mockCards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      throw new APIError('Card not found', 404, 'CARD_NOT_FOUND');
    }

    const card = this.mockCards[cardIndex];
    if (!card.owned) {
      throw new APIError('Card not owned', 400, 'NOT_OWNED');
    }

    if (card.level >= card.maxLevel) {
      throw new APIError('Card at max level', 400, 'MAX_LEVEL');
    }

    if (!this.mockUser || this.mockUser.tokenBalance < card.upgradeCost) {
      throw new APIError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
    }

    // Deduct cost and add bonus
    const bonusIncrease = Math.floor(card.bonusRate * 0.5);
    this.mockUser.tokenBalance -= card.upgradeCost;
    this.mockUser.earningRate += bonusIncrease;

    // Upgrade card
    this.mockCards[cardIndex] = {
      ...card,
      level: card.level + 1,
      bonusRate: card.bonusRate + bonusIncrease,
      upgradeCost: Math.floor(card.upgradeCost * 1.5),
    };

    return {
      success: true,
      card: this.mockCards[cardIndex],
      newBalance: this.mockUser.tokenBalance,
      newEarningRate: this.mockUser.earningRate,
    };
  }

  /**
   * Get referral statistics
   */
  async getReferralStats(): Promise<ReferralStats> {
    await delay(100);

    return {
      totalReferrals: 3,
      totalBonus: 150,
      referralLink: `https://t.me/miniapp?start=ref_${this.mockUser?.id ?? 'guest'}`,
      friends: [
        {
          id: generateId(),
          username: 'Friend1',
          joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          contribution: 50,
        },
        {
          id: generateId(),
          username: 'Friend2',
          joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          contribution: 50,
        },
        {
          id: generateId(),
          username: 'Friend3',
          joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          contribution: 50,
        },
      ],
    };
  }

  /**
   * Reset mock data (useful for testing)
   */
  reset(): void {
    this.mockUser = null;
    this.mockRewards = [];
    this.initializeMockData();
  }
}

// Default singleton instance
export const apiService = new APIService();
