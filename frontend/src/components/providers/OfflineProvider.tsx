'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { offlineQueueService, SyncResult } from '../../services/offline-queue.service';

/**
 * Offline context value interface
 */
interface OfflineContextValue {
  isOnline: boolean;
  isSyncing: boolean;
  pendingActionsCount: number;
  lastSyncResult: SyncResult | null;
  sync: () => Promise<SyncResult>;
}

/**
 * Offline context
 */
const OfflineContext = createContext<OfflineContextValue | null>(null);

/**
 * OfflineProvider props
 */
interface OfflineProviderProps {
  children: ReactNode;
}

/**
 * OfflineProvider component
 * Requirements: 13.5 - Detect online/offline status, queue actions, sync on reconnection
 */
export function OfflineProvider({ children }: OfflineProviderProps) {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingActionsCount, setPendingActionsCount] = useState(0);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [showSyncBanner, setShowSyncBanner] = useState(false);

  // Update pending actions count
  useEffect(() => {
    const updateCount = () => {
      setPendingActionsCount(offlineQueueService.getQueueLength());
    };

    // Initial count
    updateCount();

    // Listen for sync completion
    const unsubscribe = offlineQueueService.onSyncComplete((result) => {
      setLastSyncResult(result);
      updateCount();
      setIsSyncing(false);

      // Show sync result banner briefly
      if (result.processedCount > 0 || result.failedCount > 0) {
        setShowSyncBanner(true);
        setTimeout(() => setShowSyncBanner(false), 3000);
      }
    });

    return unsubscribe;
  }, []);

  // Show/hide offline banner
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineBanner(true);
    } else if (wasOffline) {
      // Keep banner briefly when coming back online
      setTimeout(() => setShowOfflineBanner(false), 2000);
    }
  }, [isOnline, wasOffline]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && wasOffline && pendingActionsCount > 0) {
      sync();
    }
  }, [isOnline, wasOffline, pendingActionsCount]);

  // Manual sync function
  const sync = useCallback(async (): Promise<SyncResult> => {
    if (isSyncing) {
      return {
        success: false,
        processedCount: 0,
        failedCount: 0,
        errors: [{ actionId: '', error: 'Sync already in progress' }],
      };
    }

    setIsSyncing(true);
    const result = await offlineQueueService.sync();
    setIsSyncing(false);
    setLastSyncResult(result);
    setPendingActionsCount(offlineQueueService.getQueueLength());

    return result;
  }, [isSyncing]);

  const contextValue: OfflineContextValue = {
    isOnline,
    isSyncing,
    pendingActionsCount,
    lastSyncResult,
    sync,
  };

  return (
    <OfflineContext.Provider value={contextValue}>
      {/* Offline Banner */}
      {showOfflineBanner && (
        <div
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
            isOnline ? 'bg-green-500/90' : 'bg-red-500/90'
          }`}
        >
          <div className="safe-area-inset-top">
            <div className="px-4 py-2 text-center text-white text-sm font-medium">
              {isOnline ? (
                <span>✓ Back online</span>
              ) : (
                <span>⚠ You are offline. Changes will be synced when connected.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sync Banner */}
      {showSyncBanner && lastSyncResult && (
        <div
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
            lastSyncResult.failedCount > 0 ? 'bg-yellow-500/90' : 'bg-green-500/90'
          }`}
        >
          <div className="safe-area-inset-top">
            <div className="px-4 py-2 text-center text-white text-sm font-medium">
              {lastSyncResult.failedCount > 0 ? (
                <span>
                  Synced {lastSyncResult.processedCount} actions, {lastSyncResult.failedCount} failed
                </span>
              ) : (
                <span>✓ Synced {lastSyncResult.processedCount} pending actions</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pending Actions Indicator */}
      {pendingActionsCount > 0 && isOnline && !isSyncing && (
        <button
          onClick={sync}
          className="fixed top-4 right-4 z-[90] bg-accent-cyan/90 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg"
        >
          Sync {pendingActionsCount} pending
        </button>
      )}

      {/* Syncing Indicator */}
      {isSyncing && (
        <div className="fixed top-4 right-4 z-[90] bg-accent-cyan/90 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Syncing...
        </div>
      )}

      {children}
    </OfflineContext.Provider>
  );
}

/**
 * Hook to access offline context
 */
export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}

export default OfflineProvider;
