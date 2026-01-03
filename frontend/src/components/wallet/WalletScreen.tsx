'use client';

import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function WalletScreen() {
  const { user } = useAppStore();
  const [isConnected, setIsConnected] = useState(false);
  const usdtBalance = 0.20; // Mock USDT balance

  const handleConnectWallet = () => {
    // TODO: Implement TON wallet connection
    setIsConnected(true);
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
            ${usdtBalance.toFixed(2)}
          </span>
          <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>in</span>
          {/* USDT Icon */}
          <div 
            className="flex items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#26A17B',
            }}
          >
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>₮</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>USDT</span>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={handleConnectWallet}
          className="w-full flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #0088CC, #00AAFF)',
            borderRadius: '12px',
            padding: '16px 20px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {/* TON Icon */}
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
            CONNECT TON WALLET
          </span>
        </button>
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
