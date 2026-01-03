import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  telegram_id: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  wallet_address?: string;

  @IsBoolean()
  @IsOptional()
  is_wallet_connected?: boolean;

  @IsString()
  @IsOptional()
  referrer_id?: string;
}
