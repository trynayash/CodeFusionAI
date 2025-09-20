/**
 * Session Storage Tests
 * 
 * Tests for session storage utilities and helpers
 */

import { sessionStorage, SessionDataHelpers } from '@/utils/sessionStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SessionStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Basic Operations', () => {
    it('should set and get values', () => {
      const testValue = '1234567890';
      sessionStorage.set('session_expiry', testValue);
      
      expect(sessionStorage.get('session_expiry')).toBe(testValue);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'codefusion_session_session_expiry',
        testValue
      );
    });

    it('should return null for non-existent keys', () => {
      expect(sessionStorage.get('session_expiry')).toBeNull();
    });

    it('should remove values', () => {
      sessionStorage.set('session_expiry', '1234567890');
      sessionStorage.remove('session_expiry');
      
      expect(sessionStorage.get('session_expiry')).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'codefusion_session_session_expiry'
      );
    });

    it('should clear all session storage', () => {
      sessionStorage.set('session_expiry', '1234567890');
      sessionStorage.set('session_start', '1234567890');
      sessionStorage.set('last_activity', '1234567890');
      
      sessionStorage.clear();
      
      expect(sessionStorage.get('session_expiry')).toBeNull();
      expect(sessionStorage.get('session_start')).toBeNull();
      expect(sessionStorage.get('last_activity')).toBeNull();
    });
  });

  describe('Fallback Storage', () => {
    beforeEach(() => {
      // Mock localStorage to throw errors
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
    });

    it('should use fallback storage when localStorage fails', () => {
      const testValue = '1234567890';
      
      // Should not throw
      expect(() => {
        sessionStorage.set('session_expiry', testValue);
      }).not.toThrow();
      
      // Should retrieve from fallback
      expect(sessionStorage.get('session_expiry')).toBe(testValue);
    });
  });

  describe('Storage Availability', () => {
    it('should detect localStorage availability', () => {
      expect(sessionStorage.isAvailable()).toBe(true);
    });

    it('should handle localStorage unavailability', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      
      expect(sessionStorage.isAvailable()).toBe(false);
    });
  });

  describe('Get All Data', () => {
    it('should return all session data', () => {
      sessionStorage.set('session_expiry', '1234567890');
      sessionStorage.set('session_start', '0987654321');
      
      const allData = sessionStorage.getAll();
      
      expect(allData).toEqual({
        session_expiry: '1234567890',
        session_start: '0987654321',
      });
    });
  });
});

describe('SessionDataHelpers', () => {
  describe('Timestamp Parsing', () => {
    it('should parse valid timestamps', () => {
      const timestamp = Date.now();
      const timestampString = timestamp.toString();
      
      expect(SessionDataHelpers.parseTimestamp(timestampString)).toBe(timestamp);
    });

    it('should return null for invalid timestamps', () => {
      expect(SessionDataHelpers.parseTimestamp('invalid')).toBeNull();
      expect(SessionDataHelpers.parseTimestamp(null)).toBeNull();
      expect(SessionDataHelpers.parseTimestamp('')).toBeNull();
    });

    it('should format timestamps correctly', () => {
      const timestamp = 1234567890123;
      expect(SessionDataHelpers.formatTimestamp(timestamp)).toBe('1234567890123');
    });
  });

  describe('Timestamp Validation', () => {
    it('should validate future timestamps', () => {
      const futureTimestamp = Date.now() + 60000; // 1 minute in future
      const pastTimestamp = Date.now() - 60000; // 1 minute in past
      
      expect(SessionDataHelpers.isValidFutureTimestamp(futureTimestamp)).toBe(true);
      expect(SessionDataHelpers.isValidFutureTimestamp(pastTimestamp)).toBe(false);
      expect(SessionDataHelpers.isValidFutureTimestamp(null)).toBe(false);
    });
  });

  describe('Remaining Time Calculation', () => {
    it('should calculate remaining time correctly', () => {
      const futureTimestamp = Date.now() + 60000; // 1 minute in future
      const remaining = SessionDataHelpers.getRemainingTime(futureTimestamp);
      
      expect(remaining).toBeGreaterThan(59000); // Should be close to 60000ms
      expect(remaining).toBeLessThanOrEqual(60000);
    });

    it('should return 0 for past timestamps', () => {
      const pastTimestamp = Date.now() - 60000; // 1 minute in past
      
      expect(SessionDataHelpers.getRemainingTime(pastTimestamp)).toBe(0);
    });

    it('should return 0 for null timestamps', () => {
      expect(SessionDataHelpers.getRemainingTime(null)).toBe(0);
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly', () => {
      expect(SessionDataHelpers.formatRemainingTime(65000)).toBe('1:05'); // 1 minute 5 seconds
      expect(SessionDataHelpers.formatRemainingTime(30000)).toBe('30s'); // 30 seconds
      expect(SessionDataHelpers.formatRemainingTime(0)).toBe('0s'); // 0 seconds
      expect(SessionDataHelpers.formatRemainingTime(120000)).toBe('2:00'); // 2 minutes
    });
  });
});