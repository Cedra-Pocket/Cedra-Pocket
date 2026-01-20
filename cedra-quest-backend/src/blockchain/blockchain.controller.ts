import { Controller, Get, Post, Body, Param, Query, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { 
  InitializeTreasuryDto, 
  DepositTreasuryDto, 
  InitializeRewardsDto, 
  ClaimRewardDto, 
  SetRewardsPauseDto 
} from './dto/blockchain.dto';

@Controller('blockchain')
export class BlockchainController {
  private readonly logger = new Logger(BlockchainController.name);

  constructor(private blockchainService: BlockchainService) {}

  /**
   * Treasury Management Endpoints
   */

  @Post('treasury/initialize')
  @HttpCode(HttpStatus.OK)
  async initializeTreasury(@Body() dto: InitializeTreasuryDto) {
    this.logger.log('Initialize treasury request');
    
    try {
      const result = await this.blockchainService.initializeTreasury(dto.seed);
      return {
        success: true,
        transactionHash: result.hash,
        message: 'Treasury initialized successfully'
      };
    } catch (error) {
      this.logger.error('Treasury initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('treasury/deposit')
  @HttpCode(HttpStatus.OK)
  async depositToTreasury(@Body() dto: DepositTreasuryDto) {
    this.logger.log(`Deposit to treasury: ${dto.amount}`);
    
    try {
      const result = await this.blockchainService.depositToTreasury(dto.amount);
      return {
        success: true,
        transactionHash: result.hash,
        message: `Deposited ${dto.amount} to treasury successfully`
      };
    } catch (error) {
      this.logger.error('Treasury deposit failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('treasury/balance/:adminAddress?')
  async getTreasuryBalance(@Param('adminAddress') adminAddress?: string) {
    this.logger.log(`Get treasury balance for admin: ${adminAddress || 'default'}`);
    
    try {
      const result = await this.blockchainService.getTreasuryBalance(adminAddress);
      return {
        success: true,
        balance: result.data[0] || "0"
      };
    } catch (error) {
      this.logger.error('Treasury balance query failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('treasury/status/:adminAddress?')
  async getTreasuryStatus(@Param('adminAddress') adminAddress?: string) {
    this.logger.log(`Get treasury status for admin: ${adminAddress || 'default'}`);
    
    try {
      const [isInitialized, balance] = await Promise.all([
        this.blockchainService.isTreasuryInitialized(adminAddress),
        this.blockchainService.getTreasuryBalance(adminAddress)
      ]);

      return {
        success: true,
        data: {
          initialized: isInitialized.data[0] || false,
          balance: balance.data[0] || "0"
        }
      };
    } catch (error) {
      this.logger.error('Treasury status query failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Rewards Management Endpoints
   */

  @Post('rewards/initialize')
  @HttpCode(HttpStatus.OK)
  async initializeRewards(@Body() dto: InitializeRewardsDto) {
    this.logger.log('Initialize rewards system');
    
    try {
      const result = await this.blockchainService.initializeRewards(dto.serverPublicKey);
      return {
        success: true,
        transactionHash: result.hash,
        message: 'Rewards system initialized successfully'
      };
    } catch (error) {
      this.logger.error('Rewards initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('rewards/claim')
  @HttpCode(HttpStatus.OK)
  async claimReward(@Body() dto: ClaimRewardDto) {
    this.logger.log(`Claim reward for user: ${dto.userAddress}, amount: ${dto.amount}`);
    
    try {
      const result = await this.blockchainService.claimReward(
        dto.userAddress,
        dto.adminAddress || process.env.CEDRA_ADMIN_ADDRESS || '',
        dto.amount,
        dto.nonce,
        dto.signature
      );

      return {
        success: true,
        transactionHash: result.hash,
        message: `Reward of ${dto.amount} claimed successfully`,
        data: {
          recipient: dto.userAddress,
          amount: dto.amount,
          nonce: dto.nonce
        }
      };
    } catch (error) {
      this.logger.error('Reward claim failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('rewards/nonce/:nonce/:adminAddress?')
  async checkNonce(
    @Param('nonce') nonce: string,
    @Param('adminAddress') adminAddress?: string
  ) {
    const nonceNumber = parseInt(nonce);
    this.logger.log(`Check nonce: ${nonceNumber} for admin: ${adminAddress || 'default'}`);
    
    try {
      const admin = adminAddress || process.env.CEDRA_ADMIN_ADDRESS || '';
      const result = await this.blockchainService.isNonceUsed(admin, nonceNumber);

      return {
        success: true,
        data: {
          nonce: nonceNumber,
          used: result.data[0] || false
        }
      };
    } catch (error) {
      this.logger.error('Nonce check failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('rewards/status/:adminAddress?')
  async getRewardsStatus(@Param('adminAddress') adminAddress?: string) {
    this.logger.log(`Get rewards status for admin: ${adminAddress || 'default'}`);
    
    try {
      const admin = adminAddress || process.env.CEDRA_ADMIN_ADDRESS || '';
      const [isInitialized, isPaused] = await Promise.all([
        this.blockchainService.isRewardsInitialized(admin),
        this.blockchainService.isRewardsPaused(admin)
      ]);

      return {
        success: true,
        data: {
          initialized: isInitialized.data[0] || false,
          paused: isPaused.data[0] || false
        }
      };
    } catch (error) {
      this.logger.error('Rewards status query failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('rewards/pause')
  @HttpCode(HttpStatus.OK)
  async setRewardsPause(@Body() dto: SetRewardsPauseDto) {
    this.logger.log(`Set rewards pause: ${dto.paused} for admin: ${dto.adminAddress || 'default'}`);
    
    try {
      const admin = dto.adminAddress || process.env.CEDRA_ADMIN_ADDRESS || '';
      const result = await this.blockchainService.setRewardsPause(admin, dto.paused);

      return {
        success: true,
        transactionHash: result.hash,
        message: `Rewards system ${dto.paused ? 'paused' : 'unpaused'} successfully`
      };
    } catch (error) {
      this.logger.error('Set rewards pause failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Account Management Endpoints
   */

  @Get('account/:address/balance')
  async getAccountBalance(@Param('address') address: string) {
    this.logger.log(`Get account balance for: ${address}`);
    
    try {
      const balance = await this.blockchainService.getAccountBalance(address);
      return {
        success: true,
        balance: balance
      };
    } catch (error) {
      this.logger.error('Account balance query failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('status')
  async getConnectionStatus() {
    this.logger.log('Get blockchain connection status');
    
    try {
      const status = this.blockchainService.getConnectionStatus();
      return {
        success: true,
        ...status
      };
    } catch (error) {
      this.logger.error('Status check failed:', error);
      return {
        success: false,
        connected: false,
        error: error.message
      };
    }
  }
}