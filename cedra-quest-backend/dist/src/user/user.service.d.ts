import { PrismaService } from '../prisma/prisma.service';
import { UserInfo } from '../common/interfaces/auth.interface';
export declare class UserService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findUserByTelegramId(telegramId: string): Promise<UserInfo | null>;
    getUserProfile(telegramId: string): Promise<UserInfo | null>;
    checkWalletAddressExists(walletAddress: string): Promise<boolean>;
    findUserByPublicKey(publicKey: string): Promise<UserInfo | null>;
}
