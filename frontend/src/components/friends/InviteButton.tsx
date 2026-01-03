'use client';

import { GradientButton } from '../shared/GradientButton';
import { telegramService } from '../../services/telegram.service';

export interface InviteButtonProps {
  referralLink: string;
  onInvite?: () => void;
  className?: string;
}

/**
 * InviteButton component
 * Requirements: 12.3 - Generate and share a Telegram referral link
 */
export function InviteButton({
  referralLink,
  onInvite,
  className = '',
}: InviteButtonProps) {
  const handleInvite = () => {
    // Trigger haptic feedback
    telegramService.triggerHapticFeedback('medium');

    // Share the referral link via Telegram
    telegramService.shareReferralLink(referralLink);

    // Call optional callback
    onInvite?.();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      telegramService.triggerHapticFeedback('light');
    } catch (error) {
      console.warn('Failed to copy referral link:', error);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Invite Button */}
      <GradientButton
        variant="primary"
        onClick={handleInvite}
        className="w-full"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <span>Invite Friends</span>
      </GradientButton>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary bg-white/5 hover:bg-white/10 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span>Copy Referral Link</span>
      </button>
    </div>
  );
}

export default InviteButton;
