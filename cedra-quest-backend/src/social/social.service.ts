import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SocialQuestConfig } from '../common/types/quest.types';

@Injectable()
export class SocialService {
  private readonly logger = new Logger(SocialService.name);

  constructor(private configService: ConfigService) {}

  async verifyTask(config: SocialQuestConfig, userId: string): Promise<boolean> {
    try {
      switch (config.platform) {
        case 'telegram':
          return this.verifyTelegramTask(config, userId);
        case 'twitter':
          return this.verifyTwitterTask(config, userId);
        default:
          return false;
      }
    } catch (error) {
      this.logger.error(`Social verification failed: ${error.message}`);
      return false;
    }
  }

  private async verifyTelegramTask(config: SocialQuestConfig, userId: string): Promise<boolean> {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    
    if (!botToken || !config.target_id) {
      return false;
    }

    try {
      switch (config.action) {
        case 'join_channel':
        case 'join_group':
          return this.checkTelegramMembership(botToken, config.target_id, userId);
        default:
          return false;
      }
    } catch (error) {
      this.logger.error(`Telegram verification failed: ${error.message}`);
      return false;
    }
  }

  private async checkTelegramMembership(botToken: string, chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${botToken}/getChatMember`,
        {
          params: {
            chat_id: chatId,
            user_id: userId,
          },
        }
      );

      if (response.data.ok) {
        const status = response.data.result.status;
        return ['member', 'administrator', 'creator'].includes(status);
      }

      return false;
    } catch (error) {
      this.logger.error(`Telegram membership check failed: ${error.message}`);
      return false;
    }
  }

  private async verifyTwitterTask(config: SocialQuestConfig, userId: string): Promise<boolean> {
    // Twitter API verification would go here
    // For now, return true as placeholder
    // You would need to implement Twitter API integration
    
    this.logger.warn('Twitter verification not implemented yet');
    return true; // Placeholder
  }
}