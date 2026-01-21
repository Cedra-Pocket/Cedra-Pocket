import { PrismaService } from '../../prisma/prisma.service';
import { EnergyService } from './energy.service';
import { GameSessionRequest, GameSessionResult } from '../../common/interfaces/game.interface';
export declare class GameSessionService {
    private prisma;
    private energyService;
    private readonly logger;
    constructor(prisma: PrismaService, energyService: EnergyService);
    private safeToBigInt;
    startGameSession(userId: string, gameType: string): Promise<{
        success: boolean;
        energyUsed: number;
        error?: string;
    }>;
    completeGameSession(userId: string, request: GameSessionRequest): Promise<GameSessionResult>;
    getGameStats(userId: string): Promise<{
        totalGamesPlayed: number;
        totalPointsEarned: number;
        averageScore: number;
        favoriteGameType: string;
        todayGamesPlayed: number;
    }>;
}
