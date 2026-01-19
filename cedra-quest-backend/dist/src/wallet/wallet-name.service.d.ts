import { UserService } from '../user/user.service';
import { TelegramUser } from '../common/interfaces/auth.interface';
export declare class WalletNameService {
    private userService;
    private readonly logger;
    private readonly WALLET_SUFFIX;
    constructor(userService: UserService);
    generateSuggestedWalletName(telegramUser: TelegramUser): Promise<string>;
    isWalletNameTaken(walletName: string): Promise<boolean>;
    private cleanBaseName;
    validateWalletNameFormat(walletName: string): boolean;
}
