/**
 * Services Index
 * Central export for all service layer implementations
 */

// Storage Service
export {
  StorageService,
  storageService,
  StorageQuotaExceededError,
  StorageParseError,
  type IStorageService,
} from './storage.service';

// Telegram Service
export {
  TelegramService,
  telegramService,
  type ITelegramService,
  type HapticFeedbackType,
} from './telegram.service';

// Wallet Service
export {
  WalletService,
  walletService,
  WalletConnectionError,
  type IWalletService,
  type ConnectionChangeCallback,
} from './wallet.service';

// API Service
export {
  APIService,
  apiService,
  APIError,
  type IAPIService,
} from './api.service';

// Offline Queue Service
export {
  offlineQueueService,
  type QueuedAction,
  type QueuedActionType,
  type SyncResult,
} from './offline-queue.service';
