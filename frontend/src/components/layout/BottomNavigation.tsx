'use client';

import { telegramService } from '../../services/telegram.service';
import type { NavigationTab } from '../../store/useAppStore';

export interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

/**
 * Icon components for navigation tabs
 */
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const QuestIcon = ({ active }: { active: boolean }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const SpinIcon = ({ active }: { active: boolean }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M12 12l4-4" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const WalletIcon = ({ active }: { active: boolean }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

const GameIcon = ({ active }: { active: boolean }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 12h4" />
    <path d="M8 10v4" />
    <circle cx="17" cy="10" r="1" />
    <circle cx="15" cy="14" r="1" />
  </svg>
);

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const handleTabClick = (tab: NavigationTab) => {
    if (tab !== activeTab) {
      telegramService.triggerHapticFeedback('light');
      onTabChange(tab);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[440px] px-6 safe-area-inset-bottom"
      style={{ paddingBottom: '40px' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Home button floating above */}
      <button
        onClick={() => handleTabClick('home')}
        className="absolute left-1/2 -translate-x-1/2 -top-5 z-20"
        aria-label="Home"
      >
        <div className={`
          rounded-full flex items-center justify-center
          bg-gradient-to-br from-accent-cyan via-cyan-400 to-accent-neon
          shadow-[0_8px_30px_rgba(0,212,255,0.6),0_4px_15px_rgba(0,191,255,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]
          transition-all duration-300
          ${activeTab === 'home' ? 'scale-110' : 'hover:scale-105'}
        `}
        style={{ width: '72px', height: '72px' }}
        >
          <div className="text-white drop-shadow-lg">
            <HomeIcon active={activeTab === 'home'} />
          </div>
        </div>
      </button>

      {/* Split nav bars */}
      <div className="flex items-center justify-center gap-2">
        {/* Left nav section */}
        <div 
          className="flex-1 flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            borderRadius: '24px 45px 24px 24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            height: '75px',
            padding: '0 16px'
          }}
        >
          <div className="flex items-center justify-evenly w-full">
            {/* Quest */}
            <button
              onClick={() => handleTabClick('quest')}
              className={`
                flex flex-col items-center justify-center px-4 py-2
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'quest' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ gap: '2px', ...(activeTab === 'quest' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) }}
              aria-label="Quest"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/icons/quest1.png" alt="Quest" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <span className="text-sm font-semibold">Quest</span>
              {activeTab === 'quest' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-500 rounded-full" />}
            </button>

            {/* Spin */}
            <button
              onClick={() => handleTabClick('spin')}
              className={`
                flex flex-col items-center justify-center px-4 py-2
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'spin' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ gap: '2px', ...(activeTab === 'spin' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) }}
              aria-label="Spin"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/icons/spin.png" alt="Spin" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <span className="text-sm font-semibold">Spin</span>
              {activeTab === 'spin' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-500 rounded-full" />}
            </button>
          </div>
        </div>

        {/* Center spacer for Home button */}
        <div style={{ width: '70px', flexShrink: 0 }} />

        {/* Right nav section */}
        <div 
          className="flex-1 flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            borderRadius: '45px 24px 24px 24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            height: '75px',
            padding: '0 16px'
          }}
        >
          <div className="flex items-center justify-evenly w-full">
            {/* Wallet */}
            <button
              onClick={() => handleTabClick('wallet')}
              className={`
                flex flex-col items-center justify-center px-4 py-2
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'wallet' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ gap: '2px', ...(activeTab === 'wallet' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) }}
              aria-label="Wallet"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/icons/wallet.png" alt="Wallet" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <span className="text-sm font-semibold">Wallet</span>
              {activeTab === 'wallet' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-500 rounded-full" />}
            </button>

            {/* Game */}
            <button
              onClick={() => handleTabClick('game')}
              className={`
                flex flex-col items-center justify-center px-4 py-2
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'game' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ gap: '2px', ...(activeTab === 'game' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) }}
              aria-label="Game"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/icons/game.png" alt="Game" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <span className="text-sm font-semibold">Game</span>
              {activeTab === 'game' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-500 rounded-full" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BottomNavigation;
