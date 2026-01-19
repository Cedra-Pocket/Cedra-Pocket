import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletCreationData, WalletCreationResult, UserWalletMapping } from '../common/interfaces/wallet.interface';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user wallet mapping in the database
   * @param walletData Wallet creation data
   * @returns Creation result
   */
  async createUserWallet(walletData: WalletCreationData): Promise<WalletCreationResult> {
    try {
      // Check if wallet address already exists
      const existingWallet = await this.prisma.users.findUnique({
        where: {
          wallet_address: walletData.requested_address,
        },
      });

      if (existingWallet) {
        return {
          success: false,
          error: 'Wallet address already exists',
        };
      }

      // Check if user already has a wallet
      const existingUser = await this.prisma.users.findUnique({
        where: {
          telegram_id: BigInt(walletData.telegram_id),
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'User already has a wallet',
        };
      }

      // Create new user record
      const newUser = await this.prisma.users.create({
        data: {
          telegram_id: BigInt(walletData.telegram_id),
          wallet_address: walletData.requested_address,
          public_key: walletData.public_key,
          is_wallet_connected: true,
        },
      });

      this.logger.log(`Created wallet for user: ${walletData.telegram_id}, address: ${walletData.requested_address}`);

      return {
        success: true,
        wallet_address: newUser.wallet_address,
      };
    } catch (error) {
      this.logger.error('Failed to create user wallet', error);
      return {
        success: false,
        error: 'Failed to create wallet in database',
      };
    }
  }

  /**
   * Save user wallet mapping after successful on-chain creation
   * @param mapping User wallet mapping data
   */
  async saveUserWalletMapping(mapping: UserWalletMapping): Promise<void> {
    try {
      await this.prisma.users.upsert({
        where: {
          telegram_id: BigInt(mapping.telegram_id),
        },
        update: {
          wallet_address: mapping.wallet_address,
          public_key: mapping.public_key,
          updated_at: new Date(),
        },
        create: {
          telegram_id: BigInt(mapping.telegram_id),
          wallet_address: mapping.wallet_address,
          public_key: mapping.public_key,
          is_wallet_connected: true,
        },
      });

      this.logger.log(`Saved wallet mapping for user: ${mapping.telegram_id}`);
    } catch (error) {
      this.logger.error('Failed to save wallet mapping', error);
      throw error;
    }
  }
}