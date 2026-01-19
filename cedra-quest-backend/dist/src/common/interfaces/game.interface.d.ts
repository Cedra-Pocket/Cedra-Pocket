export interface PetStatus {
    level: number;
    currentXp: number;
    xpForNextLevel: number;
    lastClaimTime: Date;
    pendingRewards: number;
    canLevelUp: boolean;
    dailyFeedSpent: number;
    dailyFeedLimit: number;
    feedCost: number;
}
export interface EnergyStatus {
    currentEnergy: number;
    maxEnergy: number;
    nextRegenTime: Date | null;
    timeToFullEnergy: number;
}
export interface GameCycleInfo {
    cycleNumber: number;
    growthRate: number;
    maxSpeedCap: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}
export interface FeedPetRequest {
    feedCount: number;
}
export interface FeedPetResult {
    success: boolean;
    pointsSpent: number;
    xpGained: number;
    newXp: number;
    newLevel?: number;
    canLevelUp: boolean;
    dailySpentTotal: number;
    error?: string;
}
export interface ClaimRewardsResult {
    success: boolean;
    pointsEarned: number;
    newTotalPoints: number;
    newLifetimePoints: number;
    claimTime: Date;
    error?: string;
}
export interface GameSessionRequest {
    gameType: string;
    score: number;
    duration?: number;
}
export interface GameSessionResult {
    success: boolean;
    pointsEarned: number;
    energyUsed: number;
    newEnergyLevel: number;
    newTotalPoints: number;
    error?: string;
}
export interface RankInfo {
    currentRank: string;
    lifetimePoints: number;
    nextRankThreshold: number;
    pointsToNextRank: number;
    rankProgress: number;
}
