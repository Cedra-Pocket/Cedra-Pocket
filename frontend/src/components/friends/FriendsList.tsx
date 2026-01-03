'use client';

import type { Friend } from '../../models';
import { GlassCard } from '../shared/GlassCard';
import { Avatar } from '../shared/Avatar';
import { EmptyState } from '../shared/EmptyState';

export interface FriendsListProps {
  friends: Friend[];
  className?: string;
}

/**
 * FriendsList component
 * Requirements: 12.5 - Show referred users with their contribution to bonus earnings
 */
export function FriendsList({ friends, className = '' }: FriendsListProps) {
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Format date to relative time
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (friends.length === 0) {
    return (
      <GlassCard className={className}>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Your Friends
        </h2>
        <EmptyState
          title="No friends yet"
          description="Invite your friends to earn bonus rewards!"
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          }
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard className={className}>
      <h2 className="text-xl font-bold text-text-primary mb-4">
        Your Friends ({friends.length})
      </h2>

      <div className="space-y-3">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {/* Avatar */}
            <Avatar
              src={friend.avatarUrl}
              fallback={friend.username}
              size="md"
            />

            {/* Friend Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg text-text-primary truncate">
                {friend.username}
              </p>
              <p className="text-sm text-text-secondary">
                Joined {formatDate(friend.joinedAt)}
              </p>
            </div>

            {/* Contribution */}
            <div className="text-right">
              <p className="font-bold text-lg text-accent-cyan">
                +{formatNumber(friend.contribution)}
              </p>
              <p className="text-sm text-text-secondary">bonus</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default FriendsList;
