export declare class CedraContractService {
    private client;
    private account;
    constructor();
    /**
     * Initialize connection to Cedra blockchain
     */
    initialize(): Promise<void>;
    /**
     * Call a function on the CedraMiniApp contract
     */
    callContractFunction(functionName: string, args?: any[], typeArgs?: string[]): Promise<any>;
    /**
     * Read data from the contract (view function)
     */
    viewContractFunction(functionName: string, args?: any[], typeArgs?: string[]): Promise<any>;
    /**
     * Get account balance
     */
    getAccountBalance(address?: string): Promise<string>;
    /**
     * Get transaction status
     */
    getTransactionStatus(txHash: string): Promise<any>;
}
//# sourceMappingURL=CedraContractService.d.ts.map