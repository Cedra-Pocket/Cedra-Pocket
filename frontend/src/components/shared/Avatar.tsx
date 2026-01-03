'use client';

import React from 'react';

export interface AvatarProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  badge?: number;
  className?: string;
  alt?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

const badgeSizeClasses = {
  sm: 'w-4 h-4 text-[10px] -top-1 -right-1',
  md: 'w-5 h-5 text-xs -top-1 -right-1',
  lg: 'w-6 h-6 text-sm -top-1 -right-1',
};

/**
 * Avatar component with size variants and badge support
 * Requirements: 9.3 - Apply rounded corners consistent with iOS design patterns
 */
export function Avatar({
  src,
  fallback,
  size = 'md',
  badge,
  className = '',
  alt = 'User avatar',
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const initials = fallback
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const showFallback = !src || imageError;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-bg-mid to-bg-blue border-2 border-glass-border shadow-soft`}
      >
        {showFallback ? (
          <span className="font-semibold text-white">{initials}</span>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      {badge !== undefined && badge > 0 && (
        <span
          className={`absolute ${badgeSizeClasses[size]} bg-accent-cyan text-white font-bold rounded-full flex items-center justify-center border border-white shadow-soft`}
          aria-label={`${badge} notifications`}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
  );
}

export default Avatar;
