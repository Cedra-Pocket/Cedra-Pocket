'use client';

import { telegramService } from '../../services/telegram.service';
import type { NavigationTab } from '../../store/useAppStore';

export interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

/**
 * Icon component for Home tab
 */
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    style={{ width: 'clamp(22px, 6vw, 32px)', height: 'clamp(22px, 6vw, 32px)' }}
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

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const handleTabClick = (tab: NavigationTab) => {
    if (tab !== activeTab) {
      telegramService.triggerHapticFeedback('light');
      onTabChange(tab);
    }
  };

  return (
    <nav
      className="fixed z-50"
      style={{ 
        bottom: 'clamp(8px, 2vw, 15px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - clamp(24px, 6vw, 40px))',
        maxWidth: 'clamp(300px, 88vw, 380px)'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Home button floating above */}
      <button
        onClick={() => handleTabClick('home')}
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ top: 'clamp(-14px, -3.5vw, -20px)' }}
        aria-label="Home"
      >
        <div className={`
          rounded-full flex items-center justify-center
          bg-gradient-to-br from-accent-cyan via-cyan-400 to-accent-neon
          shadow-[0_6px_20px_rgba(0,212,255,0.5)]
          transition-all duration-300
          ${activeTab === 'home' ? 'scale-110' : 'hover:scale-105'}
        `}
        style={{ width: 'clamp(42px, 11vw, 58px)', height: 'clamp(42px, 11vw, 58px)' }}
        >
          <div className="text-white drop-shadow-lg">
            <HomeIcon active={activeTab === 'home'} />
          </div>
        </div>
      </button>

      {/* Split nav bars */}
      <div className="flex items-center justify-center" style={{ gap: 'clamp(46px, 12vw, 66px)' }}>
        {/* Left nav section - Quest + Pet */}
        <div 
          className="flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'clamp(14px, 3.5vw, 20px) clamp(24px, 6vw, 35px) clamp(14px, 3.5vw, 20px) clamp(14px, 3.5vw, 20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            height: 'clamp(48px, 12vw, 64px)',
            padding: '0 clamp(4px, 1.5vw, 10px)',
            flex: 1,
          }}
        >
          <div className="flex items-center justify-evenly w-full">
            {/* Quest */}
            <button
              onClick={() => handleTabClick('quest')}
              className={`
                flex flex-col items-center justify-center
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'quest' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ 
                gap: 'clamp(0px, 0.2vw, 2px)', 
                padding: 'clamp(2px, 0.6vw, 5px) clamp(3px, 0.8vw, 6px)',
                ...(activeTab === 'quest' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) 
              }}
              aria-label="Quest"
            >
              <div className="flex items-center justify-center" style={{ width: 'clamp(18px, 4.5vw, 26px)', height: 'clamp(18px, 4.5vw, 26px)' }}>
                <img src="/icons/quest1.PNG" alt="Quest" style={{ width: 'clamp(20px, 5vw, 28px)', height: 'clamp(20px, 5vw, 28px)', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: 'clamp(8px, 2vw, 11px)' }} className="font-semibold">Quest</span>
              {activeTab === 'quest' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-cyan-500 rounded-full" style={{ width: 'clamp(14px, 3.5vw, 20px)', height: 'clamp(2px, 0.4vw, 3px)' }} />}
            </button>

            {/* Pet */}
            <button
              onClick={() => handleTabClick('pet')}
              className={`
                flex flex-col items-center justify-center
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'pet' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ 
                gap: 'clamp(0px, 0.2vw, 2px)', 
                padding: 'clamp(2px, 0.6vw, 5px) clamp(3px, 0.8vw, 6px)',
                ...(activeTab === 'pet' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) 
              }}
              aria-label="Pet"
            >
              <div className="flex items-center justify-center" style={{ width: 'clamp(18px, 4.5vw, 26px)', height: 'clamp(18px, 4.5vw, 26px)' }}>
                <img src="/icons/pet.PNG" alt="Pet" style={{ width: 'clamp(20px, 5vw, 28px)', height: 'clamp(20px, 5vw, 28px)', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: 'clamp(8px, 2vw, 11px)' }} className="font-semibold">Pet</span>
              {activeTab === 'pet' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-cyan-500 rounded-full" style={{ width: 'clamp(14px, 3.5vw, 20px)', height: 'clamp(2px, 0.4vw, 3px)' }} />}
            </button>
          </div>
        </div>

        {/* Right nav section - Wallet + Game */}
        <div 
          className="flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'clamp(24px, 6vw, 35px) clamp(14px, 3.5vw, 20px) clamp(14px, 3.5vw, 20px) clamp(14px, 3.5vw, 20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            height: 'clamp(48px, 12vw, 64px)',
            padding: '0 clamp(4px, 1.5vw, 10px)',
            flex: 1,
          }}
        >
          <div className="flex items-center justify-evenly w-full">
            {/* Wallet */}
            <button
              onClick={() => handleTabClick('wallet')}
              className={`
                flex flex-col items-center justify-center
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'wallet' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ 
                gap: 'clamp(0px, 0.2vw, 2px)', 
                padding: 'clamp(2px, 0.6vw, 5px) clamp(3px, 0.8vw, 6px)',
                ...(activeTab === 'wallet' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) 
              }}
              aria-label="Wallet"
            >
              <div className="flex items-center justify-center" style={{ width: 'clamp(18px, 4.5vw, 26px)', height: 'clamp(18px, 4.5vw, 26px)' }}>
                <img src="/icons/wallet.PNG" alt="Wallet" style={{ width: 'clamp(20px, 5vw, 28px)', height: 'clamp(20px, 5vw, 28px)', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: 'clamp(8px, 2vw, 11px)' }} className="font-semibold">Wallet</span>
              {activeTab === 'wallet' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-cyan-500 rounded-full" style={{ width: 'clamp(14px, 3.5vw, 20px)', height: 'clamp(2px, 0.4vw, 3px)' }} />}
            </button>

            {/* Game */}
            <button
              onClick={() => handleTabClick('game')}
              className={`
                flex flex-col items-center justify-center
                transition-all duration-300 rounded-xl flex-1 relative overflow-hidden
                hover:scale-105 hover:bg-white/30
                ${activeTab === 'game' ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
              `}
              style={{ 
                gap: 'clamp(0px, 0.2vw, 2px)', 
                padding: 'clamp(2px, 0.6vw, 5px) clamp(3px, 0.8vw, 6px)',
                ...(activeTab === 'game' ? { textShadow: '0 0 10px rgba(0,212,255,0.8)' } : {}) 
              }}
              aria-label="Game"
            >
              <div className="flex items-center justify-center" style={{ width: 'clamp(18px, 4.5vw, 26px)', height: 'clamp(18px, 4.5vw, 26px)' }}>
                <img src="/icons/game.png" alt="Game" style={{ width: 'clamp(20px, 5vw, 28px)', height: 'clamp(20px, 5vw, 28px)', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: 'clamp(8px, 2vw, 11px)' }} className="font-semibold">Game</span>
              {activeTab === 'game' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-cyan-500 rounded-full" style={{ width: 'clamp(14px, 3.5vw, 20px)', height: 'clamp(2px, 0.4vw, 3px)' }} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BottomNavigation;
