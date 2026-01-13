export declare class GameController {
    private contractService;
    constructor();
    /**
     * Initialize the game controller
     */
    initialize(): Promise<void>;
    /**
     * Example: Start a new quest
     */
    startQuest(playerId: string, questId: number): Promise<any>;
    /**
     * Example: Complete a quest
     */
    completeQuest(playerId: string, questId: number): Promise<any>;
    /**
     * Example: Get player stats
     */
    getPlayerStats(playerId: string): Promise<any>;
    /**
     * Example: Get quest status
     */
    getQuestStatus(questId: number): Promise<any>;
    /**
     * Get account balance
     */
    getBalance(address?: string): Promise<any>;
    /**
     * Check transaction status
     */
    checkTransaction(txHash: string): Promise<any>;
}
//# sourceMappingURL=GameController.d.ts.map