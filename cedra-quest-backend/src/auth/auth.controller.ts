import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TelegramAuthDto, WalletCreationDto, WalletRecoveryDto } from '../common/dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  /**
   * Authenticate user with Telegram initData
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: TelegramAuthDto) {
    this.logger.log('Login attempt received');
    
    const result = await this.authService.authenticateUser(authDto.initData);
    
    if (!result.success) {
      this.logger.warn(`Login failed: ${result.error}`);
    } else if (result.user) {
      this.logger.log(`User logged in: ${result.user.telegram_id}`);
    } else {
      this.logger.log('New user detected, wallet name suggested');
    }
    
    return result;
  }

  /**
   * Create new wallet for user
   * POST /auth/create-wallet
   */
  @Post('create-wallet')
  @HttpCode(HttpStatus.CREATED)
  async createWallet(@Body() walletDto: WalletCreationDto) {
    this.logger.log(`Wallet creation request for user: ${walletDto.telegram_id}`);
    
    const result = await this.authService.createWallet(walletDto);
    
    if (result.success) {
      this.logger.log(`Wallet created successfully: ${result.wallet_address}`);
    } else {
      this.logger.warn(`Wallet creation failed: ${result.error}`);
    }
    
    return result;
  }

  /**
   * Recover wallet using public key
   * POST /auth/recover-wallet
   */
  @Post('recover-wallet')
  @HttpCode(HttpStatus.OK)
  async recoverWallet(@Body() recoveryDto: WalletRecoveryDto) {
    this.logger.log('Wallet recovery attempt');
    
    const result = await this.authService.recoverWallet(recoveryDto);
    
    if (result.success) {
      this.logger.log(`Wallet recovered for user: ${result.user?.telegram_id}`);
    } else {
      this.logger.warn(`Wallet recovery failed: ${result.error}`);
    }
    
    return result;
  }
}