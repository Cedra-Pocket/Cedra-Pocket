import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestsModule } from './quests/quests.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { SocialModule } from './social/social.module';
import { RewardsModule } from './rewards/rewards.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    QuestsModule,
    BlockchainModule,
    SocialModule,
    RewardsModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
