/**
 * Instant Sync Service
 * Provides real-time synchronization for critical operations
 */

import { backendAPI } from './backend-api.service';

export interface InstantSyncOptions {
  timeout?: number;
  retries?: number;
  priority?: 'high' | 'normal' | 'low';
}

export class InstantSyncService {
  private syncQueue: Array<{
    id: string;
    operation: () => Promise<any>;
    options: InstantSyncOptions;
    timestamp: number;
  }> = [];
  
  private isProcessing = false;
  private readonly DEFAULT_TIMEOUT = 2000; // 2 seconds for instant sync
  private readonly MAX_RETRIES = 2;

  /**
   * Sync points instantly to backend
   */
  async syncPointsInstantly(amount: number, options: InstantSyncOptions = {}): Promise<boolean> {
    const syncId = `points_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`⚡ Queuing instant sync: ${amount > 0 ? '+' : ''}${amount} points`);
    
    const operation = async () => {
      const timeout = options.timeout || this.DEFAULT_TIMEOUT;
      
      return Promise.race([
        backendAPI.addPoints(amount),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Instant sync timeout')), timeout)
        )
      ]);
    };

    // Add to priority queue
    this.syncQueue.push({
      id: syncId,
      operation,
      options: { ...options, retries: options.retries || this.MAX_RETRIES },
      timestamp: Date.now()
    });

    // Sort by priority and timestamp
    this.syncQueue.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const aPriority = priorityOrder[a.options.priority || 'normal'];
      const bPriority = priorityOrder[b.options.priority || 'normal'];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return a.timestamp - b.timestamp;
    });

    // Process queue
    this.processQueue();
    
    return true;
  }

  /**
   * Process sync queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.syncQueue.length > 0) {
      const syncItem = this.syncQueue.shift()!;
      
      try {
        console.log(`⚡ Processing instant sync: ${syncItem.id}`);
        const result = await syncItem.operation();
        console.log(`✅ Instant sync completed: ${syncItem.id}`, result);
        
        // Broadcast success event
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('instantSyncSuccess', {
            detail: { id: syncItem.id, result }
          });
          window.dispatchEvent(event);
        }
        
      } catch (error) {
        console.error(`❌ Instant sync failed: ${syncItem.id}`, error);
        
        // Retry logic
        if (syncItem.options.retries && syncItem.options.retries > 0) {
          console.log(`🔄 Retrying instant sync: ${syncItem.id} (${syncItem.options.retries} retries left)`);
          syncItem.options.retries--;
          this.syncQueue.unshift(syncItem); // Add back to front of queue
        } else {
          // Broadcast failure event
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('instantSyncFailed', {
              detail: { id: syncItem.id, error: error instanceof Error ? error.message : String(error) }
            });
            window.dispatchEvent(event);
          }
        }
      }
      
      // Small delay between operations to avoid overwhelming the backend
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  /**
   * Force sync all pending operations
   */
  async forceSyncAll(): Promise<void> {
    console.log(`⚡ Force syncing ${this.syncQueue.length} pending operations`);
    await this.processQueue();
  }

  /**
   * Clear all pending sync operations
   */
  clearQueue(): void {
    console.log(`🗑️ Clearing ${this.syncQueue.length} pending sync operations`);
    this.syncQueue = [];
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    pending: number;
    processing: boolean;
    oldestTimestamp: number | null;
  } {
    return {
      pending: this.syncQueue.length,
      processing: this.isProcessing,
      oldestTimestamp: this.syncQueue.length > 0 ? this.syncQueue[0].timestamp : null
    };
  }

  /**
   * Sync user profile instantly
   */
  async syncProfileInstantly(): Promise<any> {
    console.log('⚡ Instant profile sync...');
    
    try {
      const result = await Promise.race([
        backendAPI.getUserProfile(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile sync timeout')), this.DEFAULT_TIMEOUT)
        )
      ]);
      
      console.log('✅ Instant profile sync completed');
      
      // Broadcast profile sync event
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('instantProfileSync', {
          detail: { profile: result }
        });
        window.dispatchEvent(event);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Instant profile sync failed:', error);
      throw error;
    }
  }

  /**
   * Batch sync multiple operations
   */
  async batchSyncInstantly(operations: Array<{
    type: 'points' | 'profile' | 'custom';
    data: any;
    options?: InstantSyncOptions;
  }>): Promise<any[]> {
    console.log(`⚡ Batch instant sync: ${operations.length} operations`);
    
    const promises = operations.map(async (op, index) => {
      const delay = index * 50; // Stagger requests by 50ms
      await new Promise(resolve => setTimeout(resolve, delay));
      
      switch (op.type) {
        case 'points':
          return this.syncPointsInstantly(op.data, op.options);
        case 'profile':
          return this.syncProfileInstantly();
        case 'custom':
          return op.data(); // Custom operation function
        default:
          throw new Error(`Unknown operation type: ${op.type}`);
      }
    });

    try {
      const results = await Promise.allSettled(promises);
      console.log(`✅ Batch instant sync completed: ${results.length} operations`);
      return results;
    } catch (error) {
      console.error('❌ Batch instant sync failed:', error);
      throw error;
    }
  }
}

// Singleton instance
export const instantSyncService = new InstantSyncService();