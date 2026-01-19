import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class TelegramAuthDto {
  @IsString()
  @IsNotEmpty()
  initData: string;
}

export class WalletCreationDto {
  @IsString()
  @IsNotEmpty()
  telegram_id: string;

  @IsString()
  @IsNotEmpty()
  requested_address: string;

  @IsString()
  @IsNotEmpty()
  public_key: string;
}

export class WalletRecoveryDto {
  @IsString()
  @IsNotEmpty()
  public_key: string;
}