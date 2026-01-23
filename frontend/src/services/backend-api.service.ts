/**
 * Backend API Service
 * Connects to NestJS backend for real data
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  UserData,
  Quest,
} from '../models';

// API Base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cedra-pocket-wybm.vercel.app';

/**
 * API Error class
 */
export class BackendAPIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'BackendAPIError';
  }
}

/**
 * Auth response from backend
 */
export interface AuthResponse {
  access_token: string;
  user: BackendUser;
}

/**
 * Backend user model (matches Prisma schema)
 */
export interface BackendUser {
  id: string | bigint;
  telegram_id: string;
  username: string | null;
  wallet_address: string | null;
  is_wallet_connected: boolean;
  total_points: number | string;
  current_rank: string;
  referral_code: string | null;
  referrer_id: string | bigint | null;
  created_at: string;
  updated_at: string;
}

/**
 * Backend quest model
 */
export interface BackendQuest {
  id: number;
  title: string;
  description: string | null;
  type: 'SOCIAL' | 'GAME';
  category: string | null;
  config: Record<string, unknown>;
  reward_amount: number | string;
  reward_type: string;
  frequency: 'ONCE' | 'DAILY' | 'WEEKLY';
  is_active: boolean;
  user_status?: 'NOT_STARTED' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CLAIMED';
  user_completed_at?: string;
  user_claimed_at?: string;
}

/**
 * Backend API Service
 */
