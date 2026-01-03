import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
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
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Redis Queue configuration
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
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
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
