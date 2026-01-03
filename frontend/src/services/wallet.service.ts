/**
 * Wallet Service
 * Provides Web3 wallet connection via WalletConnect/Web3Modal
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import type { WalletState } from '../models';

/**
 * Connection change callback type
 */
export type ConnectionChangeCallback = (connected: boolean, address?: string) => void;

/**
 * Wallet service interface
 */
export interface IWalletService {
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  getAddress(): string | null;
  isConnected(): boolean;
  getState(): WalletState;
  onConnectionChange(callback: ConnectionChangeCallback): () => void;
}

/**
 * Wallet connection error
 */
export class WalletConnectionError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'WalletConnectionError';
  }
}

/**
 * Wallet service implementation
 * Uses wagmi and Web3Modal for wallet connections
 */
export class WalletService implements IWalletService {
  private state: WalletState = {
    connected: false,
    connecting: false,
  };
  
  private connectionCallbacks: Set<ConnectionChangeCallback> = new Set();

  /**
   * Get current wallet state
   */
  getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Update internal state and notify listeners
   */
  private updateState(updates: Partial<WalletState>): void {
    const wasConnected = this.state.connected;
    const previousAddress = this.state.address;
    
    this.state = { ...this.state, ...updates };
    
    // Notify listeners if connection state changed
    if (wasConnected !== this.state.connected || previousAddress !== this.state.address) {
      this.notifyConnectionChange();
    }
  }

  /**
   * Notify all registered callbacks of connection change
   */
  private notifyConnectionChange(): void {
    this.connectionCallbacks.forEach((callback) => {
      try {
        callback(this.state.connected, this.state.address);
      } catch (error) {
        console.error('WalletService: Error in connection change callback', error);
      }
    });
  }

  /**
   * Connect wallet
   * Requirements: 10.1, 10.2
   * @returns Connected wallet address
   * @throws WalletConnectionError if connection fails
   */
  async connect(): Promise<string> {
    if (this.state.connecting) {
      throw new WalletConnectionError('Connection already in progress');
    }

    if (this.state.connected && this.state.address) {
      return this.state.address;
    }

    this.updateState({ connecting: true, error: undefined });

    try {
      // In a real implementation, this would use wagmi's connect function
      // For now, we provide a stub that can be integrated with wagmi hooks
      // The actual connection will be handled by Web3Modal UI components
      
      // This is a placeholder - actual implementation requires wagmi config
      // and will be triggered by Web3Modal's connect button
      throw new WalletConnectionError(
        'Wallet connection must be initiated through Web3Modal UI. ' +
        'Use the useConnect hook from wagmi in your React components.'
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.updateState({
        connecting: false,
        connected: false,
        error: errorMessage,
      });
      throw error instanceof WalletConnectionError 
        ? error 
        : new WalletConnectionError(errorMessage, error instanceof Error ? error : undefined);
    }
  }

  /**
   * Handle successful connection (called from wagmi hooks)
   * Requirements: 10.2, 10.3
   */
  handleConnected(address: string, chainId?: number): void {
    this.updateState({
      connected: true,
      connecting: false,
      address,
      chainId,
      error: undefined,
    });
  }

  /**
   * Handle connection error (called from wagmi hooks)
   * Requirements: 10.4
   */
  handleError(error: Error): void {
    this.updateState({
      connected: false,
      connecting: false,
      error: error.message,
    });
  }

  /**
   * Disconnect wallet
   * Requirements: 10.5
   */
  async disconnect(): Promise<void> {
    // In a real implementation, this would use wagmi's disconnect function
    // For now, we just clear the state
    this.updateState({
      connected: false,
      connecting: false,
      address: undefined,
      chainId: undefined,
      error: undefined,
    });
  }

  /**
   * Handle disconnection (called from wagmi hooks)
   * Requirements: 10.5
   */
  handleDisconnected(): void {
    this.updateState({
      connected: false,
      connecting: false,
      address: undefined,
      chainId: undefined,
      error: undefined,
    });
  }

  /**
   * Get connected wallet address
   * @returns Address or null if not connected
   */
  getAddress(): string | null {
    return this.state.address ?? null;
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.state.connected;
  }

  /**
   * Register callback for connection state changes
   * @param callback - Function to call when connection state changes
   * @returns Unsubscribe function
   */
  onConnectionChange(callback: ConnectionChangeCallback): () => void {
    this.connectionCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  /**
   * Truncate address for display
   * @param address - Full wallet address
   * @param startChars - Number of characters to show at start
   * @param endChars - Number of characters to show at end
   */
  static truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
    if (address.length <= startChars + endChars) {
      return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }
}

// Default singleton instance
export const walletService = new WalletService();
