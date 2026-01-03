'use client';

import { ProgressBar } from '../shared/ProgressBar';
import { GlassCard } from '../shared/GlassCard';

export interface LevelProgressProps {
  level: number;
  currentXP: number;
  requiredXP: number;
  className?: string;
}

/**
 * LevelProgress component
 * Requirements: 6.2
 * - Display current level prominently
 * - Show XP progress bar with values
 */
export function LevelProgress({
  level,
  currentXP,
  requiredXP,
  className = '',
}: LevelProgressProps) {
  const percentage = requiredXP > 0 ? Math.round((currentXP / requiredXP) * 100) : 0;

  return (
    <GlassCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide">
          Level Progress
        </h3>
        <span className="text-sm text-text-muted">
          {percentage}%
        </span>
      </div>

      {/* Level display - prominent */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">
            {level}
          </span>
          <span className="text-lg text-text-muted font-medium">
            LVL
          </span>
        </div>
      </div>

      {/* XP Progress bar */}
      <ProgressBar
        current={currentXP}
        total={requiredXP}
        height="md"
        color="primary"
      />

      {/* XP values */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-text-muted">
          {currentXP.toLocaleString()} XP
        </span>
        <span className="text-xs text-text-muted">
          {requiredXP.toLocaleString()} XP
        </span>
      </div>
    </GlassCard>
  );
}

export default LevelProgress;
