'use client';

import { ProgressBar } from '../shared/ProgressBar';

export interface LevelBadgeProps {
  level: number;
  maxLevel?: number;
  currentXP: number;
  requiredXP: number;
  className?: string;
}

/**
 * LevelBadge component
 * Requirements: 1.3
 * - Display current level
 * - Show XP progress bar
 * - Format level as "LVL X/Y"
 */
export function LevelBadge({
  level,
  maxLevel = 100,
  currentXP,
  requiredXP,
  className = '',
}: LevelBadgeProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-xl 
                  bg-white/10 backdrop-blur-sm border border-white/20 ${className}`}
    >
      {/* Level indicator */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
          LVL
        </span>
        <span className="text-lg font-bold text-white">
          {level}
        </span>
        <span className="text-xs text-text-muted">
          /{maxLevel}
        </span>
      </div>

      {/* XP Progress bar */}
      <div className="flex-1 min-w-[80px]">
        <ProgressBar
          current={currentXP}
          total={requiredXP}
          height="sm"
          color="primary"
        />
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] text-text-muted">
            {currentXP.toLocaleString()} XP
          </span>
          <span className="text-[10px] text-text-muted">
            {requiredXP.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LevelBadge;
