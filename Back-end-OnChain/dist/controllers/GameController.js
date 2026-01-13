"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const CedraContractService_1 = require("../services/CedraContractService");
class GameController {
    constructor() {
        this.contractService = new CedraContractService_1.CedraContractService();
    }
    /**
     * Initialize the game controller
     */
    async initialize() {
        await this.contractService.initialize();
    }
    /**
     * Example: Start a new quest
     */
    async startQuest(playerId, questId) {
        try {
            const result = await this.contractService.callContractFunction('start_quest', [playerId, questId]);
            return {
                success: true,
                transactionHash: result.hash,
                message: 'Quest started successfully'
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Example: Complete a quest
     */
    async completeQuest(playerId, questId) {
        try {
            const result = await this.contractService.callContractFunction('complete_quest', [playerId, questId]);
            return {
                success: true,
                transactionHash: result.hash,
                message: 'Quest completed successfully'
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Example: Get player stats
     */
    async getPlayerStats(playerId) {
        try {
            const stats = await this.contractService.viewContractFunction('get_player_stats', [playerId]);
            return {
                success: true,
                data: stats
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Example: Get quest status
     */
    async getQuestStatus(questId) {
        try {
            const status = await this.contractService.viewContractFunction('get_quest_status', [questId]);
            return {
                success: true,
                data: status
            };
        }
        catch (error) {
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
    async getBalance(address) {
        try {
            const balance = await this.contractService.getAccountBalance(address);
            return {
                success: true,
                balance: balance
            };
        }
        catch (error) {
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
    async checkTransaction(txHash) {
        try {
            const status = await this.contractService.getTransactionStatus(txHash);
            return {
                success: true,
                status: status
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}
exports.GameController = GameController;
//# sourceMappingURL=GameController.js.map