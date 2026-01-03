import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(private configService: ConfigService) {}

  async sendNotification(telegramId: string, message: string) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    
    if (!botToken) {
      this.logger.error('Bot token not configured');
      return;
    }

    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: telegramId,
        text: message,
        parse_mode: 'HTML',
      });

      this.logger.log(`Notification sent to user ${telegramId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }
  }

  async sendQuestCompletedNotification(telegramId: string, questTitle: string, reward: string) {
    const message = `
🎉 <b>Quest Completed!</b>

✅ <b>${questTitle}</b>
🎁 Reward: <b>${reward}</b>

Keep up the great work! 🚀
    `;

    await this.sendNotification(telegramId, message);
  }

  async sendWelcomeMessage(telegramId: string, referralCode: string) {
    const message = `
🎮 <b>Welcome to Cedra Quest!</b>

Your referral code: <code>${referralCode}</code>

Start completing quests to earn rewards! 🎁
    `;

    await this.sendNotification(telegramId, message);
  }
}