import { ConfigService } from '@nestjs/config';
import { TelegramUser } from '../common/interfaces/auth.interface';
export declare class TelegramAuthService {
    private configService;
    private readonly logger;
    private readonly botToken;
    constructor(configService: ConfigService);
    validateTelegramInitData(initData: string): Promise<TelegramUser>;
    private parseInitData;
    private validateSignature;
}
