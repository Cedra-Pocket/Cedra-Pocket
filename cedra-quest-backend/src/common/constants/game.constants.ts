// Pet System Constants
export const PET_CONSTANTS = {
  FEED_COST: 20, // Points per feed
  MAX_DAILY_SPEND: 600, // Max points per day for feeding
  XP_PER_FEED: 20, // XP gained per feed
  XP_FOR_LEVEL_UP: 1200, // XP needed for next level
  MAX_LEVEL: 10, // Maximum pet level
  MAX_CLAIM_HOURS: 4, // Maximum hours for reward accumulation
};

// Energy System Constants
export const ENERGY_CONSTANTS = {
  MAX_ENERGY: 10, // Default max energy
  REGEN_INTERVAL: 30 * 60 * 1000, // 30 minutes in milliseconds
  REGEN_THRESHOLD: 5, // Only regenerate if energy < 5
  ENERGY_PER_GAME: 1, // Energy consumed per game
};

// Game Constants
export const GAME_CONSTANTS = {
  BASE_POINTS_PER_GAME: 50, // Base points earned per game
  SCORE_MULTIPLIER: 0.1, // Additional points per score point
  MAX_GAME_DURATION: 300, // Max game duration in seconds (5 minutes)
};

// Ranking System Constants
export const RANK_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 10000,
  GOLD: 50000,
  PLATINUM: 200000,
  DIAMOND: 1000000,
  LEVIATHAN: 5000000,
} as const;

export const RANK_ORDER = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'LEVIATHAN'] as const;

// Default Game Cycle (if no active cycle)
export const DEFAULT_CYCLE = {
  cycleNumber: 1,
  growthRate: 0.8,
  maxSpeedCap: 8.0,
  isActive: true,
};

// Time Utilities
export const TIME_CONSTANTS = {
  HOUR_IN_MS: 60 * 60 * 1000,
  DAY_IN_MS: 24 * 60 * 60 * 1000,
  MINUTE_IN_MS: 60 * 1000,
};

// Date format for daily tracking
export const DATE_FORMAT = 'YYYY-MM-DD';

// Anti-cheat constants
export const ANTI_CHEAT = {
  MAX_FEEDS_PER_MINUTE: 30, // Max feeds per minute to prevent spam
  MAX_GAMES_PER_MINUTE: 10, // Max games per minute
  MIN_GAME_DURATION: 5, // Minimum game duration in seconds
};