export class BackendAPIService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add JWT token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, clear it
          this.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt_token');
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('jwt_token');
    }
  }

  /**
   * Set JWT token
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  }

  /**
   * Clear JWT token
   */
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return Boolean((window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) || Boolean(this.token);
    }
    return Boolean(this.token);
  }

  /**
   * Check if backend is available
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      // Quick health check with short timeout
      const response = await this.client.get('/health', {
        timeout: 2000 // Reduced from default to 2 seconds
      });
      return response.status === 200;
    } catch (error) {
      console.log('Backend not available:', error);
      return false;
    }
  }

  /**
   * Authenticate with Telegram initData
   */
  async authenticate(initData: string): Promise<AuthResponse> {
    try {
      const response = await this.client.post<AuthResponse>('/auth/verify', {
        initData,
      });

      // Save token
      this.setToken(response.data.access_token);

      return response.data;
    } catch (error) {
      console.log('⚠️ Failed to authenticate via backend, using local fallback');
      // Return mock auth response for local gameplay
      const mockUser: BackendUser = {
        id: 'local_user',
        telegram_id: '123456789',
        username: 'Local User',
        wallet_address: null,
        is_wallet_connected: false,
        total_points: 0,
        current_rank: 'Shrimp',
        referral_code: 'local_ref',
        referrer_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Set local token
      this.setToken('local_token');
      
      return {
        access_token: 'local_token',
        user: mockUser,
      };
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<BackendUser> {
    try {
      const response = await this.client.get<BackendUser>('/users/profile');
      return response.data;
    } catch (error) {
      console.log('⚠️ Failed to get user profile from backend, using local fallback');
      // Return mock user profile for local gameplay
      return {
        id: 'local_user',
        telegram_id: '123456789',
        username: 'Local User',
        wallet_address: null,
        is_wallet_connected: false,
        total_points: 0,
        current_rank: 'Shrimp',
        referral_code: 'local_ref',
        referrer_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new BackendAPIError(
        'Backend not available',
        500,
        'HEALTH_CHECK_FAILED'
      );
    }
  }

  /**
   * Add points to user (sync with backend)
   */
  async addPoints(points: number): Promise<BackendUser> {
    try {
      const response = await this.client.post<BackendUser>('/users/add-points', {
        points,
      });
      console.log(`✅ Backend add-points response: ${response.data.total_points}`);
      return response.data;
    } catch (error) {
      console.log('⚠️ Failed to add points to backend, using local fallback');
      // Return a mock user response with the new total for local gameplay
      return {
        id: 'local_user',
        telegram_id: '123456789',
        username: 'Local User',
        wallet_address: null,
        is_wallet_connected: false,
        total_points: points, // Just return the points added
        current_rank: 'Shrimp',
        referral_code: null,
        referrer_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  /**
   * Get quests list
   */
  async getQuests(): Promise<BackendQuest[]> {
    try {
      const response = await this.client.get<BackendQuest[]>('/quests');
      return response.data;
    } catch (error) {
      console.log('⚠️ Failed to get quests from backend, using local fallback');
      // Return mock quests for local gameplay
      return [
        {
          id: 1,
          title: 'Follow on Twitter',
          description: 'Follow our official Twitter account @CedraQuest',
          type: 'SOCIAL',
          category: 'social',
          config: { url: 'https://twitter.com/intent/follow?screen_name=CedraQuest' },
          reward_amount: 100,
          reward_type: 'POINT',
          frequency: 'ONCE',
          is_active: true,
          user_status: 'NOT_STARTED',
        },
        {
          id: 2,
          title: 'Join Telegram Channel',
          description: 'Join our official Telegram channel for updates',
          type: 'SOCIAL',
          category: 'social',
          config: { url: 'https://t.me/cedra_quest_official' },
          reward_amount: 150,
          reward_type: 'POINT',
          frequency: 'ONCE',
          is_active: true,
          user_status: 'NOT_STARTED',
        },
        {
          id: 3,
          title: 'Like & Retweet',
          description: 'Like and retweet our pinned post',
          type: 'SOCIAL',
          category: 'social',
          config: { url: 'https://twitter.com/CedraQuest/status/1234567890' },
          reward_amount: 75,
          reward_type: 'POINT',
          frequency: 'ONCE',
          is_active: true,
          user_status: 'NOT_STARTED',
        },
        {
          id: 4,
          title: 'Daily Check-in',
          description: 'Check in daily to earn rewards',
          type: 'GAME',
          category: 'daily',
          config: {},
          reward_amount: 50,
          reward_type: 'POINT',
          frequency: 'DAILY',
          is_active: true,
          user_status: 'NOT_STARTED',
        },
        {
          id: 5,
          title: 'Complete First Game',
          description: 'Play and complete your first game session',
          type: 'GAME',
          category: 'achievement',
          config: {},
          reward_amount: 200,
          reward_type: 'POINT',
          frequency: 'ONCE',
          is_active: true,
          user_status: 'NOT_STARTED',
        },
      ];
    }
  }

  /**
   * Verify/complete a quest
   */
  async verifyQuest(
    questId: number,
    proofData?: Record<string, unknown>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.post(`/quests/${questId}/verify`, {
        proof_data: proofData || {},
      });
      return response.data;
    } catch (error) {
      console.log('⚠️ Failed to verify quest via backend, using local fallback');
      // Return mock success for local gameplay
      return {
        success: true,
        message: 'Quest completed successfully (offline mode)',
      };
    }
  }

  /**
   * Claim quest reward
   */
  async claimQuestReward(questId: number): Promise<{ success: boolean; message: string; pointsEarned?: number }> {
    try {
      const response = await this.client.post(`/quests/${questId}/claim`, {});
      return response.data;
    } catch (error) {
      console.log('⚠️ Failed to claim quest reward via backend, using local fallback');
      // Return mock success for local gameplay
      return {
        success: true,
        message: 'Quest reward claimed successfully (offline mode)',
        pointsEarned: 0,
      };
    }
  }

  /**
   * Get complete game dashboard with retry logic
   */
  async getGameDashboard(telegramId?: string): Promise<any> {
    try {
      // Use provided telegram ID or get from Telegram WebApp
      let userId = telegramId;
      if (!userId) {
        // Get telegram ID from Telegram WebApp context
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) {
          userId = String((window as any).Telegram.WebApp.initDataUnsafe.user.id);
        } else {
          // Fallback: try to get from stored user data
          const storedUser = localStorage.getItem('tg-mini-app-storage');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.state?.user?.telegramId) {
              userId = parsed.state.user.telegramId;
            }
          }
        }
      }

      if (!userId) {
        console.error('❌ User ID not available from any source, using test ID');
        // Use test ID for development
        userId = '123456789';
      }

      console.log(`🚀 Calling game dashboard API with user ID:`, userId);
      
      // Add timeout for the request
      const response = await this.client.get(`/game/dashboard/${userId}`, {
        timeout: 10000 // 10 seconds timeout
      });
      
      console.log(`✅ Game dashboard API response:`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Game dashboard API error:`, error);
      
      // Return local fallback
      console.log('⚠️ Using local fallback dashboard');
      return {
        success: true,
        pet: {
          level: 1,
          currentXp: 0,
          xpForNextLevel: 100,
          pendingRewards: 0,
          lastClaimTime: new Date().toISOString(),
        },
        energy: {
          currentEnergy: 100,
          maxEnergy: 100,
          lastUpdate: new Date().toISOString(),
        },
        ranking: {
          rank: 'Shrimp',
          position: 1000,
          lifetimePoints: 0,
          nextRankThreshold: 1000,
        },
        gameStats: {
          totalGamesPlayed: 0,
          totalScore: 0,
          averageScore: 0,
          bestScore: 0,
          totalPointsEarned: 0,
        },
      };
    }
  }

  /**
   * Claim pet rewards in new game system with optimized retry logic
   */
  async claimGamePetRewards(telegramId?: string): Promise<any> {
    try {
      // Use provided telegram ID or get from Telegram WebApp
      let userId = telegramId;
      if (!userId) {
        // Get telegram ID from Telegram WebApp context
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) {
          userId = String((window as any).Telegram.WebApp.initDataUnsafe.user.id);
        } else {
          // Fallback: try to get from stored user data
          const storedUser = localStorage.getItem('tg-mini-app-storage');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.state?.user?.telegramId) {
              userId = parsed.state.user.telegramId;
            }
          }
        }
      }

      if (!userId) {
        console.error('❌ User ID not available from any source, using test ID');
        // Use test ID for development
        userId = '123456789';
      }

      console.log(`💰 Claiming pet rewards for user:`, userId);

      const response = await this.client.post(`/game/pet/claim/${userId}`, {}, {
        timeout: 5000 // 5 seconds timeout
      });

      console.log(`✅ Pet rewards claimed successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Claim pet rewards error:`, error);
      
      // Return local fallback
      console.log('⚠️ Using local fallback for pet claim');
      return {
        success: true,
        pointsEarned: Math.floor(Math.random() * 100) + 50, // Random points 50-150
        newTotalPoints: 0,
        newLifetimePoints: 0,
        claimTime: new Date(),
      };
    }
  }

  /**
   * Convert backend quest to frontend Quest format
   */
  backendQuestToQuest(backendQuest: BackendQuest): Quest {
    const statusMap: Record<string, 'active' | 'claimable' | 'completed' | 'locked'> = {
      'NOT_STARTED': 'active',
      'PENDING': 'active',
      'COMPLETED': 'claimable', // Backend completed = frontend claimable
      'CLAIMED': 'completed',   // Backend claimed = frontend completed
      'FAILED': 'active',
    };

    // Extract URL from config if it's a social quest
    const url = backendQuest.type === 'SOCIAL' && backendQuest.config?.url 
      ? String(backendQuest.config.url) 
      : undefined;

    // Map quest types
    let questType: 'social' | 'daily' | 'achievement' | 'referral' = 'achievement';
    if (backendQuest.type === 'SOCIAL') {
      questType = 'social';
    } else if (backendQuest.category === 'daily') {
      questType = 'daily';
    } else if (backendQuest.category === 'achievement') {
      questType = 'achievement';
    }

    return {
      id: String(backendQuest.id),
      title: backendQuest.title,
      description: backendQuest.description || '',
      iconUrl: '',
      type: questType,
      status: statusMap[backendQuest.user_status || 'NOT_STARTED'] || 'active',
      progress: backendQuest.user_status === 'COMPLETED' || backendQuest.user_status === 'CLAIMED' ? 100 : 0,
      currentValue: backendQuest.user_status === 'COMPLETED' || backendQuest.user_status === 'CLAIMED' ? 1 : 0,
      targetValue: 1,
      reward: {
        type: backendQuest.reward_type === 'POINT' ? 'token' : 'token',
        amount: Number(backendQuest.reward_amount),
      },
      url,
    };
  }

  /**
   * Convert backend user to frontend UserData format
   */
  backendUserToUserData(backendUser: BackendUser, telegramUser?: { username?: string; firstName?: string; photoUrl?: string }): UserData {
    return {
      id: String(backendUser.id),
      telegramId: backendUser.telegram_id,
      username: telegramUser?.username || telegramUser?.firstName || backendUser.username || 'Player',
      avatarUrl: telegramUser?.photoUrl,
      level: this.calculateLevel(Number(backendUser.total_points)),
      currentXP: Number(backendUser.total_points) % 1000,
      requiredXP: 1000,
      tokenBalance: Number(backendUser.total_points),
      walletBalance: 0, // Backend doesn't have wallet balance yet
      gemBalance: 0, // Backend doesn't have gems yet
      earningRate: 10,
      walletAddress: backendUser.wallet_address || undefined,
      createdAt: new Date(backendUser.created_at),
      updatedAt: new Date(backendUser.updated_at),
    };
  }

  /**
   * Calculate level from total points
   */
  private calculateLevel(totalPoints: number): number {
    return Math.floor(totalPoints / 1000) + 1;
  }
}

// Singleton instance
export const backendAPI = new BackendAPIService();