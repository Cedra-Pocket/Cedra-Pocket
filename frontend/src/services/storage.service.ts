/**
 * Storage Service
 * Provides localStorage wrapper with JSON serialization and error handling
 * Requirements: 13.1, 13.2
 */

/**
 * Storage service interface
 */
export interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): boolean;
  remove(key: string): void;
  clear(): void;
}

/**
 * Error thrown when storage quota is exceeded
 */
export class StorageQuotaExceededError extends Error {
  constructor(key: string) {
    super(`Storage quota exceeded when saving key: ${key}`);
    this.name = 'StorageQuotaExceededError';
  }
}

/**
 * Error thrown when JSON parsing fails
 */
export class StorageParseError extends Error {
  constructor(key: string, originalError: Error) {
    super(`Failed to parse stored value for key: ${key}. ${originalError.message}`);
    this.name = 'StorageParseError';
  }
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Storage service implementation using localStorage
 */
export class StorageService implements IStorageService {
  private readonly prefix: string;
  private readonly available: boolean;

  constructor(prefix: string = 'tg_mini_app_') {
    this.prefix = prefix;
    this.available = isLocalStorageAvailable();
  }

  /**
   * Get prefixed key
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Retrieve a value from storage
   * @param key - Storage key
   * @returns Parsed value or null if not found
   */
  get<T>(key: string): T | null {
    if (!this.available) {
      return null;
    }

    try {
      const prefixedKey = this.getKey(key);
      const item = window.localStorage.getItem(prefixedKey);
      
      if (item === null) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`StorageService: Failed to parse value for key "${key}"`, error);
      }
      return null;
    }
  }

  /**
   * Store a value in storage
   * @param key - Storage key
   * @param value - Value to store (will be JSON serialized)
   * @returns true if successful, false otherwise
   * @throws StorageQuotaExceededError if storage quota is exceeded
   */
  set<T>(key: string, value: T): boolean {
    if (!this.available) {
      return false;
    }

    try {
      const prefixedKey = this.getKey(key);
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      // Check for quota exceeded error
      if (error instanceof DOMException) {
        if (
          error.code === 22 || // Legacy quota exceeded code
          error.code === 1014 || // Firefox quota exceeded
          error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          throw new StorageQuotaExceededError(key);
        }
      }
      console.error(`StorageService: Failed to save value for key "${key}"`, error);
      return false;
    }
  }

  /**
   * Remove a value from storage
   * @param key - Storage key to remove
   */
  remove(key: string): void {
    if (!this.available) {
      return;
    }

    try {
      const prefixedKey = this.getKey(key);
      window.localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`StorageService: Failed to remove key "${key}"`, error);
    }
  }

  /**
   * Clear all values with the service prefix from storage
   */
  clear(): void {
    if (!this.available) {
      return;
    }

    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('StorageService: Failed to clear storage', error);
    }
  }

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    return this.available;
  }
}

// Default singleton instance
export const storageService = new StorageService();
