import { TelegramAuthService } from './telegram-auth.service';
import { UserService } from '../user/user.service';
import { WalletNameService } from '../wallet/wallet-name.service';
import { WalletService } from '../wallet/wallet.service';
import { AuthenticationResult } from '../common/interfaces/auth.interface';
import { WalletCreationDto, WalletRecoveryDto } from '../common/dto/auth.dto';
import { WalletCreationResult } from '../common/interfaces/wallet.interface';
export declare class AuthService {
    private telegramAuthService;
    private userService;
    private walletNameService;
    private walletService;
    private readonly logger;
    constructor(telegramAuthService: TelegramAuthService, userService: UserService, walletNameService: WalletNameService, walletService: WalletService);
    authenticateUser(initData: string): Promise<AuthenticationResult>;
    createWallet(walletData: WalletCreationDto): Promise<WalletCreationResult>;
    recoverWallet(recoveryData: WalletRecoveryDto): Promise<AuthenticationResult>;
}
