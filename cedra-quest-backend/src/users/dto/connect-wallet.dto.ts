import { IsString, IsNotEmpty } from 'class-validator';

export class ConnectWalletDto {
  @IsString()
  @IsNotEmpty()
  wallet_address: string;
}