import { PrismaService } from '../../prisma/prisma.service';
import { EnergyStatus } from '../../common/interfaces/game.interface';
export declare class EnergyService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getEnergyStatus(userId: string): Promise<EnergyStatus>;
    consumeEnergy(userId: string, amount?: number): Promise<EnergyStatus>;
    refillEnergy(userId: string, energyAmount: number): Promise<{
        success: boolean;
        pointsCost: number;
        newEnergy: number;
        error?: string;
    }>;
}
