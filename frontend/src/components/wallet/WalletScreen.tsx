'use client';

import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { backendAPI } from '../../services/backend-api.service';

export function WalletScreen() {
  const { user, setUser } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(user?.walletAddress || null);

  // Get balance from user data (from backend)
  const tokenBalance = user?.tokenBalance || 0;

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual TON wallet connection
      // For now, simulate wallet connection
      const mockWalletAddress = '0x' + Math.random().toString(16).slice(2, 42);
      
      if (backendAPI.isAuthenticated()) {
        const updatedUser = await backendAPI.connectWallet(mockWalletAddress);
        setWalletAddress(updatedUser.wallet_address);
        // Update local user state
        if (user) {
          setUser({ ...user, walletAddress: updatedUser.wallet_address || undefined });
        }
      } else {
        setWalletAddress(mockWalletAddress);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full items-center" style={{ paddingTop: '80px', backgroundColor: 'transparent' }}>
      {/* Title */}
      <h1 
        className="font-bold mb-8"
        style={{ fontSize: '24px', color: '#1a1a2e' }}
      >
        Your balance
      </h1>

      {/* Balance Card */}
      <div 
        style={{
          width: '90%',
          maxWidth: '380px',
          background: 'linear-gradient(135deg, #ffffff, #e8dcc8)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* USDT Balance Row */}
        <div 
          className="flex items-center gap-3 mb-4"
          style={{
            background: 'linear-gradient(90deg, #6a7080, #2a2f3a)',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>
            {tokenBalance.toLocaleString()}
          </span>
          <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>points</span>
        </div>

        {/* Wallet Status */}
        {walletAddress ? (
          <div
            className="w-full flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
              ✓ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #0088CC, #00AAFF)',
              borderRadius: '12px',
              padding: '16px 20px',
              border: 'none',
              cursor: isConnecting ? 'wait' : 'pointer',
            }}
          >
            <div 
              className="flex items-center justify-center"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
              }}
            >
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>💎</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.5px' }}>
              {isConnecting ? 'CONNECTING...' : 'CONNECT TON WALLET'}
            </span>
          </button>
        )}
      </div>

      {/* Token Balance Section */}
      <div 
        style={{
          width: '90%',
          maxWidth: '380px',
          marginTop: '24px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '16px',
          padding: '20px',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '32px' }}>🪙</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>Game Coins</span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
            {user?.tokenBalance.toLocaleString('fr-FR').replace(/\s/g, ' ') || '0'}
          </span>
        </div>
      </div>

      {/* Info Text */}
      <p 
        className="text-center mt-6"
        style={{ 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: '14px',
          maxWidth: '300px'
        }}
      >
        Connect your TON wallet to withdraw earnings and trade tokens
      </p>
    </div>
  );
}

export default WalletScreen;
