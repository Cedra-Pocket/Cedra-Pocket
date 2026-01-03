'use client';

import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * GlassCard component with glassmorphism styling
 * Requirements: 9.3 - Apply Glassmorphism effects with rounded corners (minimum 12px radius)
 */
export function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  const baseClasses = 'glass-card';
  const interactiveClasses = onClick
    ? 'cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]'
    : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export default GlassCard;
