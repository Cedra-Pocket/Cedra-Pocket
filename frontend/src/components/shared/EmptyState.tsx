'use client';

import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * EmptyState component for empty lists
 * Requirements: 4.5 - Display empty state message with guidance when no pending rewards
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="mb-4 text-text-muted opacity-60">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-base text-text-secondary max-w-xs mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-xl font-medium text-base text-white bg-gradient-to-r from-accent-cyan to-accent-neon hover:shadow-lg hover:shadow-accent-cyan/40 transition-all duration-200 active:scale-[0.98]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
