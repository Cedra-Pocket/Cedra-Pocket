import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RewardType } from '../common/types/quest.types';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    @InjectQueue('rewards') private rewardsQueue: Queue,
    @InjectQueue('payout') private payoutQueue: Queue,
  ) {}

  async queueReward(userId: string, quest: any) {
    await this.rewardsQueue.add('process-reward', {
      userId,
      questId: quest.id,
      rewardType: quest.reward_type,
      rewardAmount: quest.reward_amount,
    });
  }

  async processReward(data: {
    userId: string;
    questId: number;
    rewardType: string;
    rewardAmount: number;
  }) {
    try {
      if (data.rewardType === RewardType.POINT) {
        // Add points directly to user
        await this.usersService.addPoints(BigInt(data.userId), data.rewardAmount);
        
        this.logger.log(`Added ${data.rewardAmount} points to user ${data.userId}`);
      } else if (data.rewardType === RewardType.TOKEN || data.rewardType === RewardType.NFT) {
        // Queue for blockchain payout
        await this.payoutQueue.add('process-payout', {
          userId: data.userId,
          questId: data.questId,
          rewardType: data.rewardType,
          rewardAmount: data.rewardAmount,
        });
      }

      // Update quest claim status
      await this.prisma.user_quests.updateMany({
        where: {
          user_id: BigInt(data.userId),
          quest_id: data.questId,
        },
        data: {
          claimed_at: new Date(),
        },
      });

    } catch (error) {
      this.logger.error(`Reward processing failed: ${error.message}`);
      throw error;
    }
  }
}