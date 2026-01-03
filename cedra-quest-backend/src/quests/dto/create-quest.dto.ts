import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsObject } from 'class-validator';
import { QuestType, QuestFrequency, RewardType } from '../../common/types/quest.types';

export class CreateQuestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(QuestType)
  type: QuestType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsObject()
  @IsOptional()
  config?: any;

  @IsNumber()
  reward_amount: number;

  @IsEnum(RewardType)
  @IsOptional()
  reward_type?: RewardType;

  @IsEnum(QuestFrequency)
  @IsOptional()
  frequency?: QuestFrequency;
}