'use client';

import { useReferralStats, useUser } from '../../store/useAppStore';
import { ReferralStats } from './ReferralStats';
import { FriendsList } from './FriendsList';
import { InviteButton } from './InviteButton';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { GlassCard } from '../shared/GlassCard';

export interface FriendsScreenProps {
  className?: string;
}

/**
 * FriendsScreen component
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 * - Integrate ReferralStats, FriendsList, InviteButton
 * - Connect to store and Telegram service
 * - Handle invite flow
 */
export function FriendsScreen({ className = '' }: FriendsScreenProps) {
  const user = useUser();
  const referralStats = useReferralStats();

  // Loading state
  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Generate referral link based on user's telegram ID
  const referralLink = referralStats?.referralLink || 
    `https://t.me/YourBotName?start=ref_${user.telegramId}`;

  // If no referral stats yet, show initial state
  if (!referralStats) {
    return (
      <div className={`space-y-4 px-2 pb-5 ${className}`} style={{ paddingTop: '50px' }}>
        {/* Header */}
        <GlassCard>
          <div className="text-center py-4">
            <h1 className="text-2xl font-extrabold text-text-primary mb-2">
              Invite Friends
            </h1>
            <p className="text-lg text-text-secondary">
              Share your referral link and earn bonus rewards when friends join!
            </p>
          </div>
        </GlassCard>

        {/* Invite Button */}
        <InviteButton referralLink={referralLink} />

        {/* Empty Stats */}
        <ReferralStats totalReferrals={0} totalBonus={0} />

        {/* Empty Friends List */}
        <FriendsList friends={[]} />
      </div>
    );
  }

  return (
    <div className={`space-y-4 px-2 pb-5 ${className}`} style={{ paddingTop: '50px' }}>
      {/* Header */}
      <GlassCard>
        <div className="text-center py-2">
          <h1 className="text-2xl font-extrabold text-text-primary mb-2">
            Invite Friends
          </h1>
          <p className="text-lg text-text-secondary">
            Earn <span className="text-accent-cyan font-bold">+100 tokens</span> for each friend who joins!
          </p>
        </div>
      </GlassCard>

      {/* Invite Button */}
      <InviteButton referralLink={referralStats.referralLink} />

      {/* Referral Stats */}
      <ReferralStats
        totalReferrals={referralStats.totalReferrals}
        totalBonus={referralStats.totalBonus}
      />

      {/* Friends List */}
      <FriendsList friends={referralStats.friends} />
    </div>
  );
}

export default FriendsScreen;
