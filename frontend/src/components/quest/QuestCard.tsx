'use client';

import type { Quest } from '../../models/quest';

export interface QuestCardProps {
  quest: Quest;
  onAction: () => void;
}

/**
 * Reward type icons
 */
const RewardIcon = ({ type }: { type: Quest['reward']['type'] }) => {
  switch (type) {
    case 'token':
      return <span>🪙</span>;
    case 'gem':
      return <span>🪙</span>;
    case 'xp':
      return <span>⭐</span>;
    case 'nft':
      return <span>🎁</span>;
  }
};

/**
 * Format reward amount for display
 */
function formatRewardAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
}

/**
 * Reward Badge component
 * Adjust size: change width/height in style prop
 */
const RewardBadge = ({ type, amount }: { type: Quest['reward']['type']; amount: number }) => (
  <div 
    style={{ 
      minWidth: '70px',
      height: '32px',
      paddingLeft: '10px',
      paddingRight: '10px',
      background: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}
    className="flex items-center justify-center gap-1"
  >
    <span className="text-sm">
      <RewardIcon type={type} />
    </span>
    <span style={{ color: '#1a1a2e' }} className="text-sm font-extrabold">
      +{formatRewardAmount(amount)}
    </span>
  </div>
);

/**
 * Claim Button component
 */
const ClaimButton = ({ onClick }: { onClick?: () => void }) => (
  <button 
    onClick={onClick}
    style={{ width: '70px', height: '32px' }}
    className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-extrabold shadow-lg shadow-pink-500/30 border border-pink-400/30 hover:scale-105 transition-transform flex items-center justify-center"
  >
    Claim
  </button>
);

/**
 * QuestCard component - Layout like reference image
 */
export function QuestCard({ quest, onAction }: QuestCardProps) {
  const isLocked = quest.status === 'locked';
  const isCompleted = quest.status === 'completed';

  return (
    <div
      onClick={isLocked ? undefined : onAction}
      style={{
        background: 'linear-gradient(135deg, #ffffff, #e8dcc8)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
      }}
      className={`${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'}`}
    >
      <div className="flex items-center gap-4">
        {/* Quest Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-accent-cyan/20 to-accent-neon/20">
          <span className="text-3xl">
            {quest.type === 'social' && '🐦'}
            {quest.type === 'daily' && '🎁'}
            {quest.type === 'referral' && '👥'}
            {quest.type === 'achievement' && '🏆'}
          </span>
        </div>

        {/* Quest Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 style={{ color: '#1a1a2e', fontSize: '14px', marginBottom: '2px' }} className="font-bold">
            {quest.title}
          </h3>

          {/* Description */}
          <p style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '12px' }}>
            {quest.description}
          </p>
        </div>

        {/* Reward + Claim - Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <RewardBadge type={quest.reward.type} amount={quest.reward.amount} />
          {isCompleted && <ClaimButton />}
        </div>
      </div>
    </div>
  );
}

export default QuestCard;
