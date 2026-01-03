'use client';

interface TopHeaderProps {
  username: string;
  level: number;
  currentXP: number;
  requiredXP: number;
}

export function TopHeader({ username, level, currentXP, requiredXP }: TopHeaderProps) {
  return (
    <div className="relative mb-4" style={{ marginLeft: '10px', marginRight: '10px' }}>
      {/* SVG for clip-path definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="notchClipTopHeader" clipPathUnits="objectBoundingBox">
            <path d="M 0 0.3 Q 0 0, 0.05 0 L 0.25 0 Q 0.28 0, 0.3 0.1 L 0.35 0.4 Q 0.37 0.45, 0.4 0.45 L 0.6 0.45 Q 0.63 0.45, 0.65 0.4 L 0.7 0.1 Q 0.72 0, 0.75 0 L 0.95 0 Q 1 0, 1 0.3 L 1 0.92 Q 1 1, 0.95 1 L 0.05 1 Q 0 1, 0 0.92 Z"/>
          </clipPath>
        </defs>
      </svg>

      {/* Avatar floating above */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: '25px' }}>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, #1a4a3a 0%, #2d6b5a 100%)',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <span className="text-lg">👤</span>
          </div>
          <span className="text-base font-bold text-gray-800">{username}</span>
        </div>
      </div>

      {/* Glass background */}
      <div 
        style={{
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          clipPath: 'url(#notchClipTopHeader)',
          padding: '16px 16px 12px 16px',
          minHeight: '120px',
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 10px 40px rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.5), 0 0 0 1px rgba(255,255,255,0.3)'
        }}
      >
        {/* Empty top row - space for notch */}
        <div style={{ height: '30px' }} />

        {/* LVL + EXP Bar */}
        <div className="px-2">
          <div className="text-center mb-1">
            <span className="text-sm text-gray-600 font-semibold">LVL {level}/10</span>
          </div>
          <div 
            className="w-full rounded-full overflow-hidden"
            style={{ 
              height: '6px',
              background: 'rgba(100,150,200,0.3)'
            }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${(currentXP / requiredXP) * 100}%`,
                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
