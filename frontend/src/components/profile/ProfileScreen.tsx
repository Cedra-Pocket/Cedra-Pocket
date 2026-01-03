'use client';

import { useUser, useWallet, useWalletActions } from '../../store/useAppStore';
import { ProfileHeader } from './ProfileHeader';
import { LevelProgress } from './LevelProgress';
import { WalletStatus } from './WalletStatus';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export interface ProfileScreenProps {
  className?: string;
}

/**
 * ProfileScreen component
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 * - Integrate ProfileHeader, LevelProgress, WalletStatus
 * - Connect to store and wallet service
 * - Handle wallet connection flow
 */
export function ProfileScreen({ className = '' }: ProfileScreenProps) {
  const user = useUser();
  const wallet = useWallet();
  const { setWallet } = useWalletActions();

  const handleConnect = async () => {
    // Set connecting state
    setWallet({ connecting: true, error: undefined });

    try {
      // In a real implementation, this would trigger Web3Modal
      // For now, we simulate the connection flow
      // The actual connection will be handled by wagmi hooks in production
      
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, simulate a successful connection
      // In production, this would be handled by wagmi's useConnect hook
      setWallet({
        connected: true,
        connecting: false,
        address: '0x1234567890abcdef1234567890abcdef12345678',
        error: undefined,
      });
    } catch (error) {
      setWallet({
        connecting: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      });
    }
  };

  const handleDisconnect = async () => {
    // Clear wallet state
    setWallet({
      connected: false,
      connecting: false,
      address: undefined,
      chainId: undefined,
      error: undefined,
    });
  };

  // Loading state
  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {/* Profile Header */}
      <ProfileHeader
        avatarUrl={user.avatarUrl}
        username={user.username}
        telegramId={user.telegramId}
      />

      {/* Level Progress */}
      <LevelProgress
        level={user.level}
        currentXP={user.currentXP}
        requiredXP={user.requiredXP}
      />

      {/* Wallet Status */}
      <WalletStatus
        connected={wallet.connected}
        address={wallet.address}
        connecting={wallet.connecting}
        error={wallet.error}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}

export default ProfileScreen;
