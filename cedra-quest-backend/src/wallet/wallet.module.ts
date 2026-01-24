import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletNameService } from './wallet-name.service';
import { WalletController } from './wallet.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [WalletController],
  providers: [WalletService, WalletNameService],
  exports: [WalletService, WalletNameService],
})
export class WalletModule {}