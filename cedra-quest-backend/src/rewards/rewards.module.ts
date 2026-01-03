import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsProcessor } from './rewards.processor';
import { UsersModule } from '../users/users.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule, UsersModule],
  providers: [RewardsService, RewardsProcessor],
  exports: [RewardsService],
})
export class RewardsModule {}