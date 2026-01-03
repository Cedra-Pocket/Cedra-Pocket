'use client';

import { useState } from 'react';
import type { DailyRewardData } from '../../models/reward';
import { CountdownTimer } from '../shared/CountdownTimer';

export interface DailyRewardProps {
  reward: DailyRewardData;
  onClaim: () => void;
  nextClaimTime?: Date;
}

/**
 * Gift box icon for daily reward
 */
const GiftIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
    {/* Gift box base */}
    <rect x="8" y="28" width="48" height="32" rx="4" fill="#4ADE80" />
    <rect x="8" y="28" width="48" height="32" rx="4" fill="url(#giftGradient)" />
    {/* Ribbon vertical */}
    <rect x="28" y="28" width="8" height="32" fill="#F472B6" />
    {/* Gift box lid */}
    <rect x="4" y="20" width="56" height="12" rx="3" fill="#22C55E" />
    <rect x="4" y="20" width="56" height="12" rx="3" fill="url(#lidGradient)" />
    {/* Ribbon horizontal on lid */}
    <rect x="4" y="23" width="56" height="6" fill="#EC4899" />
    {/* Bow */}
    <ellipse cx="32" cy="18" rx="10" ry="6" fill="#F472B6" />
    <ellipse cx="24" cy="14" rx="6" ry="4" fill="#EC4899" />
    <ellipse cx="40" cy="14" rx="6" ry="4" fill="#EC4899" />
    <circle cx="32" cy="18" r="4" fill="#DB2777" />
    {/* Coins around */}
    <circle cx="12" cy="52" r="5" fill="#FBBF24" />
    <circle cx="52" cy="48" r="4" fill="#FCD34D" />
    <circle cx="20" cy="56" r="3" fill="#F59E0B" />
    <defs>
      <linearGradient id="giftGradient" x1="8" y1="28" x2="56" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ADE80" />
        <stop offset="1" stopColor="#22C55E" />
      </linearGradient>
      <linearGradient id="lidGradient" x1="4" y1="20" x2="60" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ADE80" />
        <stop offset="1" stopColor="#16A34A" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Diamond icon
 */
const DiamondIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 9L12 22L22 9L12 2Z" fill="url(#diamondGrad)" />
    <path d="M2 9H22L12 2L2 9Z" fill="#E0F2FE" fillOpacity="0.6" />
    <defs>
      <linearGradient id="diamondGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#67E8F9" />
        <stop offset="1" stopColor="#0EA5E9" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Format reward amount for display
 */
function formatAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
}

/**
 * DailyReward component
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
export function DailyReward({ reward, onClaim, nextClaimTime }: DailyRewardProps) {
  const [claiming, setClaiming] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const canClaim = !reward.claimed;
  const showCountdown = reward.claimed && nextClaimTime && nextClaimTime > new Date();

  const handleClaim = async () => {
    if (!canClaim || claiming) return;

    setClaiming(true);
    setShowAnimation(true);

    onClaim();

    setTimeout(() => {
      setShowAnimation(false);
      setClaiming(false);
    }, 1000);
  };

  const handleCountdownComplete = () => {};

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1a2d3d]/90 backdrop-blur-sm p-4">
      {/* Claim animation overlay */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-accent-cyan/30 to-accent-neon/30 z-10 animate-pulse rounded-2xl">
          <div className="text-center">
            <span className="text-4xl animate-bounce">🎉</span>
            <p className="text-lg font-bold text-white mt-2">Claimed!</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Left - Gift Icon */}
        <div className="flex-shrink-0">
          <GiftIcon />
        </div>

        {/* Middle - Title and description */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white">Daily</h3>
          <h3 className="text-xl font-bold text-white -mt-1">Reward</h3>
          <p className="text-sm text-white/60 mt-1">Each day brings you more coins</p>
        </div>

        {/* Right - Amount and Claim button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Amount with diamond */}
          <div className="flex items-center gap-1">
            <DiamondIcon />
            <span className="text-xl font-bold text-white">+{formatAmount(reward.amount)}</span>
          </div>

          {/* Claim button */}
          {canClaim ? (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="px-5 py-2.5 rounded-xl font-bold text-white text-base
                bg-gradient-to-r from-pink-500 to-rose-400
                hover:from-pink-400 hover:to-rose-300
                active:scale-95 transition-all duration-200
                shadow-lg shadow-pink-500/30
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claiming ? '...' : 'Claim'}
            </button>
          ) : showCountdown && nextClaimTime ? (
            <div className="flex flex-col items-center">
              <CountdownTimer
                targetTime={nextClaimTime}
                onComplete={handleCountdownComplete}
                format="hh:mm:ss"
                className="text-sm text-white/70"
              />
            </div>
          ) : (
            <span className="text-sm text-green-400 font-medium">✓ Claimed</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyReward;
