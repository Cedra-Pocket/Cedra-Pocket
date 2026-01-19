import { PrismaService } from '../../prisma/prisma.service';
import { PetStatus, FeedPetRequest, FeedPetResult, ClaimRewardsResult } from '../../common/interfaces/game.interface';
import { GameCycleService } from './game-cycle.service';
export declare class PetService {
    private prisma;
    private gameCycleService;
    private readonly logger;
    constructor(prisma: PrismaService, gameCycleService: GameCycleService);
    getPetStatus(userId: string): Promise<PetStatus>;
    feedPet(userId: string, request: FeedPetRequest): Promise<FeedPetResult>;
    claimRewards(userId: string): Promise<ClaimRewardsResult>;
    private calculatePendingRewards;
}
