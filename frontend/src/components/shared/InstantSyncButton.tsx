'use client';

import { useState } from 'react';
import { useInstantSync } from '../../hooks/useInstantSync';

interface InstantSyncButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function InstantSyncButton({ 
  className = '', 
  size = 'md',
  variant = 'primary' 
}: InstantSyncButtonProps) {
  const { syncStatus, forceSyncAll } = useInstantSync();
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleInstantSync = async () => {
    setIsManualSyncing(true);
    try {
      await forceSyncAll();
    } finally {
      setTimeout(() => setIsManualSyncing(false), 1000);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300'
  };

  const isLoading = syncStatus.isInstantSyncing || isManualSyncing;
  const hasPending = syncStatus.pendingOperations > 0;

  return (
    <button
      onClick={handleInstantSync}
      disabled={isLoading}
      className={`
        relative inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        rounded-lg font-medium transition-all duration-200
        ${className}
      `}
    >
      {/* Loading spinner */}
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Sync icon */}
      {!isLoading && (
        <svg 
          className="w-4 h-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
      )}

      {/* Button text */}
      <span>
        {isLoading ? 'Syncing...' : 'Instant Sync'}
      </span>

      {/* Pending operations badge */}
      {hasPending && !isLoading && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {syncStatus.pendingOperations}
        </span>
      )}

      {/* Success indicator */}
      {syncStatus.lastInstantSync && !isLoading && !hasPending && (
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full h-3 w-3 animate-pulse" />
      )}
    </button>
  );
}