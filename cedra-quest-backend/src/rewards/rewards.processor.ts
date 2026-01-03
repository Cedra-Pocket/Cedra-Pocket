import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { RewardsService } from './rewards.service';
import { Logger } from '@nestjs/common';

@Processor('rewards')
export class RewardsProcessor {
  private readonly logger = new Logger(RewardsProcessor.name);

  constructor(private rewardsService: RewardsService) {}

  @Process('process-reward')
  async handleReward(job: Job) {
    this.logger.log(`Processing reward job ${job.id}`);
    
    try {
      await this.rewardsService.processReward(job.data);
      this.logger.log(`Reward job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Reward job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}