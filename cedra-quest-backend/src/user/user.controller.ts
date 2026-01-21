import { Controller, Get, Post, Body, Param, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  /**
   * Get user profile
   * GET /users/profile/:telegramId
   */
  @Get('profile/:telegramId')
  async getUserProfile(@Param('telegramId') telegramId: string) {
    this.logger.log(`Getting profile for user: ${telegramId}`);
    const profile = await this.userService.getUserProfile(telegramId);
    
    if (!profile) {
      return { error: 'User not found' };
    }
    
    return profile;
  }

  /**
   * Add points to user
   * POST /users/add-points
   */
  @Post('add-points')
  @HttpCode(HttpStatus.OK)
  async addPoints(@Body() body: { points: number; telegramId?: string }) {
    const { points, telegramId } = body;
    
    // For now, we'll get telegramId from request body or use a default
    // In production, this should come from JWT token
    const userId = telegramId || '123456789'; // Default test user
    
    this.logger.log(`Adding ${points} points to user: ${userId}`);
    
    const result = await this.userService.addPoints(userId, points);
    
    this.logger.log(`Points added successfully. New total: ${result.total_points}`);
    
    return result;
  }

  /**
   * Get user profile (for authenticated requests)
   * GET /users/profile
   */
  @Get('profile')
  async getProfile() {
    // For now, return default user profile
    // In production, get user ID from JWT token
    const telegramId = '123456789';
    
    this.logger.log(`Getting profile for authenticated user: ${telegramId}`);
    const profile = await this.userService.getUserProfile(telegramId);
    
    if (!profile) {
      return { error: 'User not found' };
    }
    
    return profile;
  }
}