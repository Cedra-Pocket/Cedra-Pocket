'use client';

import { useState, useCallback } from 'react';
import { useAppStore, useSpinsLeft } from '../../store/useAppStore';
import { backendAPI } from '../../services/backend-api.service';

// Các phần thưởng trên vòng quay
const WHEEL_SEGMENTS = [
  { label: '100 🪙', value: 100, color: '#FF6B6B' },
  { label: '50 🪙', value: 50, color: '#4ECDC4' },
  { label: '200 🪙', value: 200, color: '#FFE66D' },
  { label: '25 🪙', value: 25, color: '#95E1D3' },
  { label: '500 🪙', value: 500, color: '#F38181' },
  { label: '75 🪙', value: 75, color: '#AA96DA' },
  { label: '150 🪙', value: 150, color: '#FCBAD3' },
  { label: '10 🪙', value: 10, color: '#A8D8EA' },
];

interface SpinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpinModal({ isOpen, onClose }: SpinModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const spinsLeft = useSpinsLeft();
  const { updateBalance, decrementSpins, user, setUser } = useAppStore();

  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  const spinWheel = useCallback(() => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setResult(null);
    setShowResult(false);

    const winningIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const prize = WHEEL_SEGMENTS[winningIndex];

    const spins = 5 + Math.random() * 3;
    const baseSpins = Math.floor(spins) * 360;
    const targetAngle = (360 - winningIndex * segmentAngle - segmentAngle / 2 + 360) % 360;
    const currentNormalized = rotation % 360;
    let additionalAngle = targetAngle - currentNormalized;
    if (additionalAngle <= 0) additionalAngle += 360;
    const totalRotation = baseSpins + additionalAngle;
    
    setRotation(prev => prev + totalRotation);

    setTimeout(async () => {
      setResult(prize.value);
      setShowResult(true);
      updateBalance(prize.value, 'token');
      decrementSpins();
      setIsSpinning(false);

      if (backendAPI.isAuthenticated()) {
        try {
          const updatedUser = await backendAPI.addPoints(prize.value);
          if (user) {
            setUser({ ...user, tokenBalance: Number(updatedUser.total_points) });
          }
        } catch (error) {
          console.error('Failed to sync points:', error);
        }
      }

      setTimeout(() => {
        setShowResult(false);
      }, 2500);
    }, 4000);
  }, [isSpinning, spinsLeft, updateBalance, segmentAngle, rotation, user, setUser, decrementSpins]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '92vw' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 z-20 flex items-center justify-center rounded-full"
          style={{
            width: 'clamp(22px, 5.5vw, 30px)',
            height: 'clamp(22px, 5.5vw, 30px)',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <span className="text-white" style={{ fontSize: 'clamp(11px, 2.8vw, 14px)' }}>✕</span>
        </button>

        {/* Wheel Container */}
        <div className="relative" style={{ marginBottom: 'clamp(8px, 2vw, 12px)' }}>
          {/* Pointer */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
            style={{
              width: 0,
              height: 0,
              borderLeft: 'clamp(6px, 1.5vw, 10px) solid transparent',
              borderRight: 'clamp(6px, 1.5vw, 10px) solid transparent',
              borderTop: 'clamp(10px, 3vw, 16px) solid #FFD700',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />

          {/* Wheel Outer Ring */}
          <div
            style={{
              width: 'clamp(150px, 42vw, 200px)',
              height: 'clamp(150px, 42vw, 200px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
              padding: 'clamp(4px, 1vw, 6px)',
              boxShadow: '0 0 30px rgba(255,215,0,0.4)',
            }}
          >
            {/* Wheel */}
            <div 
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {WHEEL_SEGMENTS.map((seg, i) => {
                  const startAngle = i * segmentAngle - 90;
                  const endAngle = (i + 1) * segmentAngle - 90;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);
                  
                  const largeArc = segmentAngle > 180 ? 1 : 0;
                  const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
                  
                  const midAngle = ((startAngle + endAngle) / 2) * Math.PI / 180;
                  const textRadius = 32;
                  const textX = 50 + textRadius * Math.cos(midAngle);
                  const textY = 50 + textRadius * Math.sin(midAngle);
                  const textRotation = (startAngle + endAngle) / 2 + 90;
                  
                  return (
                    <g key={i}>
                      <path d={pathD} fill={seg.color} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="4.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {seg.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Center Circle */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  width: 'clamp(28px, 8vw, 40px)',
                  height: 'clamp(28px, 8vw, 40px)',
                  background: 'linear-gradient(135deg, #00BFFF, #1E90FF)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  border: 'clamp(1.5px, 0.4vw, 2.5px) solid rgba(255,255,255,0.8)',
                }}
                onClick={spinWheel}
              >
                <span className="text-white font-bold" style={{ fontSize: 'clamp(7px, 2vw, 10px)' }}>SPIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spins Left */}
        <div 
          className="rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            border: '2px solid rgba(255,255,255,0.3)',
            padding: 'clamp(5px, 1.2vw, 8px) clamp(10px, 3vw, 18px)',
            boxShadow: '0 4px 15px rgba(255,107,107,0.4)',
          }}
        >
          <span className="text-white font-semibold" style={{ fontSize: 'clamp(8px, 2vw, 11px)' }}>Spins: </span>
          <span className="text-white font-bold" style={{ fontSize: 'clamp(9px, 2.5vw, 12px)' }}>{spinsLeft}</span>
        </div>

        {/* Result */}
        {showResult && result !== null && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl z-30"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'clamp(1.5px, 0.4vw, 2.5px) solid rgba(255,255,255,0.5)',
              boxShadow: '0 8px 30px rgba(255,215,0,0.5)',
              animation: 'pulse 0.5s ease-in-out infinite',
              padding: 'clamp(8px, 2vw, 12px) clamp(14px, 4vw, 22px)',
            }}
          >
            <span className="font-bold text-white" style={{ fontSize: 'clamp(12px, 3.5vw, 18px)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              +{result} 🪙
            </span>
          </div>
        )}

        {/* No spins message */}
        {spinsLeft === 0 && (
          <p className="text-white/70 text-center" style={{ marginTop: 'clamp(6px, 1.5vw, 10px)', fontSize: 'clamp(8px, 2vw, 11px)' }}>
            Complete quests to get more spins!
          </p>
        )}
      </div>
    </div>
  );
}

export default SpinModal;
