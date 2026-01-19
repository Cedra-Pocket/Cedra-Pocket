export interface TelegramInitData {
    telegram_id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    auth_date: number;
    hash: string;
    query_id?: string;
}
export interface TelegramUser {
    id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
}
export interface UserStatus {
    exists: boolean;
    userInfo?: UserInfo;
    suggestedName?: string;
}
export interface UserInfo {
    telegram_id: string;
    wallet_address: string;
    username?: string;
    total_points: number;
    level: number;
    current_xp: number;
    current_rank: string;
    created_at: Date;
}
export interface AuthenticationResult {
    success: boolean;
    user?: UserInfo;
    suggestedWalletName?: string;
    error?: string;
}
