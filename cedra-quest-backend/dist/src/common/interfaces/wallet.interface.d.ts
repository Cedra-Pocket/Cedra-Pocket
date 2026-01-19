export interface WalletCreationData {
    telegram_id: string;
    requested_address: string;
    public_key: string;
}
export interface WalletCreationResult {
    success: boolean;
    wallet_address?: string;
    transaction_hash?: string;
    error?: string;
}
export interface OnChainWalletData {
    wallet_address: string;
    public_key: string;
    owner_telegram_id: string;
}
export interface UserWalletMapping {
    telegram_id: string;
    wallet_address: string;
    public_key: string;
}
export interface WalletInfo {
    address: string;
    public_key: string;
    balance: string;
    transaction_count: number;
    created_at: Date;
    is_active: boolean;
}
