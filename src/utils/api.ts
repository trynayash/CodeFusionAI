/**
 * API Utility Functions
 * Standardized API handling with proper typing and error handling
 */

import { APIResponse, SupabaseResponse, AppError } from '@/types/api';
import { log } from '@/utils/logger';

/**
 * Transforms Supabase response to standardized API response
 */
export function transformSupabaseResponse<T>(
  response: SupabaseResponse<T>,
  context?: string
): APIResponse<T> {
  const { data, error, status } = response;

  if (error) {
    log.error(`Supabase error in ${context || 'unknown context'}`, error, 'SUPABASE');
    return {
      data: null as T,
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }

  log.info(`Supabase success in ${context || 'unknown context'}`, { status }, 'SUPABASE');
  return {
    data: data as T,
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generic API error handler
 */
export function handleAPIError(error: unknown, context: string): AppError {
  const appError: AppError = {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    context,
  };

  if (error instanceof Error) {
    appError.message = error.message;
    appError.details = {
      name: error.name,
      stack: error.stack,
    };
  } else if (typeof error === 'string') {
    appError.message = error;
  } else if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    appError.message = errorObj.message as string || appError.message;
    appError.code = errorObj.code as string || appError.code;
    appError.details = errorObj;
  }

  log.error(`API Error in ${context}`, appError, 'API');
  return appError;
}

/**
 * Retry mechanism for API calls
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: string
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log.debug(`Attempt ${attempt}/${maxRetries} for ${context || 'operation'}`, undefined, 'RETRY');
      return await operation();
    } catch (error) {
      lastError = error;
      log.warn(`Attempt ${attempt}/${maxRetries} failed for ${context || 'operation'}`, error, 'RETRY');

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

/**
 * Rate limiting utility
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this key
    const requests = this.requests.get(key) || [];
    
    // Filter out requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if we're under the limit
    if (validRequests.length >= maxRequests) {
      log.warn(`Rate limit exceeded for key: ${key}`, { 
        requests: validRequests.length, 
        maxRequests 
      }, 'RATE_LIMIT');
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Input sanitization utility
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 2) strength = 'medium';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce utility
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle utility
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone utility
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * Generate unique ID
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return targetDate.toLocaleDateString();
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      if (typeof window === 'undefined') return defaultValue || null;
      
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      
      return JSON.parse(item);
    } catch (error) {
      log.warn(`Failed to get item from localStorage: ${key}`, error, 'STORAGE');
      return defaultValue || null;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      log.warn(`Failed to set item in localStorage: ${key}`, error, 'STORAGE');
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      log.warn(`Failed to remove item from localStorage: ${key}`, error, 'STORAGE');
      return false;
    }
  },

  clear(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      localStorage.clear();
      return true;
    } catch (error) {
      log.warn('Failed to clear localStorage', error, 'STORAGE');
      return false;
    }
  },
};