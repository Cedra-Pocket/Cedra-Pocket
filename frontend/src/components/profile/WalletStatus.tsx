'use client';

import { GlassCard } from '../shared/GlassCard';
import { GradientButton } from '../shared/GradientButton';
import { WalletService } from '../../services/wallet.service';

export interface WalletStatusProps {
  connected: boolean;
  address?: string;
  connecting?: boolean;
  error?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

/**
 * WalletStatus component
 * Requirements: 6.3, 6.4, 6.5
 * - Show connect button when disconnected
 * - Display truncated address when connected
 * - Handle connect/disconnect actions
 */
export function WalletStatus({
  connected,
  address,
  connecting = false,
  error,
  onConnect,
  onDisconnect,
  className = '',
}: WalletStatusProps) {
  const truncatedAddress = address 
    ? WalletService.truncateAddress(address) 
    : '';

  return (
    <GlassCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide">
          Wallet
        </h3>
        {connected && (
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Connected
          </span>
        )}
      </div>

      {connected && address ? (
        /* Connected state */
        <div className="space-y-4">
          {/* Address display */}
          <div className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="font-mono text-sm text-white">
              {truncatedAddress}
            </span>
          </div>

          {/* Disconnect button */}
          <GradientButton
            variant="secondary"
            onClick={onDisconnect}
            className="w-full"
          >
            Disconnect Wallet
          </GradientButton>
        </div>
      ) : (
        /* Disconnected state */
        <div className="space-y-4">
          {/* Status message */}
          <p className="text-center text-sm text-text-muted">
            Connect your wallet to receive token and NFT rewards
          </p>

          {/* Error message */}
          {error && (
            <p className="text-center text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Connect button */}
          <GradientButton
            variant="primary"
            onClick={onConnect}
            loading={connecting}
            className="w-full"
          >
            Connect Wallet
          </GradientButton>
        </div>
      )}
    </GlassCard>
  );
}

export default WalletStatus;
