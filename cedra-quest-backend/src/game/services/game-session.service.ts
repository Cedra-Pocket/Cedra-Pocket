import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnergyService } from './energy.service';
import { GameSessionRequest, GameSessionResult } from '../../common/interfaces/game.interface';
import { GAME_CONSTANTS, ANTI_CHEAT } from '../../common/constants/game.constants';

@Injectable()
export class GameSessionService {
  private readonly logger = new Logger(GameSessionService.name);

  constructor(
    private prisma: PrismaService,
    private energyService: EnergyService,
  ) {}

  /**
   * Start a game session (consume energy)
   */
  async startGameSession(userId: string, gameType: string): Promise<{ success: boolean; energyUsed: number; error?: string }> {
    try {
      // Validate game type
      const validGameTypes = ['arcade', 'puzzle', 'memory', 'reaction'];
      if (!validGameTypes.includes(gameType)) {
        throw new BadRequestException('Invalid game type');
      }

      // Check rate limiting
      const recentGames = await this.prisma.game_sessions.count({
        where: {
          user_id: BigInt(userId),
          created_at: {
            gte: new Date(Date.now() - 60 * 1000), // Last minute
          },
        },
      });

      if (recentGames >= ANTI_CHEAT.MAX_GAMES_PER_MINUTE) {
        return {
          success: false,
          energyUsed: 0,
          error: 'Too many games played recently, please wait',
        };
      }

      // Consume energy
      await this.energyService.consumeEnergy(userId, 1);

      this.logger.log(`User ${userId} started ${gameType} game session`);

      return {
        success: true,
        energyUsed: 1,
      };
    } catch (error) {
      this.logger.error(`Failed to start game session for user ${userId}`, error);
      
      if (error.message === 'Insufficient energy') {
        return {
          success: false,
          energyUsed: 0,
          error: 'Insufficient energy to play game',
        };
      }
      
      throw error;
    }
  }

  /**
   * Complete a game session and earn points
   */
  async completeGameSession(userId: string, request: GameSessionRequest): Promise<GameSessionResult> {
    try {
      const { gameType, score, duration } = request;

      // Validate inputs
      if (score < 0) {
        throw new BadRequestException('Invalid score');
      }

      if (duration && (duration < ANTI_CHEAT.MIN_GAME_DURATION || duration > GAME_CONSTANTS.MAX_GAME_DURATION)) {
        throw new BadRequestException('Invalid game duration');
      }

      // Calculate points earned
      const basePoints = GAME_CONSTANTS.BASE_POINTS_PER_GAME;
      const scoreBonus = Math.floor(score * GAME_CONSTANTS.SCORE_MULTIPLIER);
      const pointsEarned = basePoints + scoreBonus;

      return await this.prisma.$transaction(async (tx) => {
        // Get user data
        const user = await tx.users.findUnique({
          where: { telegram_id: BigInt(userId) },
          select: {
            total_points: true,
            lifetime_points: true,
          },
        });

        if (!user) {
          throw new BadRequestException('User not found');
        }

        // Update user points
        const newTotalPoints = Number(user.total_points) + pointsEarned;
        const newLifetimePoints = Number(user.lifetime_points) + pointsEarned;

        await tx.users.update({
          where: { telegram_id: BigInt(userId) },
          data: {
            total_points: newTotalPoints,
            lifetime_points: newLifetimePoints,
            updated_at: new Date(),
          },
        });

        // Record game session
        await tx.game_sessions.create({
          data: {
            user_id: BigInt(userId),
            game_type: gameType,
            score,
            points_earned: pointsEarned,
            energy_used: 1,
            duration: duration || null,
          },
        });

        // Get updated energy status
        const energyStatus = await this.energyService.getEnergyStatus(userId);

        this.logger.log(`User ${userId} completed ${gameType} game: score ${score}, earned ${pointsEarned} points`);

        return {
          success: true,
          pointsEarned,
          energyUsed: 1,
          newEnergyLevel: energyStatus.currentEnergy,
          newTotalPoints,
        };
      });
    } catch (error) {
      this.logger.error(`Failed to complete game session for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Get user's game statistics
   */
  async getGameStats(userId: string): Promise<{
    totalGamesPlayed: number;
    totalPointsEarned: number;
    averageScore: number;
    favoriteGameType: string;
    todayGamesPlayed: number;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalStats, todayStats, gameTypeStats] = await Promise.all([
        // Total stats
        this.prisma.game_sessions.aggregate({
          where: { user_id: BigInt(userId) },
          _count: { id: true },
          _sum: { points_earned: true, score: true },
          _avg: { score: true },
        }),

        // Today's stats
        this.prisma.game_sessions.count({
          where: {
            user_id: BigInt(userId),
            created_at: { gte: today },
          },
        }),

        // Game type stats
        this.prisma.game_sessions.groupBy({
          by: ['game_type'],
          where: { user_id: BigInt(userId) },
          _count: { game_type: true },
          orderBy: { _count: { game_type: 'desc' } },
        }),
      ]);

      return {
        totalGamesPlayed: totalStats._count.id || 0,
        totalPointsEarned: totalStats._sum.points_earned || 0,
        averageScore: Math.round(totalStats._avg.score || 0),
        favoriteGameType: gameTypeStats[0]?.game_type || 'none',
        todayGamesPlayed: todayStats,
      };
    } catch (error) {
      this.logger.error(`Failed to get game stats for user ${userId}`, error);
      // Return default stats instead of throwing
      return {
        totalGamesPlayed: 0,
        totalPointsEarned: 0,
        averageScore: 0,
        favoriteGameType: 'none',
        todayGamesPlayed: 0,
      };
    }
  }
}