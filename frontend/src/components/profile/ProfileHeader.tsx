'use client';

import { Avatar } from '../shared/Avatar';
import { GlassCard } from '../shared/GlassCard';

export interface ProfileHeaderProps {
  avatarUrl?: string;
  username: string;
  telegramId: string;
  className?: string;
}

/**
 * ProfileHeader component
 * Requirements: 6.1
 * - Display Telegram avatar and username
 * - Show user ID
 */
export function ProfileHeader({
  avatarUrl,
  username,
  telegramId,
  className = '',
}: ProfileHeaderProps) {
  return (
    <GlassCard className={`flex flex-col items-center py-6 ${className}`}>
      {/* Avatar */}
      <Avatar
        src={avatarUrl}
        fallback={username}
        size="lg"
        alt={`${username}'s avatar`}
      />

      {/* Username */}
      <h2 className="mt-4 text-xl font-bold text-white">
        {username}
      </h2>

      {/* Telegram ID */}
      <p className="mt-1 text-sm text-text-muted">
        ID: {telegramId}
      </p>
    </GlassCard>
  );
}

export default ProfileHeader;
