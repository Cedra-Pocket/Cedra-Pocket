import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'rewards',
      },
      {
        name: 'blockchain',
      },
      {
        name: 'payout',
      },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}