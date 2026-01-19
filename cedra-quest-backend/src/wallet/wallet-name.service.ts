import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TelegramUser } from '../common/interfaces/auth.interface';

@Injectable()
export class WalletNameService {
  private readonly logger = new Logger(WalletNameService.name);
  private readonly WALLET_SUFFIX = '.hot.tg';

  constructor(private userService: UserService) {}

  /**
   * Generate a suggested wallet name for a new user
   * @param telegramUser Telegram user data
   * @returns Available wallet name
   */
  async generateSuggestedWalletName(telegramUser: TelegramUser): Promise<string> {
    try {
      // Start with username or fallback to user ID
      let baseName = telegramUser.username || `user_${telegramUser.id}`;
      
      // Clean the base name (remove special characters, convert to lowercase)
      baseName = this.cleanBaseName(baseName);
      
      // Check if the base name is available
      let suggestedName = `${baseName}${this.WALLET_SUFFIX}`;
      let suffix = 0;

      while (await this.isWalletNameTaken(suggestedName)) {
        suffix++;
        suggestedName = `${baseName}_${suffix}${this.WALLET_SUFFIX}`;
        
        // Prevent infinite loop (max 1000 attempts)
        if (suffix > 1000) {
          // Fallback to timestamp-based name
          const timestamp = Date.now();
          suggestedName = `user_${timestamp}${this.WALLET_SUFFIX}`;
          break;
        }
      }

      this.logger.log(`Generated wallet name: ${suggestedName} for user: ${telegramUser.id}`);
      return suggestedName;
    } catch (error) {
      this.logger.error('Failed to generate wallet name', error);
      // Fallback to timestamp-based name
      const timestamp = Date.now();
      return `user_${timestamp}${this.WALLET_SUFFIX}`;
    }
  }

  /**
   * Check if a wallet name is already taken
   * @param walletName Wallet name to check
   * @returns True if taken, false if available
   */
  async isWalletNameTaken(walletName: string): Promise<boolean> {
    try {
      // Check in database
      const existsInDb = await this.userService.checkWalletAddressExists(walletName);
      
      if (existsInDb) {
        return true;
      }

      // TODO: Add blockchain RPC check here
      // const existsOnChain = await this.blockchainService.checkAddressExists(walletName);
      // return existsOnChain;

      return false;
    } catch (error) {
      this.logger.error(`Failed to check wallet name availability: ${walletName}`, error);
      // In case of error, assume it's taken to be safe
      return true;
    }
  }

  /**
   * Clean base name by removing special characters and converting to lowercase
   * @param baseName Original base name
   * @returns Cleaned base name
   */
  private cleanBaseName(baseName: string): string {
    return baseName
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '') // Remove special characters except underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .substring(0, 20); // Limit length
  }

  /**
   * Validate wallet name format
   * @param walletName Wallet name to validate
   * @returns True if valid format
   */
  validateWalletNameFormat(walletName: string): boolean {
    // Check if it ends with .hot.tg
    if (!walletName.endsWith(this.WALLET_SUFFIX)) {
      return false;
    }

    // Extract the base name
    const baseName = walletName.replace(this.WALLET_SUFFIX, '');
    
    // Check base name format (alphanumeric and underscore only, 3-20 characters)
    const baseNameRegex = /^[a-z0-9_]{3,20}$/;
    return baseNameRegex.test(baseName);
  }
}