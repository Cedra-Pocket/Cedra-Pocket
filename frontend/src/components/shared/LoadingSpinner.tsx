'use client';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

/**
 * LoadingSpinner component with size and color variants
 * Requirements: 9.2 - Use cyan and neon blue accent colors
 */
export function LoadingSpinner({
  size = 'md',
  color,
  className = '',
}: LoadingSpinnerProps) {
  const colorStyle = color ? { borderTopColor: color } : {};

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-white/30 border-t-accent-cyan animate-spin ${className}`}
      style={colorStyle}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
