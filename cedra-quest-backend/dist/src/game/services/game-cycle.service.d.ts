import { PrismaService } from '../../prisma/prisma.service';
import { GameCycleInfo } from '../../common/interfaces/game.interface';
export declare class GameCycleService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getCurrentCycle(): Promise<GameCycleInfo>;
    getAllCycles(): Promise<GameCycleInfo[]>;
    createCycle(cycleData: {
        cycleNumber: number;
        growthRate: number;
        maxSpeedCap: number;
        startDate: Date;
        endDate: Date;
    }): Promise<GameCycleInfo>;
    activateCycle(cycleNumber: number): Promise<void>;
}
