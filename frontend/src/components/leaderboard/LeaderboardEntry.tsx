'use client';

import { Avatar } from '../shared';
import type { LeaderboardEntry as LeaderboardEntryType } from '../../models';

export interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  isCurrentUser: boolean;
  rank: number;
}

/**
 * Format XP number with K/M suffixes for large values
 */
function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
}

/**
 * Get rank badge styling for top 3 positions
 */
function getRankBadgeStyle(rank: number): {
  bgClass: string;
  textClass: string;
  icon?: string;
} {
  switch (rank) {
    case 1:
      return {
        bgClass: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
        textClass: 'text-yellow-900',
        icon: '🥇',
      };
    case 2:
      return {
        bgClass: 'bg-gradient-to-br from-gray-300 to-gray-500',
        textClass: 'text-gray-900',
        icon: '🥈',
      };
    case 3:
      return {
        bgClass: 'bg-gradient-to-br from-amber-600 to-amber-800',
        textClass: 'text-amber-100',
        icon: '🥉',
      };
    default:
      return {
        bgClass: 'bg-white/10',
        textClass: 'text-white',
      };
  }
}

/**
 * LeaderboardEntry component
 * Displays a single leaderboard entry with rank, avatar, username, and XP
 * Requirements: 5.2, 5.3 - Display rank, avatar, username, XP; highlight current user
 */
export function LeaderboardEntry({
  entry,
  isCurrentUser,
  rank,
}: LeaderboardEntryProps) {
  const rankStyle = getRankBadgeStyle(rank);
  const isTopThree = rank <= 3;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isCurrentUser
          ? 'bg-accent-cyan/20 border border-accent-cyan/50 shadow-soft'
          : 'bg-white/5 hover:bg-white/10'
      }`}
      data-testid={`leaderboard-entry-${entry.userId}`}
      data-current-user={isCurrentUser}
    >
      {/* Rank Badge */}
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${rankStyle.bgClass} ${rankStyle.textClass}`}
      >
        {isTopThree && rankStyle.icon ? (
          <span className="text-lg">{rankStyle.icon}</span>
        ) : (
          <span>#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <Avatar
        src={entry.avatarUrl}
        fallback={entry.username}
        size="md"
        alt={`${entry.username}'s avatar`}
      />

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold truncate ${
            isCurrentUser ? 'text-accent-cyan' : 'text-white'
          }`}
        >
          {entry.username}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-accent-cyan/80">(You)</span>
          )}
        </p>
        <p className="text-sm text-white/60">Level {entry.level}</p>
      </div>

      {/* XP Score */}
      <div className="text-right">
        <p
          className={`font-bold ${
            isTopThree ? 'text-lg text-accent-cyan' : 'text-white'
          }`}
        >
          {formatXP(entry.xp)}
        </p>
        <p className="text-xs text-white/50">XP</p>
      </div>
    </div>
  );
}

export default LeaderboardEntry;
