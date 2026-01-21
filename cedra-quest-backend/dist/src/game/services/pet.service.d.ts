import { PrismaService } from '../../prisma/prisma.service';
import { PetStatus, FeedPetRequest, FeedPetResult, ClaimRewardsResult } from '../../common/interfaces/game.interface';
import { GameCycleService } from './game-cycle.service';
import { BlockchainService } from '../../blockchain/blockchain.service';
export declare class PetService {
    private prisma;
    private gameCycleService;
    private blockchainService;
    private readonly logger;
    constructor(prisma: PrismaService, gameCycleService: GameCycleService, blockchainService: BlockchainService);
    private safeToBigInt;
    getPetStatus(userId: string): Promise<PetStatus>;
    feedPet(userId: string, request: FeedPetRequest): Promise<FeedPetResult>;
    claimRewards(userId: string): Promise<ClaimRewardsResult>;
    private calculatePendingRewards;
    private generateClaimSignature;
}
