import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('test/auth')
  async testAuth() {
    // Tạo mock initData để test
    const mockInitData = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22username%22%3A%22testuser%22%7D&auth_date=1640995200&hash=test_hash';
    
    return {
      message: 'Test authentication endpoint',
      mockInitData: mockInitData,
      instructions: [
        '1. Copy mockInitData value',
        '2. POST to /auth/verify with {"initData": "copied_value"}',
        '3. Use returned JWT token for protected endpoints'
      ],
      example: {
        url: 'POST /auth/verify',
        body: {
          initData: mockInitData
        }
      }
    };
  }

  @Get('test/quests')
  async getTestQuests() {
    const quests = await this.prisma.quests.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });

    return {
      message: 'Test endpoint - quests without authentication',
      count: quests.length,
      quests: quests.map(quest => ({
        id: quest.id,
        title: quest.title,
        description: quest.description,
        type: quest.type,
        category: quest.category,
        reward_amount: quest.reward_amount,
        reward_type: quest.reward_type,
      })),
    };
  }
}