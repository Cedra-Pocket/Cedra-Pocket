import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletNameService } from './wallet-name.service';

@Controller('wallet')
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(
    private walletService: WalletService,
    private walletNameService: WalletNameService,
  ) {}

  /**
   * Generate suggested wallet name for user
   * POST /wallet/suggest-name
   */
  @Post('suggest-name')
  async suggestWalletName(@Body() body: { 
    telegram_id: string; 
    username?: string; 
    first_name?: string; 
  }) {
    this.logger.log(`Generating wallet name for user: ${body.telegram_id}`);
    
    const telegramUser = {
      id: body.telegram_id,
      username: body.username,
      first_name: body.first_name,
    };
    
    const suggestedName = await this.walletNameService.generateSuggestedWalletName(telegramUser);
    
    return {
      success: true,
      suggested_name: suggestedName,
      available: !(await this.walletNameService.isWalletNameTaken(suggestedName)),
    };
  }

  /**
   * Check if wallet name is available
   * GET /wallet/check/:walletName
   */
  @Get('check/:walletName')
  async checkWalletName(@Param('walletName') walletName: string) {
    this.logger.log(`Checking wallet name availability: ${walletName}`);
    
    const isValid = this.walletNameService.validateWalletNameFormat(walletName);
    const isTaken = await this.walletNameService.isWalletNameTaken(walletName);
    
    return {
      wallet_name: walletName,
      is_valid: isValid,
      is_available: !isTaken,
      message: !isValid ? 'Invalid wallet name format' : 
               isTaken ? 'Wallet name is already taken' : 
               'Wallet name is available',
    };
  }

  /**
   * Create wallet for user
   * POST /wallet/create
   */
  @Post('create')
  async createWallet(@Body() body: {
    telegram_id: string;
    wallet_name: string;
    public_key?: string;
  }) {
    this.logger.log(`Creating wallet for user: ${body.telegram_id}, name: ${body.wallet_name}`);
    
    // Validate wallet name
    if (!this.walletNameService.validateWalletNameFormat(body.wallet_name)) {
      return {
        success: false,
        error: 'Invalid wallet name format',
      };
    }

    // Check availability
    const isTaken = await this.walletNameService.isWalletNameTaken(body.wallet_name);
    if (isTaken) {
      return {
        success: false,
        error: 'Wallet name is already taken',
      };
    }

    // Create wallet
    const result = await this.walletService.createUserWallet({
      telegram_id: body.telegram_id,
      requested_address: body.wallet_name,
      public_key: body.public_key || `pk_${body.telegram_id}_${Date.now()}`,
    });

    if (result.success) {
      this.logger.log(`Wallet created successfully: ${result.wallet_address}`);
    }

    return result;
  }
}