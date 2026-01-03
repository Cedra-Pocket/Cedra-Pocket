import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyAuthDto {
  @IsString()
  @IsNotEmpty()
  initData: string;
}