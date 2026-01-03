import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { VerifyQuestDto } from './dto/verify-quest.dto';
import { QuestType, QuestStatus } from '../common/types/quest.types';
import { SocialService } from '../social/social.service';
import { RewardsService } from '../rewards/rewards.service';

@Injectable()
export class QuestsService {
  constructor(
    private prisma: PrismaService,
    private socialService: SocialService,
    private rewardsService: RewardsService,
  ) {}

  async create(createQuestDto: CreateQuestDto) {
    return this.prisma.quests.create({
      data: {
        title: createQuestDto.title,
        description: createQuestDto.description,
        type: createQuestDto.type,
        category: createQuestDto.category,
        config: createQuestDto.config || {},
        reward_amount: createQuestDto.reward_amount,
        reward_type: createQuestDto.reward_type || 'POINT',
        frequency: createQuestDto.frequency || 'ONCE',
        is_active: true,
      },
    });
  }

  async findAll(userId?: string) {
    const quests = await this.prisma.quests.findMany({
      where: { is_active: true },
      include: {
        user_quests: userId ? {
          where: { user_id: BigInt(userId) },
        } : false,
      },
      orderBy: { created_at: 'desc' },
    });

    // Transform to include user status
    return quests.map(quest => ({
      ...quest,
      user_status: quest.user_quests?.[0]?.status || 'NOT_STARTED',
      user_completed_at: quest.user_quests?.[0]?.completed_at,
      user_claimed_at: quest.user_quests?.[0]?.claimed_at,
    }));
  }

  async findOne(id: string) {
    const quest = await this.prisma.quests.findUnique({
      where: { id: parseInt(id) },
    });

    if (!quest) {
      throw new NotFoundException('Quest not found');
    }

    return quest;
  }

  async verifyQuest(questId: string, userId: string, verifyQuestDto: VerifyQuestDto) {
    const quest = await this.findOne(questId);
    
    // Check if user already completed this quest
    const existingUserQuest = await this.prisma.user_quests.findFirst({
      where: {
        user_id: BigInt(userId),
        quest_id: parseInt(questId),
      },
    });

    if (existingUserQuest?.status === QuestStatus.COMPLETED) {
      throw new BadRequestException('Quest already completed');
    }

    // Create or update user quest record
    const userQuest = await this.prisma.user_quests.upsert({
      where: {
        id: existingUserQuest?.id || BigInt(0),
      },
      update: {
        status: QuestStatus.PENDING,
        proof_data: verifyQuestDto.proof_data,
      },
      create: {
        user_id: BigInt(userId),
        quest_id: parseInt(questId),
        status: QuestStatus.PENDING,
        proof_data: verifyQuestDto.proof_data,
      },
    });

    // Handle verification based on quest type
    if (quest.type === QuestType.SOCIAL) {
      return this.verifySocialQuest(quest, userId, userQuest);
    } else if (quest.type === QuestType.ONCHAIN) {
      return this.verifyOnchainQuest(quest, userId, userQuest);
    }

    throw new BadRequestException('Invalid quest type');
  }

  private async verifySocialQuest(quest: any, userId: string, userQuest: any) {
    try {
      const isValid = await this.socialService.verifyTask(quest.config, userId);
      
      if (isValid) {
        // Update quest status to completed
        await this.prisma.user_quests.update({
          where: { id: userQuest.id },
          data: {
            status: QuestStatus.COMPLETED,
            completed_at: new Date(),
          },
        });

        // Queue reward processing
        await this.rewardsService.queueReward(userId, quest);

        return { success: true, message: 'Quest completed successfully!' };
      } else {
        await this.prisma.user_quests.update({
          where: { id: userQuest.id },
          data: { status: QuestStatus.FAILED },
        });

        return { success: false, message: 'Quest verification failed' };
      }
    } catch (error) {
      await this.prisma.user_quests.update({
        where: { id: userQuest.id },
        data: { status: QuestStatus.FAILED },
      });

      throw new BadRequestException('Quest verification failed');
    }
  }

  private async verifyOnchainQuest(quest: any, userId: string, userQuest: any) {
    // For onchain quests, we queue the verification job
    // The actual verification will be done by blockchain worker
    
    // Queue blockchain verification job
    // This will be implemented in blockchain module
    
    return { 
      success: true, 
      message: 'Quest verification queued. Please wait for confirmation.' 
    };
  }

  async update(id: string, updateQuestDto: UpdateQuestDto) {
    return this.prisma.quests.update({
      where: { id: parseInt(id) },
      data: updateQuestDto,
    });
  }

  async remove(id: string) {
    return this.prisma.quests.update({
      where: { id: parseInt(id) },
      data: { is_active: false },
    });
  }
}