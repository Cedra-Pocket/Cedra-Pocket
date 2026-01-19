import { PrismaService } from '../prisma/prisma.service';
import { WalletCreationData, WalletCreationResult, UserWalletMapping } from '../common/interfaces/wallet.interface';
export declare class WalletService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createUserWallet(walletData: WalletCreationData): Promise<WalletCreationResult>;
    saveUserWalletMapping(mapping: UserWalletMapping): Promise<void>;
}
