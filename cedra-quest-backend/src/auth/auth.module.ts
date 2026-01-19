import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TelegramAuthService } from './telegram-auth.service';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [UserModule, WalletModule],
  providers: [AuthService, TelegramAuthService],
  controllers: [AuthController],
  exports: [AuthService, TelegramAuthService],
})
export class AuthModule {}