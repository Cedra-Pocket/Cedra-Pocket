'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, usePet, useAppStore } from '../../store/useAppStore';
import { backendAPI } from '../../services/backend-api.service';

// Tính tiền nhả ra theo level
const getCoinsPerMinute = (level: number) => {
  return 100 + (level - 1) * 50; // Level 1: 100, Level 2: 150, Level 3: 200...
};

// Thời gian nhả tiền (giây) - 1 phút
const COIN_INTERVAL_SECONDS = 60; // 1 phút = 60 giây

export function PetScreen() {
  const user = useUser();
  const pet = usePet();
  const { updateBalance, setPet, claimPetCoins } = useAppStore();
  const hasFetchedRef = useRef(false);
  
  // Pet name = User's name + "'s Pet"
  const petName = user?.username ? `${user.username}'s Pet` : 'My Pet';

  const [isFeeding, setIsFeeding] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Calculate remaining time based on lastCoinTime from store
  const [coinTimer, setCoinTimer] = useState(() => {
    if (pet.pendingCoins > 0) return 0;
    const elapsed = Math.floor((Date.now() - pet.lastCoinTime) / 1000);
    const remaining = COIN_INTERVAL_SECONDS - elapsed;
    return Math.max(0, remaining);
  });

  // Load pet from backend on mount
  useEffect(() => {
    const loadPetFromBackend = async () => {
      if (!backendAPI.isAuthenticated() || hasFetchedRef.current) return;
      
      try {
        hasFetchedRef.current = true;
        const petData = await backendAPI.getPet();
        setPet(petData);
      } catch (error) {
        console.error('Failed to load pet from backend:', error);
      }
    };

    loadPetFromBackend();
  }, [setPet]);

  // Sync pet to backend when state changes (debounced)
  const syncToBackend = useCallback(async (petData: Partial<typeof pet>) => {
    if (!backendAPI.isAuthenticated() || isSyncing) return;
    
    try {
      setIsSyncing(true);
      await backendAPI.updatePet(petData);
    } catch (error) {
      console.error('Failed to sync pet to backend:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  // Timer để pet nhả tiền - chỉ chạy khi không có pending coins
  useEffect(() => {
    // Nếu có pending coins thì không chạy timer
    if (pet.pendingCoins > 0) {
      setCoinTimer(0);
      return;
    }

    // Calculate initial remaining time
    const elapsed = Math.floor((Date.now() - pet.lastCoinTime) / 1000);
    const remaining = COIN_INTERVAL_SECONDS - elapsed;
    
    // If time already passed, generate coins immediately (no animation yet)
    if (remaining <= 0) {
      const coins = getCoinsPerMinute(pet.level);
      setPet({ pendingCoins: coins });
      syncToBackend({ pendingCoins: coins });
      setCoinTimer(0);
      return;
    }

    setCoinTimer(remaining);

    const interval = setInterval(() => {
      setCoinTimer(prev => {
        if (prev <= 1) {
          // Nhả tiền! (no animation - only show when claim)
          const coins = getCoinsPerMinute(pet.level);
          setPet({ pendingCoins: coins });
          syncToBackend({ pendingCoins: coins });
          return 0; // Dừng timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pet.level, pet.pendingCoins, pet.lastCoinTime, setPet, syncToBackend]);

  // Nhận tiền từ pet và reset timer
  const collectCoins = useCallback(async () => {
    if (pet.pendingCoins > 0) {
      // Show animation when claiming
      setShowCoinAnimation(true);
      setTimeout(() => setShowCoinAnimation(false), 1000);
      
      const coinsToAdd = pet.pendingCoins;
      claimPetCoins();
      setCoinTimer(COIN_INTERVAL_SECONDS);
      
      // Sync to backend
      if (backendAPI.isAuthenticated()) {
        try {
          await backendAPI.claimPetCoins(coinsToAdd);
        } catch (error) {
          console.error('Failed to claim coins on backend:', error);
        }
      }
    }
  }, [pet.pendingCoins, claimPetCoins]);

  const handleFeed = async () => {
    if ((user?.tokenBalance || 0) >= 10 && pet.hunger < 100) {
      setIsFeeding(true);
      updateBalance(-10, 'token');
      
      const newExp = pet.exp + 5;
      const newHunger = Math.min(100, pet.hunger + 20);
      
      let newPetData: Partial<typeof pet>;
      
      // Check level up
      if (newExp >= pet.maxExp) {
        newPetData = {
          hunger: newHunger,
          level: pet.level + 1,
          exp: newExp - pet.maxExp,
          maxExp: Math.floor(pet.maxExp * 1.5),
        };
      } else {
        newPetData = {
          hunger: newHunger,
          exp: newExp,
        };
      }
      
      setPet(newPetData);
      syncToBackend(newPetData);
      
      setTimeout(() => setIsFeeding(false), 1000);
    }
  };

  const coinsPerMin = getCoinsPerMinute(pet.level);

  return (
    <div 
      className="flex flex-col hide-scrollbar relative" 
      style={{ 
        backgroundColor: 'transparent',
        height: 'calc(100vh - clamp(56px, 14vw, 72px))',
        overflowY: 'auto',
        paddingBottom: 'clamp(60px, 16vw, 80px)'
      }}
    >
      {/* Top Bar */}
      <div 
        className="flex items-center justify-between w-full"
        style={{ padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)' }}
      >
        {/* Level Circle - Left */}
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: 'clamp(40px, 11vw, 50px)',
            height: 'clamp(40px, 11vw, 50px)',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Progress ring */}
          <svg 
            className="absolute" 
            viewBox="0 0 40 40"
            style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
            />
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="#4facfe"
              strokeWidth="3"
              strokeDasharray={`${(pet.exp / pet.maxExp) * 107} 107`}
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: 'var(--fs-lg)', fontWeight: '700', color: '#1e3a5f' }}>{pet.level}</span>
        </div>

        {/* Pet Name - Center */}
        <h2 style={{ fontSize: 'var(--fs-md)', fontWeight: '700', color: '#1e3a5f', textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}>
          {petName}
        </h2>

        {/* Coins - Right */}
        <div 
          className="flex items-center"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px)',
            borderRadius: 'clamp(15px, 4vw, 20px)',
            padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
            gap: 'clamp(4px, 1vw, 6px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 3px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <span style={{ fontSize: 'var(--fs-base)' }}>🪙</span>
          <span style={{ fontSize: 'var(--fs-sm)', fontWeight: '700', color: '#1e3a5f' }}>
            {coinsPerMin}/min
          </span>
        </div>
      </div>

      {/* Pet Mascot - Centered */}
      <div 
        className="relative flex flex-col items-center flex-1 justify-center"
        style={{ zIndex: 10 }}
      >
        {/* Glow effect behind mascot */}
        <div 
          className="absolute"
          style={{
            width: 'clamp(300px, 100vw, 400px)',
            height: 'clamp(300px, 100vw, 400px)',
            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            animation: 'glowPulse 2s ease-in-out infinite',
          }}
        />
        
        {/* Sparkle particles */}
        <div className="absolute" style={{ width: '100%', height: '100%' }}>
          <div className="sparkle" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>✨</div>
          <div className="sparkle" style={{ top: '20%', right: '15%', animationDelay: '0.5s' }}>⭐</div>
          <div className="sparkle" style={{ bottom: '30%', left: '5%', animationDelay: '1s' }}>✨</div>
          <div className="sparkle" style={{ bottom: '20%', right: '10%', animationDelay: '1.5s' }}>⭐</div>
        </div>

        {/* Coin animation when claiming */}
        {showCoinAnimation && (
          <div 
            className="absolute"
            style={{ 
              top: '-20px', 
              fontSize: 'clamp(16px, 5vw, 22px)',
              animation: 'floatUp 1s ease-out forwards',
              textShadow: '0 2px 10px rgba(255,215,0,0.5)',
            }}
          >
            +{coinsPerMin} 🪙
          </div>
        )}
        
        <img 
          src="/pet.png" 
          alt="Pet"
          className={isFeeding ? 'animate-pulse-pet' : 'animate-float-pet'}
          style={{ 
            width: '95vw',
            maxWidth: '500px',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4)) drop-shadow(0 0 30px rgba(255,215,0,0.3))',
            position: 'relative',
            zIndex: 2,
          }}
        />
      </div>

      {/* Bottom Status Bars - Like Talking Tom */}
      <div 
        className="flex items-end justify-center"
        style={{ 
          padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
          gap: 'clamp(16px, 4vw, 24px)'
        }}
      >
        {/* Hunger */}
        <div className="flex flex-col items-center">
          <span style={{ fontSize: 'var(--fs-xs)', color: '#fff', marginBottom: '4px', fontWeight: '600' }}>{pet.hunger}%</span>
          <button
            onClick={handleFeed}
            disabled={(user?.tokenBalance || 0) < 10 || pet.hunger >= 100}
            className="flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
            style={{
              width: 'clamp(45px, 12vw, 55px)',
              height: 'clamp(45px, 12vw, 55px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 15px rgba(255,107,107,0.4)',
              cursor: (user?.tokenBalance || 0) < 10 || pet.hunger >= 100 ? 'not-allowed' : 'pointer',
            }}
          >
            <span style={{ fontSize: 'var(--fs-lg)' }}>🍖</span>
          </button>
        </div>

        {/* Collect Coins */}
        <div className="flex flex-col items-center">
          <span style={{ fontSize: 'var(--fs-xs)', color: '#fff', marginBottom: '4px', fontWeight: '600' }}>
            {pet.pendingCoins > 0 ? `+${pet.pendingCoins}` : `${Math.floor(coinTimer / 60)}:${(coinTimer % 60).toString().padStart(2, '0')}`}
          </span>
          <button
            onClick={collectCoins}
            disabled={pet.pendingCoins <= 0}
            className="flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
            style={{
              width: 'clamp(45px, 12vw, 55px)',
              height: 'clamp(45px, 12vw, 55px)',
              borderRadius: '50%',
              background: pet.pendingCoins > 0 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'linear-gradient(135deg, #6b7280, #4b5563)',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: pet.pendingCoins > 0 
                ? '0 4px 15px rgba(34,197,94,0.4)' 
                : '0 4px 15px rgba(0,0,0,0.2)',
              cursor: pet.pendingCoins <= 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <span style={{ fontSize: 'var(--fs-lg)' }}>🪙</span>
          </button>
        </div>
      </div>

{/* Info Card - temporarily hidden */}

      {/* CSS Animation */}
      <style jsx>{`
        .animate-float-pet {
          animation: floatPet 3s ease-in-out infinite;
        }
        .animate-bounce-pet {
          animation: bouncePet 0.5s ease-in-out infinite;
        }
        .animate-pulse-pet {
          animation: pulsePet 0.5s ease-in-out infinite;
        }
        .sparkle {
          position: absolute;
          font-size: clamp(12px, 3vw, 18px);
          animation: sparkleFloat 2s ease-in-out infinite;
          opacity: 0.8;
        }
        @keyframes floatPet {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        @keyframes bouncePet {
          0%, 100% { transform: translateY(0) rotate(-5deg) scale(1); }
          50% { transform: translateY(-20px) rotate(5deg) scale(1.1); }
        }
        @keyframes pulsePet {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-50px) scale(1.2); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0.4; transform: translateY(0) scale(0.8); }
          50% { opacity: 1; transform: translateY(-8px) scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default PetScreen;
