'use client';

import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { backendAPI } from '../../services/backend-api.service';

export function WalletScreen() {
  const { user, setUser } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [inputWalletId, setInputWalletId] = useState(user?.walletAddress || '');
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
        // Update local user state
        if (user) {
          setUser({ ...user, walletAddress: updatedUser.wallet_address || undefined });
        }
        setConnectStatus('success');
        setStatusMessage('Wallet connected successfully!');
      } else {
        // Not authenticated - just save locally
        if (user) {
          setUser({ ...user, walletAddress: inputWalletId.trim() });
        }
        setConnectStatus('success');
        setStatusMessage('Wallet saved locally (not authenticated)');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnectStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full items-center" style={{ paddingTop: 'clamp(20px, 5vw, 32px)', backgroundColor: 'transparent', paddingBottom: 'clamp(60px, 16vw, 80px)' }}>
      {/* Title */}
      <h1 
        className="font-bold"
        style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', color: '#1a1a2e', marginBottom: 'clamp(12px, 3vw, 20px)' }}
      >
        Your balance
      </h1>

      {/* Balance Card */}
      <div 
        style={{
          width: '90%',
          maxWidth: 'clamp(260px, 72vw, 320px)',
          background: 'linear-gradient(135deg, #ffffff, #e8dcc8)',
          borderRadius: 'clamp(10px, 2.5vw, 14px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: 'clamp(10px, 2.5vw, 14px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* USDT Balance Row */}
        <div 
          className="flex items-center"
          style={{
            background: 'linear-gradient(90deg, #6a7080, #2a2f3a)',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 16px)',
            gap: 'clamp(8px, 2vw, 12px)',
          }}
        >
          <span style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: '700', color: '#ffffff' }}>
            {tokenBalance.toLocaleString()}
          </span>
          <span style={{ fontSize: 'clamp(12px, 3vw, 15px)', color: '#ffffff', fontWeight: '500' }}>points</span>
        </div>
      </div>

      {/* Wallet Connect Card */}
      <div 
        style={{
          width: '90%',
          maxWidth: 'clamp(260px, 72vw, 320px)',
          marginTop: 'clamp(10px, 2.5vw, 14px)',
          background: 'linear-gradient(135deg, #ffffff, #e8dcc8)',
          borderRadius: 'clamp(10px, 2.5vw, 14px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: 'clamp(10px, 2.5vw, 14px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex flex-col" style={{ gap: 'clamp(8px, 2vw, 12px)' }}>
          {/* Wallet ID Input */}
          <input
            type="text"
            value={inputWalletId}
            onChange={(e) => setInputWalletId(e.target.value)}
            placeholder="Enter wallet address..."
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 16px)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              border: '2px solid rgba(0, 136, 204, 0.3)',
              background: 'rgba(255, 255, 255, 0.9)',
              fontSize: 'clamp(12px, 3vw, 15px)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#0088CC'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 136, 204, 0.3)'}
          />

          {/* Buttons Row */}
          <div className="flex" style={{ gap: 'clamp(6px, 1.5vw, 10px)' }}>
            {/* Test Connect Button */}
            <button
              onClick={handleTestConnect}
              disabled={isConnecting || !inputWalletId.trim()}
              className="flex-1 flex items-center justify-center transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #0088CC, #00AAFF)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(10px, 2.5vw, 14px) clamp(8px, 2vw, 12px)',
                border: 'none',
                cursor: isConnecting || !inputWalletId.trim() ? 'not-allowed' : 'pointer',
                gap: 'clamp(4px, 1vw, 8px)',
              }}
            >
              <span style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>💎</span>
              <span style={{ fontSize: 'clamp(12px, 3vw, 15px)', fontWeight: '700', color: '#ffffff' }}>
                {isConnecting ? 'TESTING...' : 'TEST'}
              </span>
            </button>

            {/* Confirm Address Button */}
            <button
              onClick={handleTestConnect}
              disabled={isConnecting || !inputWalletId.trim()}
              className="flex-1 flex items-center justify-center transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(10px, 2.5vw, 14px) clamp(8px, 2vw, 12px)',
                border: 'none',
                cursor: isConnecting || !inputWalletId.trim() ? 'not-allowed' : 'pointer',
                gap: 'clamp(4px, 1vw, 8px)',
              }}
            >
              <span style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>✓</span>
              <span style={{ fontSize: 'clamp(12px, 3vw, 15px)', fontWeight: '700', color: '#ffffff' }}>
                CONFIRM
              </span>
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              style={{
                padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2.5vw, 14px)',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                background: connectStatus === 'success' 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${connectStatus === 'success' ? '#22c55e' : '#ef4444'}`,
              }}
            >
              <span style={{ 
                fontSize: 'clamp(11px, 2.8vw, 14px)', 
                color: connectStatus === 'success' ? '#16a34a' : '#dc2626',
                fontWeight: '500'
              }}>
                {statusMessage}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Token Balance Section */}
      <div 
        style={{
          width: '90%',
          maxWidth: 'clamp(260px, 72vw, 320px)',
          marginTop: 'clamp(12px, 3vw, 18px)',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: 'clamp(10px, 2.5vw, 14px)',
          padding: 'clamp(10px, 2.5vw, 14px)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'clamp(8px, 2vw, 12px)' }}>
            <span style={{ fontSize: 'clamp(20px, 5.5vw, 26px)' }}>🪙</span>
            <span style={{ fontSize: 'clamp(14px, 3.5vw, 17px)', fontWeight: '600', color: '#ffffff' }}>Game Coins</span>
          </div>
          <span style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '700', color: '#ffffff' }}>
            {user?.tokenBalance.toLocaleString('fr-FR').replace(/\s/g, ' ') || '0'}
          </span>
        </div>
      </div>

      {/* Info Text */}
      <p 
        className="text-center"
        style={{ 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: 'clamp(12px, 3vw, 15px)',
          maxWidth: 'clamp(220px, 65vw, 280px)',
          marginTop: 'clamp(12px, 3vw, 18px)'
        }}
      >
        Enter your wallet address to connect and withdraw earnings
      </p>
    </div>
  );
}

export default WalletScreen;
