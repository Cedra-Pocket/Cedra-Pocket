import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GameCycleInfo } from '../../common/interfaces/game.interface';
import { DEFAULT_CYCLE } from '../../common/constants/game.constants';

@Injectable()
export class GameCycleService {
  private readonly logger = new Logger(GameCycleService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get current active game cycle
   */
  async getCurrentCycle(): Promise<GameCycleInfo> {
    try {
      const activeCycle = await this.prisma.game_cycles.findFirst({
        where: {
          is_active: true,
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
        orderBy: { cycle_number: 'desc' },
      });

      if (activeCycle) {
        return {
          cycleNumber: activeCycle.cycle_number,
          growthRate: Number(activeCycle.growth_rate),
          maxSpeedCap: Number(activeCycle.max_speed_cap),
          startDate: activeCycle.start_date,
          endDate: activeCycle.end_date,
          isActive: activeCycle.is_active,
        };
      }

      // Return default cycle if no active cycle found
      this.logger.warn('No active game cycle found, using default cycle');
      return {
        cycleNumber: DEFAULT_CYCLE.cycleNumber,
        growthRate: DEFAULT_CYCLE.growthRate,
        maxSpeedCap: DEFAULT_CYCLE.maxSpeedCap,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: DEFAULT_CYCLE.isActive,
      };
    } catch (error) {
      this.logger.error('Failed to get current cycle', error);
      // Return default cycle on error
      return {
        cycleNumber: DEFAULT_CYCLE.cycleNumber,
        growthRate: DEFAULT_CYCLE.growthRate,
        maxSpeedCap: DEFAULT_CYCLE.maxSpeedCap,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: DEFAULT_CYCLE.isActive,
      };
    }
  }

  /**
   * Get all game cycles (for admin)
   */
  async getAllCycles(): Promise<GameCycleInfo[]> {
    try {
      const cycles = await this.prisma.game_cycles.findMany({
        orderBy: { cycle_number: 'asc' },
      });

      return cycles.map(cycle => ({
        cycleNumber: cycle.cycle_number,
        growthRate: Number(cycle.growth_rate),
        maxSpeedCap: Number(cycle.max_speed_cap),
        startDate: cycle.start_date,
        endDate: cycle.end_date,
        isActive: cycle.is_active,
      }));
    } catch (error) {
      this.logger.error('Failed to get all cycles', error);
      throw error;
    }
  }

  /**
   * Create new game cycle (admin function)
   */
  async createCycle(cycleData: {
    cycleNumber: number;
    growthRate: number;
    maxSpeedCap: number;
    startDate: Date;
    endDate: Date;
  }): Promise<GameCycleInfo> {
    try {
      const cycle = await this.prisma.game_cycles.create({
        data: {
          cycle_number: cycleData.cycleNumber,
          growth_rate: cycleData.growthRate,
          max_speed_cap: cycleData.maxSpeedCap,
          start_date: cycleData.startDate,
          end_date: cycleData.endDate,
          is_active: false, // Admin needs to manually activate
        },
      });

      this.logger.log(`Created new game cycle: ${cycle.cycle_number}`);

      return {
        cycleNumber: cycle.cycle_number,
        growthRate: Number(cycle.growth_rate),
        maxSpeedCap: Number(cycle.max_speed_cap),
        startDate: cycle.start_date,
        endDate: cycle.end_date,
        isActive: cycle.is_active,
      };
    } catch (error) {
      this.logger.error('Failed to create cycle', error);
      throw error;
    }
  }

  /**
   * Activate a game cycle (admin function)
   */
  async activateCycle(cycleNumber: number): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Deactivate all other cycles
        await tx.game_cycles.updateMany({
          where: { is_active: true },
          data: { is_active: false },
        });

        // Activate the specified cycle
        await tx.game_cycles.update({
          where: { cycle_number: cycleNumber },
          data: { is_active: true },
        });
      });

      this.logger.log(`Activated game cycle: ${cycleNumber}`);
    } catch (error) {
      this.logger.error(`Failed to activate cycle ${cycleNumber}`, error);
      throw error;
    }
  }
}