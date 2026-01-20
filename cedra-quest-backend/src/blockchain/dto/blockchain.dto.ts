import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class InitializeTreasuryDto {
  @IsOptional()
  @IsString()
  seed?: string = "cedra_gamefi_treasury_v1";
}

export class DepositTreasuryDto {
  @IsNumber()
  @Min(1)
  amount: number;
}

export class InitializeRewardsDto {
  @IsString()
  @IsNotEmpty()
  serverPublicKey: string;
}

export class ClaimRewardDto {
  @IsString()
  @IsNotEmpty()
  userAddress: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  @Min(0)
  nonce: number;

  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsOptional()
  @IsString()
  adminAddress?: string;
}

export class SetRewardsPauseDto {
  @IsBoolean()
  paused: boolean;

  @IsOptional()
  @IsString()
  adminAddress?: string;
}