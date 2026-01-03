'use client';

export interface TokenBalanceProps {
  balance: number;
  earningRate: number; // tokens per hour
  currency?: 'coin' | 'gem';
  className?: string;
}

/**
 * Format large numbers with K/M suffixes
 */
function formatBalance(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

/**
 * Currency icons
 */
const CoinIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="text-yellow-400"
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <circle cx="12" cy="12" r="7" fill="#FCD34D" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fontWeight="bold"
      fill="#B45309"
    >
      $
    </text>
  </svg>
);

const GemIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="text-purple-400"
  >
    <polygon
      points="12,2 22,9 12,22 2,9"
      fill="currentColor"
    />
    <polygon
      points="12,5 18,9 12,18 6,9"
      fill="#C084FC"
    />
  </svg>
);

/**
 * TokenBalance component
 * Requirements: 1.2, 1.4
 * - 1.2: Display the user's current Token balance prominently above the Mascot
 * - 1.4: Display the passive earning rate (tokens per hour) in a visible badge
 */
export function TokenBalance({
  balance,
  earningRate,
  currency = 'coin',
  className = '',
}: TokenBalanceProps) {
  const formattedBalance = formatBalance(balance);
  const formattedRate = formatBalance(earningRate);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Main balance display */}
      <div className="flex items-center gap-2">
        {currency === 'coin' ? <CoinIcon /> : <GemIcon />}
        <span
          className="text-4xl font-bold text-white drop-shadow-lg"
          aria-label={`${currency === 'coin' ? 'Token' : 'Gem'} balance: ${balance}`}
        >
          {formattedBalance}
        </span>
      </div>

      {/* Earning rate badge */}
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full 
                   bg-white/10 backdrop-blur-sm border border-white/20"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent-cyan"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <span className="text-sm text-text-secondary font-medium">
          +{formattedRate}/hr
        </span>
      </div>
    </div>
  );
}

export default TokenBalance;
