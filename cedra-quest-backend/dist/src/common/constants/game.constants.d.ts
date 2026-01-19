export declare const PET_CONSTANTS: {
    FEED_COST: number;
    MAX_DAILY_SPEND: number;
    XP_PER_FEED: number;
    XP_FOR_LEVEL_UP: number;
    MAX_LEVEL: number;
    MAX_CLAIM_HOURS: number;
};
export declare const ENERGY_CONSTANTS: {
    MAX_ENERGY: number;
    REGEN_INTERVAL: number;
    REGEN_THRESHOLD: number;
    ENERGY_PER_GAME: number;
};
export declare const GAME_CONSTANTS: {
    BASE_POINTS_PER_GAME: number;
    SCORE_MULTIPLIER: number;
    MAX_GAME_DURATION: number;
};
export declare const RANK_THRESHOLDS: {
    readonly BRONZE: 0;
    readonly SILVER: 10000;
    readonly GOLD: 50000;
    readonly PLATINUM: 200000;
    readonly DIAMOND: 1000000;
    readonly LEVIATHAN: 5000000;
};
export declare const RANK_ORDER: readonly ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "LEVIATHAN"];
export declare const DEFAULT_CYCLE: {
    cycleNumber: number;
    growthRate: number;
    maxSpeedCap: number;
    isActive: boolean;
};
export declare const TIME_CONSTANTS: {
    HOUR_IN_MS: number;
    DAY_IN_MS: number;
    MINUTE_IN_MS: number;
};
export declare const DATE_FORMAT = "YYYY-MM-DD";
export declare const ANTI_CHEAT: {
    MAX_FEEDS_PER_MINUTE: number;
    MAX_GAMES_PER_MINUTE: number;
    MIN_GAME_DURATION: number;
};
