import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { instantSyncService } from '../services/instant-sync.service';
import { backendAPI } from '../services/backend-api.service';

/**
 * Hook for instant synchronization
 */
export function useInstantSync() {
  const { setUser } = useAppStore();
  const [syncStatus, setSyncStatus] = useState({
    isInstantSyncing: false,
    lastInstantSync: null as Date | null,
    pendingOperations: 0,
    lastError: null as string | null
  });

  // Listen for instant sync events
  useEffect(() => {
    const handleInstantSyncSuccess = (event: CustomEvent) => {
      console.log('⚡ Instant sync success event:', event.detail);
      setSyncStatus(prev => ({
        ...prev,
        isInstantSyncing: false,
        lastInstantSync: new Date(),
        lastError: null
      }));
    };

    const handleInstantSyncFailed = (event: CustomEvent) => {
      console.log('❌ Instant sync failed event:', event.detail);
      setSyncStatus(prev => ({
        ...prev,
        isInstantSyncing: false,
        lastError: event.detail.error
      }));
    };

    const handleInstantProfileSync = (event: CustomEvent) => {
      console.log('👤 Instant profile sync event:', event.detail);
      if (event.detail.profile) {
        const userData = backendAPI.backendUserToUserData(event.detail.profile);
        setUser(userData);
      }
    };

    // Add event listeners
    window.addEventListener('instantSyncSuccess', handleInstantSyncSuccess as EventListener);
    window.addEventListener('instantSyncFailed', handleInstantSyncFailed as EventListener);
    window.addEventListener('instantProfileSync', handleInstantProfileSync as EventListener);

    return () => {
      window.removeEventListener('instantSyncSuccess', handleInstantSyncSuccess as EventListener);
      window.removeEventListener('instantSyncFailed', handleInstantSyncFailed as EventListener);
      window.removeEventListener('instantProfileSync', handleInstantProfileSync as EventListener);
    };
  }, [setUser]);

  // Update pending operations count
  useEffect(() => {
    const updateQueueStatus = () => {
      const status = instantSyncService.getQueueStatus();
      setSyncStatus(prev => ({
        ...prev,
        pendingOperations: status.pending,
        isInstantSyncing: status.processing
      }));
    };

    updateQueueStatus();
    const interval = setInterval(updateQueueStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Instant sync functions
  const syncPointsInstantly = useCallback(async (amount: number) => {
    setSyncStatus(prev => ({ ...prev, isInstantSyncing: true }));
    try {
      await instantSyncService.syncPointsInstantly(amount, { priority: 'high' });
      return true;
    } catch (error) {
      console.error('Instant sync failed:', error);
      return false;
    }
  }, []);

  const syncProfileInstantly = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, isInstantSyncing: true }));
    try {
      await instantSyncService.syncProfileInstantly();
      return true;
    } catch (error) {
      console.error('Instant profile sync failed:', error);
      return false;
    }
  }, []);

  const forceSyncAll = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, isInstantSyncing: true }));
    try {
      await instantSyncService.forceSyncAll();
      return true;
    } catch (error) {
      console.error('Force sync all failed:', error);
      return false;
    }
  }, []);

  const clearSyncQueue = useCallback(() => {
    instantSyncService.clearQueue();
    setSyncStatus(prev => ({ ...prev, pendingOperations: 0 }));
  }, []);

  return {
    syncStatus,
    syncPointsInstantly,
    syncProfileInstantly,
    forceSyncAll,
    clearSyncQueue
  };
}