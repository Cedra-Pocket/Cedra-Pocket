/**
 * Wallet-related data models
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

/**
 * Web3 wallet connection state
 */
export interface WalletState {
  connected: boolean;
  address?: string;
  chainId?: number;
  connecting: boolean;
  error?: string;
}
