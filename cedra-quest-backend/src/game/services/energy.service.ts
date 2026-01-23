import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnergyStatus } from '../../common/interfaces/game.interface';
import { ENERGY_CONSTANTS } from '../../common/constants/game.constants';

@Injectable()
export class EnergyService {
  private readonly logger = new Logger(EnergyService.name);

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
   * Get user's energy status
   */
  async getEnergyStatus(userId: string): Promise<EnergyStatus> {
    try {
      let userEnergy = await this.prisma.user_energy.findUnique({
        where: { user_id: this.safeToBigInt(userId) },
      });

      // Create energy record if doesn't exist
      if (!userEnergy) {
        userEnergy = await this.prisma.user_energy.create({
          data: {
            user_id: this.safeToBigInt(userId),
            current_energy: ENERGY_CONSTANTS.MAX_ENERGY,
            max_energy: ENERGY_CONSTANTS.MAX_ENERGY,
            last_update: new Date(),
          },
        });
      }

      // Calculate energy regeneration
      const now = new Date();
      const timeSinceUpdate = now.getTime() - userEnergy.last_update.getTime();
      
      let currentEnergy = userEnergy.current_energy;
      let lastUpdate = userEnergy.last_update;

      // Only regenerate if energy is below threshold
      if (currentEnergy < ENERGY_CONSTANTS.REGEN_THRESHOLD) {
        const intervalsElapsed = Math.floor(timeSinceUpdate / ENERGY_CONSTANTS.REGEN_INTERVAL);
        
        if (intervalsElapsed > 0) {
          const energyToAdd = Math.min(intervalsElapsed, userEnergy.max_energy - currentEnergy);
          currentEnergy = Math.min(currentEnergy + energyToAdd, userEnergy.max_energy);
          
          // Update database if energy changed
          if (energyToAdd > 0) {
            await this.prisma.user_energy.update({
              where: { user_id: this.safeToBigInt(userId) },
              data: {
                current_energy: currentEnergy,
                last_update: now,
              },
            });
            lastUpdate = now;
          }
        }
      }

      // Calculate next regeneration time
      let nextRegenTime: Date | null = null;
      if (currentEnergy < userEnergy.max_energy && currentEnergy < ENERGY_CONSTANTS.REGEN_THRESHOLD) {
        const timeSinceLastRegen = (now.getTime() - lastUpdate.getTime()) % ENERGY_CONSTANTS.REGEN_INTERVAL;
        const timeToNextRegen = ENERGY_CONSTANTS.REGEN_INTERVAL - timeSinceLastRegen;
        nextRegenTime = new Date(now.getTime() + timeToNextRegen);
      }

      // Calculate time to full energy
      let timeToFullEnergy = 0;
      if (currentEnergy < userEnergy.max_energy && currentEnergy < ENERGY_CONSTANTS.REGEN_THRESHOLD) {
        const energyNeeded = userEnergy.max_energy - currentEnergy;
        const timeSinceLastRegen = (now.getTime() - lastUpdate.getTime()) % ENERGY_CONSTANTS.REGEN_INTERVAL;
        const timeToNextRegen = ENERGY_CONSTANTS.REGEN_INTERVAL - timeSinceLastRegen;
        timeToFullEnergy = timeToNextRegen + (energyNeeded - 1) * ENERGY_CONSTANTS.REGEN_INTERVAL;
      }

      return {
        currentEnergy,
        maxEnergy: userEnergy.max_energy,
        nextRegenTime,
        timeToFullEnergy,
      };
    } catch (error) {
      this.logger.error(`Failed to get energy status for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Consume energy (for playing games)
   */
  async consumeEnergy(userId: string, amount: number = 1): Promise<EnergyStatus> {
    try {
      if (amount <= 0) {
        throw new BadRequestException('Energy amount must be positive');
      }

      return await this.prisma.$transaction(async (tx) => {
        // Get current energy status
        const energyStatus = await this.getEnergyStatus(userId);

        if (energyStatus.currentEnergy < amount) {
          throw new BadRequestException('Insufficient energy');
        }

        // Update energy
        const newEnergy = energyStatus.currentEnergy - amount;
        await tx.user_energy.update({
          where: { user_id: this.safeToBigInt(userId) },
          data: {
            current_energy: newEnergy,
            last_update: new Date(),
          },
        });

        this.logger.log(`User ${userId} consumed ${amount} energy, remaining: ${newEnergy}`);

        // Return updated status
        return await this.getEnergyStatus(userId);
      });
    } catch (error) {
      this.logger.error(`Failed to consume energy for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Refill energy with points
   */
  async refillEnergy(userId: string, energyAmount: number): Promise<{ success: boolean; pointsCost: number; newEnergy: number; error?: string }> {
    try {
      const POINTS_PER_ENERGY = 10; // Cost: 10 points per energy
      const pointsCost = energyAmount * POINTS_PER_ENERGY;

      return await this.prisma.$transaction(async (tx) => {
        // Get user data
        const user = await tx.users.findUnique({
          where: { telegram_id: this.safeToBigInt(userId) },
          select: { total_points: true },
        });

        if (!user) {
          throw new BadRequestException('User not found');
        }

        if (Number(user.total_points) < pointsCost) {
          return {
            success: false,
            pointsCost,
            newEnergy: 0,
            error: 'Insufficient points',
          };
        }

        // Get current energy
        const energyStatus = await this.getEnergyStatus(userId);
        const maxRefill = energyStatus.maxEnergy - energyStatus.currentEnergy;

        if (energyAmount > maxRefill) {
          return {
            success: false,
            pointsCost,
            newEnergy: energyStatus.currentEnergy,
            error: `Can only refill ${maxRefill} energy`,
          };
        }

        // Update user points
        await tx.users.update({
          where: { telegram_id: this.safeToBigInt(userId) },
          data: {
            total_points: { decrement: pointsCost },
            updated_at: new Date(),
          },
        });

        // Update energy
        const newEnergy = energyStatus.currentEnergy + energyAmount;
        await tx.user_energy.update({
          where: { user_id: this.safeToBigInt(userId) },
          data: {
            current_energy: newEnergy,
            last_update: new Date(),
          },
        });

        this.logger.log(`User ${userId} refilled ${energyAmount} energy for ${pointsCost} points`);

        return {
          success: true,
          pointsCost,
          newEnergy,
        };
      });
    } catch (error) {
      this.logger.error(`Failed to refill energy for user ${userId}`, error);
      throw error;
    }
  }
}