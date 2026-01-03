'use client';

import { telegramService } from '../../services/telegram.service';
import { GradientButton } from '../shared/GradientButton';

export interface FloatingActionsProps {
  onUpgrade: () => void;
  onPlay: () => void;
  upgradeEnabled?: boolean;
  playEnabled?: boolean;
  className?: string;
}

/**
 * FloatingActions component
 * Requirements: 1.5
 * - Create Upgrade and Play buttons
 * - Position overlaid on hero image
 * - Handle button tap with haptic feedback
 */
export function FloatingActions({
  onUpgrade,
  onPlay,
  upgradeEnabled = true,
  playEnabled = true,
  className = '',
}: FloatingActionsProps) {
  const handleUpgrade = () => {
    telegramService.triggerHapticFeedback('medium');
    onUpgrade();
  };

  const handlePlay = () => {
    telegramService.triggerHapticFeedback('medium');
    onPlay();
  };

  return (
    <div
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      {/* Upgrade button */}
      <GradientButton
        variant="secondary"
        onClick={handleUpgrade}
        disabled={!upgradeEnabled}
        className="min-w-[100px]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <span>Upgrade</span>
      </GradientButton>

      {/* Play button */}
      <GradientButton
        variant="primary"
        onClick={handlePlay}
        disabled={!playEnabled}
        className="min-w-[100px]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
        <span>Play</span>
      </GradientButton>
    </div>
  );
}

export default FloatingActions;
