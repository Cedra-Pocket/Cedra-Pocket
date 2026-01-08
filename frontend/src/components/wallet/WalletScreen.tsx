'use client';

import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { backendAPI } from '../../services/backend-api.service';

export function WalletScreen() {
  const { user, setUser } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(user?.walletAddress || null);
  const [inputWalletId, setInputWalletId] = useState('');
  const [connectStatus, setConnectStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Get balance from user data (from backend)
  const tokenBalance = user?.tokenBalance || 0;

  const handleTestConnect = async () => {
    if (!inputWalletId.trim()) {
      setConnectStatus('error');
      setStatusMessage('Please enter a wallet ID');
      return;
    }

    setIsConnecting(true);
    setConnectStatus('idle');
    setStatusMessage('');

    try {
      if (backendAPI.isAuthenticated()) {
        const updatedUser = await backendAPI.connectWallet(inputWalletId.trim());
        setWalletAddress(updatedUser.wallet_address);
        // Update local user state
        if (user) {
          setUser({ ...user, walletAddress: updatedUser.wallet_address || undefined });
        }
        setConnectStatus('success');
        setStatusMessage('Wallet connected successfully!');
      } else {
        // Not authenticated - just save locally
        setWalletAddress(inputWalletId.trim());
        if (user) {
          setUser({ ...user, walletAddress: inputWalletId.trim() });
        }
        setConnectStatus('success');
        setStatusMessage('Wallet saved locally (not authenticated)');
      }
      setInputWalletId('');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnectStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    if (user) {
      setUser({ ...user, walletAddress: undefined });
    }
    setConnectStatus('idle');
    setStatusMessage('');
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
          <div className="flex flex-col gap-2">
            <div
              className="w-full flex items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                ✓ Connected: {walletAddress.length > 20 
                  ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-6)}`
                  : walletAddress}
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full transition-all hover:opacity-80"
              style={{
                background: 'rgba(239, 68, 68, 0.8)',
                borderRadius: '8px',
                padding: '10px',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Wallet ID Input */}
            <input
              type="text"
              value={inputWalletId}
              onChange={(e) => setInputWalletId(e.target.value)}
              placeholder="Enter wallet address..."
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(0, 136, 204, 0.3)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0088CC'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 136, 204, 0.3)'}
            />

            {/* Test Connect Button */}
            <button
              onClick={handleTestConnect}
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
                {isConnecting ? 'CONNECTING...' : 'TEST CONNECT'}
              </span>
            </button>

            {/* Status Message */}
            {statusMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: connectStatus === 'success' 
                    ? 'rgba(34, 197, 94, 0.2)' 
                    : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${connectStatus === 'success' ? '#22c55e' : '#ef4444'}`,
                }}
              >
                <span style={{ 
                  fontSize: '13px', 
                  color: connectStatus === 'success' ? '#16a34a' : '#dc2626',
                  fontWeight: '500'
                }}>
                  {statusMessage}
                </span>
              </div>
            )}
          </div>
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
        Enter your wallet address to connect and withdraw earnings
      </p>
    </div>
  );
}

export default WalletScreen;
