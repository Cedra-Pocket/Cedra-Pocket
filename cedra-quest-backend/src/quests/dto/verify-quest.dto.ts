import { IsOptional, IsObject } from 'class-validator';

export class VerifyQuestDto {
  @IsObject()
  @IsOptional()
  proof_data?: any;
}