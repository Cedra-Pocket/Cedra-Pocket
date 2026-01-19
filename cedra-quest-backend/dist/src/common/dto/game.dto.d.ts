export declare class FeedPetDto {
    feedCount: number;
}
export declare class GameSessionStartDto {
    gameType: string;
}
export declare class GameSessionCompleteDto {
    gameType: string;
    score: number;
    duration?: number;
}
export declare class RefillEnergyDto {
    energyAmount: number;
}
export declare class LeaderboardQueryDto {
    limit?: number;
    offset?: number;
}
export declare class CreateCycleDto {
    cycleNumber: number;
    growthRate: number;
    maxSpeedCap: number;
    startDate: string;
    endDate: string;
}
