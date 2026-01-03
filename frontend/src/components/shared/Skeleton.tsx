'use client';

import React from 'react';

/**
 * Base Skeleton component props
 */
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Base Skeleton component
 * Provides animated loading placeholder
 */
export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`animate-pulse bg-white/10 ${roundedClasses[rounded]} ${className}`}
      style={style}
    />
  );
}

/**
 * Skeleton Text - for text placeholders
 */
export function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 && lines > 1 ? '75%' : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Avatar - for avatar placeholders
 */
export function SkeletonAvatar({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <Skeleton
      className={`${sizeClasses[size]} ${className}`}
      rounded="full"
    />
  );
}

/**
 * Skeleton Card - for card placeholders
 */
export function SkeletonCard({
  className = '',
  height = 120,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div className={`glass-card p-4 ${className}`}>
      <Skeleton height={height} rounded="lg" />
    </div>
  );
}

/**
 * Home Screen Skeleton
 */
export function HomeScreenSkeleton() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6">
      {/* Token Balance Skeleton */}
      <div className="flex flex-col items-center gap-2">
        <Skeleton width={120} height={40} rounded="lg" />
        <Skeleton width={80} height={20} rounded="sm" />
      </div>

      {/* Level Badge Skeleton */}
      <Skeleton width={100} height={32} rounded="full" />

      {/* Hero Section Skeleton */}
      <Skeleton width={200} height={200} rounded="full" className="my-4" />

      {/* Floating Actions Skeleton */}
      <div className="flex gap-4">
        <Skeleton width={100} height={44} rounded="xl" />
        <Skeleton width={100} height={44} rounded="xl" />
      </div>
    </div>
  );
}

/**
 * Quest Screen Skeleton
 */
export function QuestScreenSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton width={150} height={28} rounded="md" />
        <Skeleton width={200} height={16} rounded="sm" />
      </div>

      {/* Quest Cards Skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-4 flex gap-4">
          <Skeleton width={48} height={48} rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={20} rounded="sm" />
            <Skeleton width="80%" height={14} rounded="sm" />
            <Skeleton width="100%" height={8} rounded="full" />
          </div>
          <Skeleton width={60} height={32} rounded="lg" />
        </div>
      ))}
    </div>
  );
}

/**
 * Cards Screen Skeleton
 */
export function CardsScreenSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="px-4 pt-4 pb-2 space-y-2">
        <Skeleton width={100} height={28} rounded="md" />
        <Skeleton width={180} height={16} rounded="sm" />
      </div>

      {/* Category Tabs Skeleton */}
      <div className="px-4 py-2 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} width={100} height={36} rounded="full" />
        ))}
      </div>

      {/* Card Grid Skeleton */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-3 space-y-3">
            <Skeleton height={80} rounded="lg" />
            <Skeleton width="70%" height={16} rounded="sm" />
            <Skeleton width="50%" height={14} rounded="sm" />
            <Skeleton width="100%" height={32} rounded="lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Reward Screen Skeleton
 */
export function RewardScreenSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Daily Reward Skeleton */}
      <div className="glass-card p-4 space-y-3">
        <Skeleton width={120} height={24} rounded="md" />
        <div className="flex items-center justify-between">
          <Skeleton width={80} height={32} rounded="lg" />
          <Skeleton width={100} height={40} rounded="xl" />
        </div>
      </div>

      {/* Rewards List Skeleton */}
      <Skeleton width={100} height={20} rounded="sm" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card p-4 flex items-center gap-4">
          <Skeleton width={40} height={40} rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton width="50%" height={18} rounded="sm" />
            <Skeleton width="70%" height={14} rounded="sm" />
          </div>
          <Skeleton width={70} height={32} rounded="lg" />
        </div>
      ))}
    </div>
  );
}

/**
 * Friends Screen Skeleton
 */
export function FriendsScreenSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header Skeleton */}
      <div className="glass-card p-4 text-center space-y-2">
        <Skeleton width={150} height={24} rounded="md" className="mx-auto" />
        <Skeleton width={200} height={16} rounded="sm" className="mx-auto" />
      </div>

      {/* Invite Button Skeleton */}
      <Skeleton height={48} rounded="xl" />

      {/* Stats Skeleton */}
      <div className="glass-card p-4 flex justify-around">
        <div className="text-center space-y-2">
          <Skeleton width={60} height={28} rounded="md" className="mx-auto" />
          <Skeleton width={80} height={14} rounded="sm" className="mx-auto" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton width={60} height={28} rounded="md" className="mx-auto" />
          <Skeleton width={80} height={14} rounded="sm" className="mx-auto" />
        </div>
      </div>

      {/* Friends List Skeleton */}
      <Skeleton width={80} height={20} rounded="sm" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card p-3 flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height={16} rounded="sm" />
            <Skeleton width="60%" height={12} rounded="sm" />
          </div>
          <Skeleton width={50} height={20} rounded="md" />
        </div>
      ))}
    </div>
  );
}

/**
 * Leaderboard Screen Skeleton
 */
export function LeaderboardScreenSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="px-4 pt-4 pb-2 space-y-2">
        <Skeleton width={150} height={28} rounded="md" />
        <Skeleton width={180} height={16} rounded="sm" />
      </div>

      {/* User Rank Skeleton */}
      <div className="px-4 py-2">
        <div className="glass-card p-3">
          <Skeleton width={120} height={20} rounded="sm" />
        </div>
      </div>

      {/* Leaderboard List Skeleton */}
      <div className="flex-1 px-4 space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="glass-card p-3 flex items-center gap-3">
            <Skeleton width={32} height={32} rounded="full" />
            <SkeletonAvatar size="sm" />
            <div className="flex-1 space-y-1">
              <Skeleton width="40%" height={16} rounded="sm" />
              <Skeleton width="25%" height={12} rounded="sm" />
            </div>
            <Skeleton width={60} height={20} rounded="md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Profile Screen Skeleton
 */
export function ProfileScreenSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Profile Header Skeleton */}
      <div className="glass-card p-4 flex items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton width="50%" height={20} rounded="sm" />
          <Skeleton width="30%" height={14} rounded="sm" />
        </div>
      </div>

      {/* Level Progress Skeleton */}
      <div className="glass-card p-4 space-y-3">
        <Skeleton width={80} height={20} rounded="sm" />
        <Skeleton width="100%" height={12} rounded="full" />
        <Skeleton width={120} height={14} rounded="sm" />
      </div>

      {/* Wallet Status Skeleton */}
      <div className="glass-card p-4 space-y-3">
        <Skeleton width={100} height={20} rounded="sm" />
        <Skeleton width="100%" height={44} rounded="xl" />
      </div>
    </div>
  );
}

export default Skeleton;
