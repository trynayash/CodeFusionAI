/**
 * Session Storage Utilities
 * 
 * Secure storage management for session data with fallback support
 */

import { SessionStorageKey, SessionStorage } from '@/types/session';
import { log } from '@/utils/logger';

class SessionStorageManager implements SessionStorage {
  private readonly prefix = 'codefusion_session_';
  private readonly fallbackStorage = new Map<string, string>();

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get prefixed key
   */
  private getPrefixedKey(key: SessionStorageKey): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get value from storage
   */
  get(key: SessionStorageKey): string | null {
    const prefixedKey = this.getPrefixedKey(key);
    
    try {
      if (this.isLocalStorageAvailable()) {
        const value = localStorage.getItem(prefixedKey);
        log.debug(`Retrieved session storage value for key: ${key}`, { hasValue: !!value }, 'SESSION_STORAGE');
        return value;
      } else {
        const value = this.fallbackStorage.get(prefixedKey) || null;
        log.debug(`Retrieved fallback storage value for key: ${key}`, { hasValue: !!value }, 'SESSION_STORAGE');
        return value;
      }
    } catch (error) {
      log.error(`Failed to get session storage value for key: ${key}`, error as Error, 'SESSION_STORAGE');
      return this.fallbackStorage.get(prefixedKey) || null;
    }
  }

  /**
   * Set value in storage
   */
  set(key: SessionStorageKey, value: string): void {
    const prefixedKey = this.getPrefixedKey(key);
    
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(prefixedKey, value);
        log.debug(`Set session storage value for key: ${key}`, { value }, 'SESSION_STORAGE');
      } else {
        this.fallbackStorage.set(prefixedKey, value);
        log.debug(`Set fallback storage value for key: ${key}`, { value }, 'SESSION_STORAGE');
      }
    } catch (error) {
      log.error(`Failed to set session storage value for key: ${key}`, error as Error, 'SESSION_STORAGE');
      this.fallbackStorage.set(prefixedKey, value);
    }
  }

  /**
   * Remove value from storage
   */
  remove(key: SessionStorageKey): void {
    const prefixedKey = this.getPrefixedKey(key);
    
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(prefixedKey);
        log.debug(`Removed session storage value for key: ${key}`, undefined, 'SESSION_STORAGE');
      } else {
        this.fallbackStorage.delete(prefixedKey);
        log.debug(`Removed fallback storage value for key: ${key}`, undefined, 'SESSION_STORAGE');
      }
    } catch (error) {
      log.error(`Failed to remove session storage value for key: ${key}`, error as Error, 'SESSION_STORAGE');
      this.fallbackStorage.delete(prefixedKey);
    }
  }

  /**
   * Clear all session storage
   */
  clear(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        // Remove only session-related keys
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        log.info(`Cleared ${keysToRemove.length} session storage items`, undefined, 'SESSION_STORAGE');
      } else {
        // Clear fallback storage
        const keysToRemove = Array.from(this.fallbackStorage.keys()).filter(key => 
          key.startsWith(this.prefix)
        );
        
        keysToRemove.forEach(key => this.fallbackStorage.delete(key));
        log.info(`Cleared ${keysToRemove.length} fallback storage items`, undefined, 'SESSION_STORAGE');
      }
    } catch (error) {
      log.error('Failed to clear session storage', error as Error, 'SESSION_STORAGE');
      // Clear fallback storage as backup
      const keysToRemove = Array.from(this.fallbackStorage.keys()).filter(key => 
        key.startsWith(this.prefix)
      );
      keysToRemove.forEach(key => this.fallbackStorage.delete(key));
    }
  }

  /**
   * Get all session storage data for debugging
   */
  getAll(): Record<string, string> {
    const data: Record<string, string> = {};
    
    try {
      if (this.isLocalStorageAvailable()) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            const value = localStorage.getItem(key);
            if (value) {
              data[key.replace(this.prefix, '')] = value;
            }
          }
        }
      } else {
        this.fallbackStorage.forEach((value, key) => {
          if (key.startsWith(this.prefix)) {
            data[key.replace(this.prefix, '')] = value;
          }
        });
      }
    } catch (error) {
      log.error('Failed to get all session storage data', error as Error, 'SESSION_STORAGE');
    }
    
    return data;
  }

  /**
   * Check if storage is available and working
   */
  isAvailable(): boolean {
    return this.isLocalStorageAvailable();
  }
}

// Export singleton instance
export const sessionStorage = new SessionStorageManager();

/**
 * Session data helpers
 */
export const SessionDataHelpers = {
  /**
   * Parse timestamp from storage
   */
  parseTimestamp(value: string | null): number | null {
    if (!value) return null;
    const timestamp = parseInt(value, 10);
    return isNaN(timestamp) ? null : timestamp;
  },

  /**
   * Format timestamp for storage
   */
  formatTimestamp(timestamp: number): string {
    return timestamp.toString();
  },

  /**
   * Check if timestamp is valid and not in the past
   */
  isValidFutureTimestamp(timestamp: number | null): boolean {
    if (!timestamp) return false;
    return timestamp > Date.now();
  },

  /**
   * Calculate remaining time in milliseconds
   */
  getRemainingTime(expiryTimestamp: number | null): number {
    if (!expiryTimestamp) return 0;
    const remaining = expiryTimestamp - Date.now();
    return Math.max(0, remaining);
  },

  /**
   * Format remaining time for display
   */
  formatRemainingTime(milliseconds: number): string {
    const seconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  }
};