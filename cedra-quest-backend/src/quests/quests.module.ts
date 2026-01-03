import { Module } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { SocialModule } from '../social/social.module';
import { RewardsModule } from '../rewards/rewards.module';

@Module({
  imports: [SocialModule, RewardsModule],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}