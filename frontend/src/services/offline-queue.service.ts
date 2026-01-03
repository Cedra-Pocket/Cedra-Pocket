/**
 * Offline Queue Service
 * Queues actions when offline and syncs when connection is restored
 * Requirements: 13.5 - Queue actions when offline, sync on reconnection
 */

/**
 * Queued action types
 */
export type QueuedActionType = 
  | 'CLAIM_REWARD'
  | 'CLAIM_DAILY_REWARD'
  | 'PURCHASE_CARD'
  | 'UPGRADE_CARD'
  | 'COMPLETE_QUEST';

/**
 * Queued action interface
 */
export interface QueuedAction {
  id: string;
  type: QueuedActionType;
  payload: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

/**
 * Sync result interface
 */
export interface SyncResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors: Array<{ actionId: string; error: string }>;
}

const QUEUE_STORAGE_KEY = 'tg-mini-app-offline-queue';
const MAX_RETRY_COUNT = 3;

/**
 * Offline Queue Service implementation
 */
class OfflineQueueService {
  private queue: QueuedAction[] = [];
  private isSyncing: boolean = false;
  private syncCallbacks: Array<(result: SyncResult) => void> = [];

  constructor() {
    this.loadQueue();
    this.setupNetworkListeners();
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Set up network event listeners for auto-sync
   */
  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.sync();
    });
  }

  /**
   * Generate unique ID for queued action
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add action to queue
   */
  enqueue(type: QueuedActionType, payload: Record<string, unknown>): string {
    const action: QueuedAction = {
      id: this.generateId(),
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(action);
    this.saveQueue();

    return action.id;
  }

  /**
   * Remove action from queue
   */
  dequeue(actionId: string): void {
    this.queue = this.queue.filter((action) => action.id !== actionId);
    this.saveQueue();
  }

  /**
   * Get all queued actions
   */
  getQueue(): QueuedAction[] {
    return [...this.queue];
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Check if queue has pending actions
   */
  hasPendingActions(): boolean {
    return this.queue.length > 0;
  }

  /**
   * Clear all queued actions
   */
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }

  /**
   * Register callback for sync completion
   */
  onSyncComplete(callback: (result: SyncResult) => void): () => void {
    this.syncCallbacks.push(callback);
    return () => {
      this.syncCallbacks = this.syncCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Process a single queued action
   * Override this method to implement actual API calls
   */
  async processAction(action: QueuedAction): Promise<boolean> {
    // This is a placeholder - actual implementation would call the API service
    // For now, we'll simulate success
    console.log(`Processing queued action: ${action.type}`, action.payload);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // In production, this would call the appropriate API method based on action.type
    // For example:
    // switch (action.type) {
    //   case 'CLAIM_REWARD':
    //     await apiService.claimReward(action.payload.rewardId as string);
    //     break;
    //   case 'PURCHASE_CARD':
    //     await apiService.purchaseCard(action.payload.cardId as string);
    //     break;
    //   // ... etc
    // }
    
    return true;
  }

  /**
   * Sync all queued actions
   * Requirements: 13.5 - Sync when connection is restored
   */
  async sync(): Promise<SyncResult> {
    if (this.isSyncing) {
      return {
        success: false,
        processedCount: 0,
        failedCount: 0,
        errors: [{ actionId: '', error: 'Sync already in progress' }],
      };
    }

    if (!navigator.onLine) {
      return {
        success: false,
        processedCount: 0,
        failedCount: 0,
        errors: [{ actionId: '', error: 'Device is offline' }],
      };
    }

    if (this.queue.length === 0) {
      return {
        success: true,
        processedCount: 0,
        failedCount: 0,
        errors: [],
      };
    }

    this.isSyncing = true;
    const result: SyncResult = {
      success: true,
      processedCount: 0,
      failedCount: 0,
      errors: [],
    };

    // Process actions in order (FIFO)
    const actionsToProcess = [...this.queue];

    for (const action of actionsToProcess) {
      try {
        const success = await this.processAction(action);
        
        if (success) {
          this.dequeue(action.id);
          result.processedCount++;
        } else {
          action.retryCount++;
          
          if (action.retryCount >= MAX_RETRY_COUNT) {
            // Remove action after max retries
            this.dequeue(action.id);
            result.failedCount++;
            result.errors.push({
              actionId: action.id,
              error: 'Max retry count exceeded',
            });
          } else {
            this.saveQueue();
          }
        }
      } catch (error) {
        action.retryCount++;
        
        if (action.retryCount >= MAX_RETRY_COUNT) {
          this.dequeue(action.id);
          result.failedCount++;
          result.errors.push({
            actionId: action.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        } else {
          this.saveQueue();
        }
        
        result.success = false;
      }
    }

    this.isSyncing = false;

    // Notify callbacks
    this.syncCallbacks.forEach((callback) => callback(result));

    return result;
  }

  /**
   * Check if currently syncing
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}

// Singleton instance
export const offlineQueueService = new OfflineQueueService();
