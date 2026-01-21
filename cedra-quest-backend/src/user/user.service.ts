import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInfo } from '../common/interfaces/auth.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Safely convert userId to BigInt, handling both numeric and non-numeric strings
   */
  private safeToBigInt(userId: string): bigint {
    // If userId starts with 'anon_' or contains non-numeric characters, 
    // convert to a hash-based BigInt
    if (!/^\d+$/.test(userId)) {
      // Create a simple hash from the string
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      // Ensure positive BigInt and avoid conflicts with real telegram IDs
      return BigInt(Math.abs(hash) + 1000000000); // Add offset to avoid conflicts
    }
    return BigInt(userId);
  }

  /**
   * Find existing user by Telegram ID
   * @param telegramId Telegram user ID
   * @returns User record or null if not found
   */
  async findUserByTelegramId(telegramId: string): Promise<UserInfo | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          telegram_id: this.safeToBigInt(telegramId),
        },
        select: {
          telegram_id: true,
          wallet_address: true,
          username: true,
          total_points: true,
          level: true,
          current_xp: true,
          current_rank: true,
          created_at: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        telegram_id: user.telegram_id.toString(),
        wallet_address: user.wallet_address,
        username: user.username,
        total_points: Number(user.total_points),
        level: user.level,
        current_xp: user.current_xp,
        current_rank: user.current_rank,
        created_at: user.created_at,
      };
    } catch (error) {
      this.logger.error(`Failed to find user by Telegram ID: ${telegramId}`, error);
      throw error;
    }
  }

  /**
   * Get complete user profile with additional game data
   * @param telegramId Telegram user ID
   * @returns Complete user profile or null if not found
   */
  async getUserProfile(telegramId: string): Promise<UserInfo | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          telegram_id: this.safeToBigInt(telegramId),
        },
        include: {
          pet: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        telegram_id: user.telegram_id.toString(),
        wallet_address: user.wallet_address,
        username: user.username,
        total_points: Number(user.total_points),
        level: user.level,
        current_xp: user.current_xp,
        current_rank: user.current_rank,
        created_at: user.created_at,
      };
    } catch (error) {
      this.logger.error(`Failed to get user profile: ${telegramId}`, error);
      throw error;
    }
  }

  /**
   * Check if wallet address exists in database
   * @param walletAddress Wallet address to check
   * @returns True if exists, false otherwise
   */
  async checkWalletAddressExists(walletAddress: string): Promise<boolean> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          wallet_address: walletAddress,
        },
        select: {
          telegram_id: true,
        },
      });

      return !!user;
    } catch (error) {
      this.logger.error(`Failed to check wallet address: ${walletAddress}`, error);
      throw error;
    }
  }

  /**
   * Find user by public key
   * @param publicKey Public key to search for
   * @returns User info or null if not found
   */
  async findUserByPublicKey(publicKey: string): Promise<UserInfo | null> {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          public_key: publicKey,
        },
        select: {
          telegram_id: true,
          wallet_address: true,
          username: true,
          total_points: true,
          level: true,
          current_xp: true,
          current_rank: true,
          created_at: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        telegram_id: user.telegram_id.toString(),
        wallet_address: user.wallet_address,
        username: user.username,
        total_points: Number(user.total_points),
        level: user.level,
        current_xp: user.current_xp,
        current_rank: user.current_rank,
        created_at: user.created_at,
      };
    } catch (error) {
      this.logger.error(`Failed to find user by public key`, error);
      throw error;
    }
  }
}