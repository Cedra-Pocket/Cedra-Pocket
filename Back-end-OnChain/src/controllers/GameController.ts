import { CedraContractService } from '../services/CedraContractService';

export class GameController {
    private contractService: CedraContractService;

    constructor() {
        this.contractService = new CedraContractService();
    }

    /**
     * Initialize the game controller
     */
    async initialize(): Promise<void> {
        await this.contractService.initialize();
    }

    /**
     * Treasury Management
     */

    /**
     * Initialize treasury system
     */
    async initializeTreasury(seed?: string): Promise<any> {
        try {
            const result = await this.contractService.initializeTreasury(seed);
            return {
                success: true,
                transactionHash: result.hash,
                message: 'Treasury initialized successfully'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Deposit funds to treasury
     */
    async depositToTreasury(amount: number): Promise<any> {
        try {
            const result = await this.contractService.depositToTreasury(amount);
            return {
                success: true,
                transactionHash: result.hash,
                message: `Deposited ${amount} to treasury successfully`
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Get treasury balance
     */
    async getTreasuryBalance(adminAddress?: string): Promise<any> {
        try {
            const result = await this.contractService.getTreasuryBalance(adminAddress);
            return {
                success: true,
                balance: result.data[0] || "0"
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Check treasury status
     */
    async getTreasuryStatus(adminAddress?: string): Promise<any> {
        try {
            const isInitialized = await this.contractService.isTreasuryInitialized(adminAddress);
            const balance = await this.contractService.getTreasuryBalance(adminAddress);

            return {
                success: true,
                data: {
                    initialized: isInitialized.data[0] || false,
                    balance: balance.data[0] || "0"
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Rewards Management
     */

    /**
     * Initialize rewards system
     */
    async initializeRewards(serverPublicKey: string): Promise<any> {
        try {
            const result = await this.contractService.initializeRewards(serverPublicKey);
            return {
                success: true,
                transactionHash: result.hash,
                message: 'Rewards system initialized successfully'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Claim reward for user
     */
    async claimReward(
        userAddress: string,
        amount: number,
        nonce: number,
        signature: string,
        adminAddress?: string
    ): Promise<any> {
        try {
            const admin = adminAddress || process.env.ADMIN_ADDRESS || '';
            const result = await this.contractService.claimReward(
                userAddress,
                admin,
                amount,
                nonce,
                signature
            );

            return {
                success: true,
                transactionHash: result.hash,
                message: `Reward of ${amount} claimed successfully`,
                data: {
                    recipient: userAddress,
                    amount,
                    nonce
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Check if nonce is already used
     */
    async checkNonce(nonce: number, adminAddress?: string): Promise<any> {
        try {
            const admin = adminAddress || process.env.ADMIN_ADDRESS || '';
            const result = await this.contractService.isNonceUsed(admin, nonce);

            return {
                success: true,
                data: {
                    nonce,
                    used: result.data[0] || false
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Get rewards system status
     */
    async getRewardsStatus(adminAddress?: string): Promise<any> {
        try {
            const admin = adminAddress || process.env.ADMIN_ADDRESS || '';
            const isInitialized = await this.contractService.isRewardsInitialized(admin);
            const isPaused = await this.contractService.isRewardsPaused(admin);

            return {
                success: true,
                data: {
                    initialized: isInitialized.data[0] || false,
                    paused: isPaused.data[0] || false
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Set rewards system pause status (admin only)
     */
    async setRewardsPause(paused: boolean, adminAddress?: string): Promise<any> {
        try {
            const admin = adminAddress || process.env.ADMIN_ADDRESS || '';
            const result = await this.contractService.setRewardsPause(admin, paused);

            return {
                success: true,
                transactionHash: result.hash,
                message: `Rewards system ${paused ? 'paused' : 'unpaused'} successfully`
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Get account balance
     */
    async getBalance(address?: string): Promise<any> {
        try {
            const balance = await this.contractService.getAccountBalance(address);

            return {
                success: true,
                balance: balance
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Check transaction status
     */
    async checkTransaction(txHash: string): Promise<any> {
        try {
            const status = await this.contractService.getTransactionStatus(txHash);

            return {
                success: true,
                status: status
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}