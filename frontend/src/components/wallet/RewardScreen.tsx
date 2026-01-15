'use client';

import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function RewardScreen() {
  const { user } = useAppStore();
  const [walletAddress, setWalletAddress] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<{
    userAddress: string;
    amount: number;
    nonce: number;
    signature: string;
    adminAddress: string;
  } | null>(null);

  // Get balance from user data
  const pointBalance = user?.tokenBalance || 0;
  const tokenBalance = 0; // Token balance (to be implemented)
  
  // Exchange rate: 1000 points = 1 token
  const EXCHANGE_RATE = 1000;
  const maxTokens = Math.floor(pointBalance / EXCHANGE_RATE);

  const handleClaimReward = () => {
    if (!walletAddress.trim()) {
      alert('Please enter your wallet address');
      return;
    }
    
    if (maxTokens <= 0) {
      alert('Not enough points to claim reward');
      return;
    }

    // Generate ticket data (in real app, this would come from backend with signature)
    const ticket = {
      userAddress: walletAddress.trim(),
      amount: maxTokens,
      nonce: Date.now(),
      signature: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      adminAddress: '0x1234567890abcdef1234567890abcdef12345678',
    };

    setTicketData(ticket);
    setShowTicket(true);
  };

  return (
    <div 
      className="flex flex-col items-center hide-scrollbar" 
      style={{ 
        paddingTop: 'clamp(12px, 3vw, 18px)', 
        backgroundColor: 'transparent',
        height: 'calc(100vh - clamp(56px, 14vw, 72px))',
        overflowY: 'auto',
        paddingBottom: 'clamp(60px, 16vw, 80px)'
      }}
    >
      {/* Title */}
      <h1 
        className="font-bold text-center"
        style={{ fontSize: 'var(--fs-lg)', color: '#fff', marginBottom: 'clamp(16px, 4vw, 24px)', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
      >
        Reward
      </h1>

      {/* Balance Cards Container */}
      <div 
        className="flex w-full justify-center"
        style={{ gap: 'clamp(10px, 2.5vw, 14px)', padding: '0 clamp(12px, 3vw, 16px)' }}
      >
        {/* Points Card */}
        <div 
          className="flex-1 flex flex-col items-center"
          style={{
            maxWidth: 'clamp(140px, 40vw, 170px)',
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: 'clamp(14px, 3.5vw, 20px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <span style={{ fontSize: 'var(--fs-2xl)' }}>🪙</span>
          <span style={{ fontSize: 'var(--fs-xl)', fontWeight: '700', color: '#1e3a5f', marginTop: 'clamp(6px, 1.5vw, 10px)' }}>
            {pointBalance.toLocaleString()}
          </span>
          <span style={{ fontSize: 'var(--fs-xs)', color: '#1e3a5f', opacity: 0.7, marginTop: 'clamp(2px, 0.5vw, 4px)' }}>
            Points
          </span>
        </div>

        {/* Token Card */}
        <div 
          className="flex-1 flex flex-col items-center"
          style={{
            maxWidth: 'clamp(140px, 40vw, 170px)',
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: 'clamp(14px, 3.5vw, 20px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <span style={{ fontSize: 'var(--fs-2xl)' }}>💎</span>
          <span style={{ fontSize: 'var(--fs-xl)', fontWeight: '700', color: '#1e3a5f', marginTop: 'clamp(6px, 1.5vw, 10px)' }}>
            {tokenBalance.toLocaleString()}
          </span>
          <span style={{ fontSize: 'var(--fs-xs)', color: '#1e3a5f', opacity: 0.7, marginTop: 'clamp(2px, 0.5vw, 4px)' }}>
            Tokens
          </span>
        </div>
      </div>

      {/* Exchange Section */}
      <div 
        className="w-full flex flex-col items-center"
        style={{ marginTop: 'clamp(20px, 5vw, 30px)', padding: '0 clamp(16px, 4vw, 24px)' }}
      >
        {/* Wallet Address Input */}
        <div 
          style={{
            width: '100%',
            maxWidth: 'clamp(280px, 80vw, 340px)',
            marginBottom: 'clamp(12px, 3vw, 16px)',
          }}
        >
          <label style={{ fontSize: 'var(--fs-xs)', color: '#fff', marginBottom: 'clamp(4px, 1vw, 6px)', display: 'block' }}>
            Wallet Address
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter your wallet address (0x...)"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 14px)',
              borderRadius: 'clamp(10px, 2.5vw, 14px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              fontSize: 'var(--fs-sm)',
              color: '#1e3a5f',
              outline: 'none',
            }}
          />
        </div>

        {/* Exchange Info */}
        <div 
          className="flex items-center justify-center"
          style={{ marginBottom: 'clamp(12px, 3vw, 16px)', gap: 'clamp(6px, 1.5vw, 10px)' }}
        >
          <span style={{ fontSize: 'var(--fs-sm)', color: '#fff', fontWeight: '600' }}>
            {pointBalance.toLocaleString()} 🪙
          </span>
          <span style={{ fontSize: 'var(--fs-sm)', color: '#fff' }}>→</span>
          <span style={{ fontSize: 'var(--fs-sm)', color: '#fff', fontWeight: '600' }}>
            {maxTokens} 💎
          </span>
        </div>

        {/* Claim Reward Button */}
        <button
          onClick={handleClaimReward}
          disabled={maxTokens <= 0 || !walletAddress.trim()}
          className="transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          style={{
            marginBottom: 'clamp(16px, 4vw, 24px)',
            width: '100%',
            maxWidth: 'clamp(280px, 80vw, 340px)',
            background: (maxTokens > 0 && walletAddress.trim())
              ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
              : 'linear-gradient(135deg, #6b7280, #4b5563)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            padding: 'clamp(12px, 3vw, 16px)',
            border: 'none',
            cursor: (maxTokens <= 0 || !walletAddress.trim()) ? 'not-allowed' : 'pointer',
            boxShadow: (maxTokens > 0 && walletAddress.trim())
              ? '0 4px 15px rgba(34, 197, 94, 0.4)' 
              : '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ fontSize: 'var(--fs-base)', fontWeight: '700', color: '#fff' }}>
            Claim Reward
          </span>
        </button>

        {/* Ticket Visual - Shows after claiming */}
        {showTicket && ticketData && (
          <div 
            style={{
              width: '100%',
              maxWidth: 'clamp(280px, 80vw, 340px)',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              borderRadius: 'clamp(14px, 3.5vw, 18px)',
              padding: 'clamp(14px, 3.5vw, 20px)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(255, 165, 0, 0.4)',
            }}
          >
            {/* Ticket decorations - circles on sides */}
            <div 
              style={{
                position: 'absolute',
                left: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(100,180,220,0.5)',
              }}
            />
            <div 
              style={{
                position: 'absolute',
                right: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(100,180,220,0.5)',
              }}
            />

            {/* Ticket Content */}
            <div className="flex flex-col relative" style={{ zIndex: 1 }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: '#8B4513', opacity: 0.9, letterSpacing: '2px', fontWeight: '700', textAlign: 'center', marginBottom: 'clamp(12px, 3vw, 16px)' }}>
                REWARD TICKET
              </span>
              
              {/* Ticket Info Fields */}
              <div className="flex flex-col" style={{ gap: 'clamp(10px, 2.5vw, 14px)' }}>
                {/* User Address */}
                <div style={{ 
                  background: 'rgba(139, 69, 19, 0.1)', 
                  borderRadius: 'clamp(8px, 2vw, 10px)', 
                  padding: 'clamp(8px, 2vw, 12px)' 
                }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: '#8B4513', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    User Address
                  </span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: '#5D3A1A', fontWeight: '700', fontFamily: 'monospace', wordBreak: 'break-all', display: 'block' }}>
                    {ticketData.userAddress}
                  </span>
                </div>
                
                {/* Amount & Nonce Row */}
                <div className="flex" style={{ gap: 'clamp(8px, 2vw, 12px)' }}>
                  <div style={{ 
                    flex: 1,
                    background: 'rgba(139, 69, 19, 0.1)', 
                    borderRadius: 'clamp(8px, 2vw, 10px)', 
                    padding: 'clamp(8px, 2vw, 12px)',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: 'var(--fs-xs)', color: '#8B4513', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                      Amount
                    </span>
                    <span style={{ fontSize: 'var(--fs-sm)', color: '#5D3A1A', fontWeight: '700' }}>
                      {ticketData.amount} Token{ticketData.amount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={{ 
                    flex: 1,
                    background: 'rgba(139, 69, 19, 0.1)', 
                    borderRadius: 'clamp(8px, 2vw, 10px)', 
                    padding: 'clamp(8px, 2vw, 12px)',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: 'var(--fs-xs)', color: '#8B4513', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                      Nonce
                    </span>
                    <span style={{ fontSize: 'var(--fs-xs)', color: '#5D3A1A', fontWeight: '700', fontFamily: 'monospace' }}>
                      {ticketData.nonce}
                    </span>
                  </div>
                </div>
                
                {/* Signature */}
                <div style={{ 
                  background: 'rgba(139, 69, 19, 0.1)', 
                  borderRadius: 'clamp(8px, 2vw, 10px)', 
                  padding: 'clamp(8px, 2vw, 12px)' 
                }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: '#8B4513', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Signature
                  </span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: '#5D3A1A', fontWeight: '700', fontFamily: 'monospace', wordBreak: 'break-all', display: 'block' }}>
                    {ticketData.signature}
                  </span>
                </div>
                
                {/* Admin Address */}
                <div style={{ 
                  background: 'rgba(139, 69, 19, 0.1)', 
                  borderRadius: 'clamp(8px, 2vw, 10px)', 
                  padding: 'clamp(8px, 2vw, 12px)' 
                }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: '#8B4513', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Admin Address
                  </span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: '#5D3A1A', fontWeight: '700', fontFamily: 'monospace', wordBreak: 'break-all', display: 'block' }}>
                    {ticketData.adminAddress}
                  </span>
                </div>
              </div>

              {/* Copy Ticket Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(ticketData, null, 2));
                  alert('Ticket copied to clipboard!');
                }}
                className="transition-all hover:scale-105 active:scale-95"
                style={{
                  marginTop: 'clamp(12px, 3vw, 16px)',
                  background: 'rgba(139, 69, 19, 0.2)',
                  border: '1px solid #8B4513',
                  borderRadius: 'clamp(6px, 1.5vw, 10px)',
                  padding: 'clamp(6px, 1.5vw, 10px)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 'var(--fs-xs)', color: '#5D3A1A', fontWeight: '600' }}>
                  Copy Ticket Data
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Info Text */}
        <p 
          className="text-center"
          style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: 'var(--fs-xs)',
            maxWidth: 'clamp(200px, 60vw, 260px)',
            marginTop: 'clamp(12px, 3vw, 16px)'
          }}
        >
          Exchange rate: {EXCHANGE_RATE.toLocaleString()} points = 1 token
        </p>
      </div>
    </div>
  );
}

export default RewardScreen;
