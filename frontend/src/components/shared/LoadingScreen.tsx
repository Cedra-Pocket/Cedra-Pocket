'use client';

export function LoadingScreen() {
  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 30%, #B0E0E6 60%, #C5E8F0 100%)',
      }}
    >
      {/* Logo */}
      <div 
        className="relative mb-8 animate-bounce"
        style={{ animationDuration: '2s' }}
      >
        <img 
          src="/logo.png" 
          alt="Cedra Pocket Logo" 
          className="drop-shadow-2xl"
          style={{ 
            width: 'clamp(120px, 35vw, 180px)', 
            height: 'auto',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))',
          }}
        />
      </div>

      {/* App Name */}
      <h1 
        className="font-extrabold text-center mb-6"
        style={{ 
          fontSize: 'clamp(28px, 8vw, 40px)',
          color: '#1e3a5f',
          textShadow: '0 2px 10px rgba(255,255,255,0.5)',
        }}
      >
        Cedra Pocket
      </h1>

      {/* Loading spinner */}
      <div 
        className="relative animate-spin"
        style={{
          width: 'clamp(50px, 14vw, 70px)',
          height: 'clamp(50px, 14vw, 70px)',
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{ border: '4px solid rgba(255, 255, 255, 0.3)' }}
        />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            border: '4px solid transparent',
            borderTopColor: '#FFD700',
            borderRightColor: '#FFA500',
          }}
        />
      </div>

      {/* Loading text */}
      <p 
        className="mt-6 font-semibold"
        style={{ 
          fontSize: 'var(--fs-sm)',
          color: '#1e3a5f',
          opacity: 0.8,
        }}
      >
        Loading
      </p>
    </div>
  );
}

export default LoadingScreen;
