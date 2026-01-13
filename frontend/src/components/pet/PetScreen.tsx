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
  const [isPlaying, setIsPlaying] = useState(false);
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

  const handlePlay = async () => {
    if ((user?.tokenBalance || 0) >= 20 && pet.happiness < 100) {
      setIsPlaying(true);
      updateBalance(-20, 'token');
      
      const newExp = pet.exp + 10;
      const newHappiness = Math.min(100, pet.happiness + 15);
      
      let newPetData: Partial<typeof pet>;
      
      // Check level up
      if (newExp >= pet.maxExp) {
        newPetData = {
          happiness: newHappiness,
          level: pet.level + 1,
          exp: newExp - pet.maxExp,
          maxExp: Math.floor(pet.maxExp * 1.5),
        };
      } else {
        newPetData = {
          happiness: newHappiness,
          exp: newExp,
        };
      }
      
      setPet(newPetData);
      syncToBackend(newPetData);
      
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  const coinsPerMin = getCoinsPerMinute(pet.level);

  return (
    <div 
      className="flex flex-col items-center hide-scrollbar" 
      style={{ 
        paddingTop: 'clamp(8px, 2vw, 14px)', 
        backgroundColor: 'transparent',
        height: 'calc(100vh - clamp(56px, 14vw, 72px))',
        overflowY: 'auto',
        paddingBottom: 'clamp(60px, 16vw, 80px)'
      }}
    >
      {/* Pet Mascot - Outside the card */}
      <div 
        className="relative flex flex-col items-center"
        style={{ marginBottom: 'clamp(-25px, -7vw, -35px)', zIndex: 10 }}
      >
        {/* Glow effect behind mascot */}
        <div 
          className="absolute"
          style={{
            width: 'clamp(90px, 24vw, 120px)',
            height: 'clamp(90px, 24vw, 120px)',
            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
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
              fontSize: 'clamp(14px, 4vw, 18px)',
              animation: 'floatUp 1s ease-out forwards',
              textShadow: '0 2px 10px rgba(255,215,0,0.5)',
            }}
          >
            +{coinsPerMin} 🪙
          </div>
        )}
        
        <img 
          src="/mascot.png" 
          alt="Pet"
          className={isPlaying ? 'animate-bounce-pet' : isFeeding ? 'animate-pulse-pet' : 'animate-float-pet'}
          style={{ 
            width: 'clamp(90px, 24vw, 120px)',
            height: 'clamp(90px, 24vw, 120px)',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(255,215,0,0.3))',
            position: 'relative',
            zIndex: 2,
          }}
        />
      </div>

      {/* Info Card */}
      <div 
        style={{
          width: '90%',
          maxWidth: 'clamp(260px, 72vw, 320px)',
          background: 'linear-gradient(135deg, #ffffff, #e8dcc8)',
          borderRadius: 'clamp(10px, 2.5vw, 14px)',
          padding: 'clamp(28px, 7vw, 38px) clamp(12px, 3vw, 16px) clamp(12px, 3vw, 16px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        {/* Pet Name & Level */}
        <div className="text-center" style={{ marginBottom: 'clamp(10px, 2.5vw, 14px)' }}>
          <h2 style={{ fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: '700', color: '#1a1a2e' }}>
            {petName}
          </h2>
          <div className="flex items-center justify-center" style={{ gap: 'clamp(8px, 2vw, 12px)', marginTop: 'clamp(4px, 1vw, 6px)' }}>
            <span 
              style={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                padding: 'clamp(3px, 0.8vw, 5px) clamp(8px, 2vw, 12px)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                fontSize: 'clamp(10px, 2.5vw, 12px)', 
                fontWeight: '600', 
                color: '#fff' 
              }}
            >
              Lv.{pet.level}
            </span>
            <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#666' }}>
              EXP: {pet.exp}/{pet.maxExp}
            </span>
          </div>
        </div>

        {/* Coin Production Info */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.2))',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px)',
            marginBottom: 'clamp(10px, 2.5vw, 14px)',
            border: '1px solid rgba(255,215,0,0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 'clamp(4px, 1vw, 6px)' }}>
              <span style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>🪙</span>
              <span style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '600', color: '#1a1a2e' }}>
                {coinsPerMin}/min
              </span>
            </div>
            
            {/* Timer or Claim button in same row */}
            {pet.pendingCoins > 0 ? (
              <button
                onClick={collectCoins}
                className="flex items-center transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  borderRadius: 'clamp(6px, 1.5vw, 8px)',
                  padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
                  gap: 'clamp(3px, 0.8vw, 5px)',
                }}
              >
                <span style={{ fontSize: 'clamp(10px, 2.5vw, 13px)' }}>🎁</span>
                <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: '700', color: '#fff' }}>
                  +{pet.pendingCoins}
                </span>
              </button>
            ) : (
              <div className="flex items-center" style={{ gap: 'clamp(4px, 1vw, 6px)' }}>
                <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#666' }}>
                  Next:
                </span>
                <span style={{ 
                  fontSize: 'clamp(11px, 2.8vw, 13px)', 
                  fontWeight: '700', 
                  color: '#FFA500',
                  fontFamily: 'monospace'
                }}>
                  {Math.floor(coinTimer / 60)}:{(coinTimer % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 12px)', marginBottom: 'clamp(10px, 2.5vw, 14px)' }}>
          {/* Hunger */}
          <div>
            <div className="flex justify-between" style={{ marginBottom: 'clamp(2px, 0.5vw, 4px)' }}>
              <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#666' }}>🍖 Hunger</span>
              <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#666' }}>{pet.hunger}%</span>
            </div>
            <div style={{ height: 'clamp(6px, 1.5vw, 8px)', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${pet.hunger}%`, height: '100%', background: 'linear-gradient(90deg, #FF6B6B, #FF8E53)', transition: 'width 0.3s' }} />
            </div>
          </div>

          {/* Happiness */}
          <div>
            <div className="flex justify-between" style={{ marginBottom: 'clamp(2px, 0.5vw, 4px)' }}>
              <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#666' }}>😊 Happiness</span>
              <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#666' }}>{pet.happiness}%</span>
            </div>
            <div style={{ height: 'clamp(6px, 1.5vw, 8px)', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${pet.happiness}%`, height: '100%', background: 'linear-gradient(90deg, #FFD700, #FFA500)', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          className="flex justify-center"
          style={{ gap: 'clamp(10px, 2.5vw, 14px)' }}
        >
          {/* Feed Button */}
          <button
            onClick={handleFeed}
            disabled={(user?.tokenBalance || 0) < 10 || pet.hunger >= 100}
            className="flex-1 flex flex-col items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
              borderRadius: 'clamp(10px, 2.5vw, 14px)',
              padding: 'clamp(10px, 2.5vw, 14px)',
              border: 'none',
              cursor: (user?.tokenBalance || 0) < 10 || pet.hunger >= 100 ? 'not-allowed' : 'pointer',
            }}
          >
            <span style={{ fontSize: 'clamp(20px, 5vw, 26px)' }}>🍖</span>
            <span style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '600', color: '#fff', marginTop: 'clamp(3px, 0.8vw, 5px)' }}>Feed</span>
            <span style={{ fontSize: 'clamp(8px, 2vw, 10px)', color: 'rgba(255,255,255,0.8)' }}>-10 🪙 | +5 EXP</span>
          </button>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            disabled={(user?.tokenBalance || 0) < 20 || pet.happiness >= 100}
            className="flex-1 flex flex-col items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: 'clamp(10px, 2.5vw, 14px)',
              padding: 'clamp(10px, 2.5vw, 14px)',
              border: 'none',
              cursor: (user?.tokenBalance || 0) < 20 || pet.happiness >= 100 ? 'not-allowed' : 'pointer',
            }}
          >
            <span style={{ fontSize: 'clamp(20px, 5vw, 26px)' }}>🎾</span>
            <span style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: '600', color: '#fff', marginTop: 'clamp(3px, 0.8vw, 5px)' }}>Play</span>
            <span style={{ fontSize: 'clamp(8px, 2vw, 10px)', color: 'rgba(255,255,255,0.8)' }}>-20 🪙 | +10 EXP</span>
          </button>
        </div>
      </div>

      {/* Level up bonus info */}
      <div 
        className="text-center"
        style={{ 
          marginTop: 'clamp(10px, 2.5vw, 14px)',
          padding: '0 clamp(12px, 3vw, 16px)',
        }}
      >
        <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#666' }}>
          🎯 Level up to earn more coins!
        </p>
        <p style={{ fontSize: 'clamp(8px, 2vw, 10px)', color: '#999', marginTop: '4px' }}>
          Next level: {getCoinsPerMinute(pet.level + 1)} 🪙/min
        </p>
      </div>

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
