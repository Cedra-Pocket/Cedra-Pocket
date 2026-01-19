import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RankInfo } from '../../common/interfaces/game.interface';
import { RANK_THRESHOLDS, RANK_ORDER } from '../../common/constants/game.constants';

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get user's rank information
   */
  async getUserRankInfo(userId: string): Promise<RankInfo> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { telegram_id: BigInt(userId) },
        select: {
          lifetime_points: true,
          current_rank: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const lifetimePoints = Number(user.lifetime_points);
      const currentRank = this.calculateRank(lifetimePoints);

      // Update rank if it changed
      if (currentRank !== user.current_rank) {
        await this.prisma.users.update({
          where: { telegram_id: BigInt(userId) },
          data: { current_rank: currentRank as any },
        });
      }

      // Calculate next rank info
      const currentRankIndex = RANK_ORDER.indexOf(currentRank as any);
      const nextRank = currentRankIndex < RANK_ORDER.length - 1 ? RANK_ORDER[currentRankIndex + 1] : null;
      const nextRankThreshold = nextRank ? RANK_THRESHOLDS[nextRank] : lifetimePoints;
      const pointsToNextRank = nextRank ? Math.max(0, nextRankThreshold - lifetimePoints) : 0;

      // Calculate progress percentage
      const currentRankThreshold = RANK_THRESHOLDS[currentRank as keyof typeof RANK_THRESHOLDS];
      const rankProgress = nextRank 
        ? Math.min(100, ((lifetimePoints - currentRankThreshold) / (nextRankThreshold - currentRankThreshold)) * 100)
        : 100;

      return {
        currentRank,
        lifetimePoints,
        nextRankThreshold,
        pointsToNextRank,
        rankProgress: Math.round(rankProgress),
      };
    } catch (error) {
      this.logger.error(`Failed to get rank info for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 100, offset: number = 0): Promise<{
    users: Array<{
      telegram_id: string;
      username: string | null;
      lifetime_points: number;
      current_rank: string;
      position: number;
    }>;
    total: number;
  }> {
    try {
      const [users, total] = await Promise.all([
        this.prisma.users.findMany({
          select: {
            telegram_id: true,
            username: true,
            lifetime_points: true,
            current_rank: true,
          },
          orderBy: { lifetime_points: 'desc' },
          take: limit,
          skip: offset,
        }),
        this.prisma.users.count(),
      ]);

      const leaderboard = users.map((user, index) => ({
        telegram_id: user.telegram_id.toString(),
        username: user.username,
        lifetime_points: Number(user.lifetime_points),
        current_rank: user.current_rank,
        position: offset + index + 1,
      }));

      return {
        users: leaderboard,
        total,
      };
    } catch (error) {
      this.logger.error('Failed to get leaderboard', error);
      // Return empty result instead of throwing
      return {
        users: [],
        total: 0,
      };
    }
  }

  /**
   * Get user's position in leaderboard
   */
  async getUserPosition(userId: string): Promise<number> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { telegram_id: BigInt(userId) },
        select: { lifetime_points: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const position = await this.prisma.users.count({
        where: {
          lifetime_points: { gt: user.lifetime_points },
        },
      });

      return position + 1;
    } catch (error) {
      this.logger.error(`Failed to get position for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Get rank statistics
   */
  async getRankStatistics(): Promise<Record<string, number>> {
    try {
      const stats = await this.prisma.users.groupBy({
        by: ['current_rank'],
        _count: { current_rank: true },
      });

      const rankStats: Record<string, number> = {};
      
      // Initialize all ranks with 0
      RANK_ORDER.forEach(rank => {
        rankStats[rank] = 0;
      });

      // Fill in actual counts
      stats.forEach(stat => {
        if (stat.current_rank && RANK_ORDER.includes(stat.current_rank as any)) {
          rankStats[stat.current_rank] = stat._count.current_rank;
        }
      });

      return rankStats;
    } catch (error) {
      this.logger.error('Failed to get rank statistics', error);
      // Return default stats instead of throwing
      const defaultStats: Record<string, number> = {};
      RANK_ORDER.forEach(rank => {
        defaultStats[rank] = 0;
      });
      return defaultStats;
    }
  }

  /**
   * Calculate rank based on lifetime points
   */
  private calculateRank(lifetimePoints: number): string {
    for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
      const rank = RANK_ORDER[i];
      if (lifetimePoints >= RANK_THRESHOLDS[rank]) {
        return rank;
      }
    }
    return 'BRONZE';
  }
}