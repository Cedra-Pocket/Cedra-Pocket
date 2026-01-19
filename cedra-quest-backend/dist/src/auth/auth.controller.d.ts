import { AuthService } from './auth.service';
import { TelegramAuthDto, WalletCreationDto, WalletRecoveryDto } from '../common/dto/auth.dto';
export declare class AuthController {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(authDto: TelegramAuthDto): Promise<import("../common/interfaces/auth.interface").AuthenticationResult>;
    createWallet(walletDto: WalletCreationDto): Promise<import("../common/interfaces/wallet.interface").WalletCreationResult>;
    recoverWallet(recoveryDto: WalletRecoveryDto): Promise<import("../common/interfaces/auth.interface").AuthenticationResult>;
}
