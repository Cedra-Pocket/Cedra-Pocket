import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletNameService } from './wallet-name.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [WalletService, WalletNameService],
  exports: [WalletService, WalletNameService],
})
export class WalletModule {}