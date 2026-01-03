'use client';

import { GlassCard } from '../shared/GlassCard';

export interface ReferralStatsProps {
  totalReferrals: number;
  totalBonus: number;
  className?: string;
}

/**
 * ReferralStats component
 * Requirements: 12.2 - Display total referrals count and earned referral bonus
 */
export function ReferralStats({
  totalReferrals,
  totalBonus,
  className = '',
}: ReferralStatsProps) {
  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <GlassCard className={`${className}`}>
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Referral Stats
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Total Referrals */}
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-accent-cyan"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {formatNumber(totalReferrals)}
          </p>
          <p className="text-xs text-text-secondary mt-1">Total Friends</p>
        </div>

        {/* Total Bonus Earned */}
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {formatNumber(totalBonus)}
          </p>
          <p className="text-xs text-text-secondary mt-1">Bonus Earned</p>
        </div>
      </div>
    </GlassCard>
  );
}

export default ReferralStats;
