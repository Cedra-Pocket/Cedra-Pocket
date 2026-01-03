'use client';

import React from 'react';

export interface GradientButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * GradientButton component with primary/secondary/accent variants
 * Requirements: 9.2 - Use cyan and neon blue accent colors for interactive elements
 */
export function GradientButton({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}: GradientButtonProps) {
  const baseClasses =
    'px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px]';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-accent-green to-green-600 hover:shadow-lg hover:shadow-accent-green/40 active:scale-[0.98]',
    secondary:
      'bg-gradient-to-r from-bg-mid to-bg-blue border border-glass-border hover:shadow-lg hover:shadow-bg-blue/30 active:scale-[0.98]',
    accent:
      'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/40 active:scale-[0.98]',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled || loading ? disabledClasses : ''} ${className}`}
      aria-busy={loading}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default GradientButton;
