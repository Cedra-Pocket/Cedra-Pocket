import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}