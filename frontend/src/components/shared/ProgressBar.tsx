'use client';

export interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  className?: string;
  height?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'success';
}

const heightClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorClasses = {
  primary: 'bg-gradient-to-r from-accent-cyan to-accent-neon',
  accent: 'bg-gradient-to-r from-purple-500 to-pink-500',
  success: 'bg-gradient-to-r from-green-400 to-emerald-500',
};

/**
 * ProgressBar component with percentage display
 * Requirements: 2.2 - Show progress bar with percentage for quests
 */
export function ProgressBar({
  current,
  total,
  showPercentage = false,
  className = '',
  height = 'md',
  color = 'primary',
}: ProgressBarProps) {
  // Ensure percentage is between 0 and 100
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  const roundedPercentage = Math.round(percentage);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`w-full ${heightClasses[height]} bg-white/20 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={roundedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${roundedPercentage}%`}
      >
        <div
          className={`${heightClasses[height]} ${colorClasses[color]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs text-text-secondary font-medium">
            {roundedPercentage}%
          </span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
