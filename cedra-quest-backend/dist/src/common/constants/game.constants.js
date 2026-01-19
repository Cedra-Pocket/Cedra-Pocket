"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANTI_CHEAT = exports.DATE_FORMAT = exports.TIME_CONSTANTS = exports.DEFAULT_CYCLE = exports.RANK_ORDER = exports.RANK_THRESHOLDS = exports.GAME_CONSTANTS = exports.ENERGY_CONSTANTS = exports.PET_CONSTANTS = void 0;
exports.PET_CONSTANTS = {
    FEED_COST: 20,
    MAX_DAILY_SPEND: 600,
    XP_PER_FEED: 20,
    XP_FOR_LEVEL_UP: 1200,
    MAX_LEVEL: 10,
    MAX_CLAIM_HOURS: 4,
};
exports.ENERGY_CONSTANTS = {
    MAX_ENERGY: 10,
    REGEN_INTERVAL: 30 * 60 * 1000,
    REGEN_THRESHOLD: 5,
    ENERGY_PER_GAME: 1,
};
exports.GAME_CONSTANTS = {
    BASE_POINTS_PER_GAME: 50,
    SCORE_MULTIPLIER: 0.1,
    MAX_GAME_DURATION: 300,
};
exports.RANK_THRESHOLDS = {
    BRONZE: 0,
    SILVER: 10000,
    GOLD: 50000,
    PLATINUM: 200000,
    DIAMOND: 1000000,
    LEVIATHAN: 5000000,
};
exports.RANK_ORDER = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'LEVIATHAN'];
exports.DEFAULT_CYCLE = {
    cycleNumber: 1,
    growthRate: 0.8,
    maxSpeedCap: 8.0,
    isActive: true,
};
exports.TIME_CONSTANTS = {
    HOUR_IN_MS: 60 * 60 * 1000,
    DAY_IN_MS: 24 * 60 * 60 * 1000,
    MINUTE_IN_MS: 60 * 1000,
};
exports.DATE_FORMAT = 'YYYY-MM-DD';
exports.ANTI_CHEAT = {
    MAX_FEEDS_PER_MINUTE: 30,
    MAX_GAMES_PER_MINUTE: 10,
    MIN_GAME_DURATION: 5,
};
//# sourceMappingURL=game.constants.js.map