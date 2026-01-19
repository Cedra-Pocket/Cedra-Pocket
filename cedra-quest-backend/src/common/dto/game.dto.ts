import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FeedPetDto {
  @IsNumber()
  @Min(1)
  @Max(30)
  feedCount: number;
}

export class GameSessionStartDto {
  @IsString()
  @IsNotEmpty()
  gameType: string;
}

export class GameSessionCompleteDto {
  @IsString()
  @IsNotEmpty()
  gameType: string;

  @IsNumber()
  @Min(0)
  score: number;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(300)
  duration?: number;
}

export class RefillEnergyDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  energyAmount: number;
}

export class LeaderboardQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}

export class CreateCycleDto {
  @IsNumber()
  @Min(1)
  cycleNumber: number;

  @IsNumber()
  @Min(0.01)
  @Max(10)
  growthRate: number;

  @IsNumber()
  @Min(0.1)
  @Max(100)
  maxSpeedCap: number;

  @IsString()
  @IsNotEmpty()
  startDate: string; // ISO date string

  @IsString()
  @IsNotEmpty()
  endDate: string; // ISO date string
}