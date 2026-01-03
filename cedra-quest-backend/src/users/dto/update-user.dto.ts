import { IsString, IsOptional, IsBoolean, IsDecimal } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  wallet_address?: string;

  @IsBoolean()
  @IsOptional()
  is_wallet_connected?: boolean;

  @IsDecimal()
  @IsOptional()
  total_points?: number;

  @IsString()
  @IsOptional()
  current_rank?: string;
}
