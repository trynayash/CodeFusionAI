/**
 * Session Context Tests
 * 
 * Tests for session context and provider functionality
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { AuthProvider } from '@/hooks/useAuth';
import { sessionStorage } from '@/utils/sessionStorage';

// Mock dependencies
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/utils/sessionStorage');
jest.mock('@/utils/logger');

// Test component that uses session context
function TestComponent() {
  const session = useSession();
  
  return (
    <div>
      <div data-testid="authenticated">{session.isAuthenticated.toString()}</div>
      <div data-testid="expires-at">{session.expiresAt?.toString() || 'null'}</div>
      <div data-testid="show-warning">{session.showWarning.toString()}</div>
      <div data-testid="remaining-time">{session.getRemainingTime()}</div>
      
      <button onClick={session.startSession} data-testid="start-session">
        Start Session
      </button>
      <button onClick={session.extendSession} data-testid="extend-session">
        Extend Session
      </button>
      <button onClick={session.endSession} data-testid="end-session">
        End Session
      </button>
      <button onClick={session.showSessionWarning} data-testid="show-warning-btn">
        Show Warning
      </button>
      <button onClick={session.hideSessionWarning} data-testid="hide-warning-btn">
        Hide Warning
      </button>
    </div>
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SessionProvider
          config={{
            sessionDuration: 60000, // 1 minute for testing
            warningTime: 10000, // 10 seconds warning
            extensionDuration: 30000, // 30 seconds extension
            checkInterval: 1000, // Check every second
          }}
        >
          {children}
        </SessionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('SessionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Mock sessionStorage
    (sessionStorage.get as jest.Mock).mockReturnValue(null);
    (sessionStorage.set as jest.Mock).mockImplementation(() => {});
    (sessionStorage.clear as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('should provide initial session state', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('expires-at')).toHaveTextContent('null');
      expect(screen.getByTestId('show-warning')).toHaveTextContent('false');
      expect(screen.getByTestId('remaining-time')).toHaveTextContent('0');
    });
  });

  describe('Session Management', () => {
    it('should start a session', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const startButton = screen.getByTestId('start-session');
      
      act(() => {
        startButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('expires-at')).not.toHaveTextContent('null');
      });

      // Verify storage was called
      expect(sessionStorage.set).toHaveBeenCalledWith('session_expiry', expect.any(String));
      expect(sessionStorage.set).toHaveBeenCalledWith('session_start', expect.any(String));
      expect(sessionStorage.set).toHaveBeenCalledWith('last_activity', expect.any(String));
    });

    it('should extend a session', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Start session first
      act(() => {
        screen.getByTestId('start-session').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      const initialExpiresAt = screen.getByTestId('expires-at').textContent;

      // Extend session
      act(() => {
        screen.getByTestId('extend-session').click();
      });

      await waitFor(() => {
        const newExpiresAt = screen.getByTestId('expires-at').textContent;
        expect(newExpiresAt).not.toBe(initialExpiresAt);
      });
    });

    it('should end a session', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Start session first
      act(() => {
        screen.getByTestId('start-session').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      // End session
      act(() => {
        screen.getByTestId('end-session').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('expires-at')).toHaveTextContent('null');
      });

      // Verify storage was cleared
      expect(sessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Session Warnings', () => {
    it('should show and hide warnings', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Show warning
      act(() => {
        screen.getByTestId('show-warning-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('show-warning')).toHaveTextContent('true');
      });

      // Hide warning
      act(() => {
        screen.getByTestId('hide-warning-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('show-warning')).toHaveTextContent('false');
      });
    });

    it('should automatically show warning before expiry', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Start session
      act(() => {
        screen.getByTestId('start-session').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      // Fast forward to warning time (50 seconds, warning at 50 seconds)
      act(() => {
        jest.advanceTimersByTime(50000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('show-warning')).toHaveTextContent('true');
      });
    });
  });

  describe('Session Restoration', () => {
    it('should restore session from storage', async () => {
      const futureTimestamp = Date.now() + 60000; // 1 minute in future
      
      // Mock stored session data
      (sessionStorage.get as jest.Mock).mockImplementation((key) => {
        switch (key) {
          case 'session_expiry':
            return futureTimestamp.toString();
          case 'session_start':
            return (Date.now() - 30000).toString(); // Started 30 seconds ago
          case 'last_activity':
            return Date.now().toString();
          default:
            return null;
        }
      });

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('expires-at')).toHaveTextContent(futureTimestamp.toString());
      });
    });

    it('should not restore expired session', async () => {
      const pastTimestamp = Date.now() - 60000; // 1 minute in past
      
      // Mock expired session data
      (sessionStorage.get as jest.Mock).mockImplementation((key) => {
        switch (key) {
          case 'session_expiry':
            return pastTimestamp.toString();
          default:
            return null;
        }
      });

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });

      // Should clear expired session
      expect(sessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Session Expiry', () => {
    it('should automatically logout when session expires', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Start session
      act(() => {
        screen.getByTestId('start-session').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      // Fast forward past expiry time
      act(() => {
        jest.advanceTimersByTime(65000); // 65 seconds (past 60 second session)
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      // Mock storage to throw errors
      (sessionStorage.set as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Should not crash when starting session
      expect(() => {
        act(() => {
          screen.getByTestId('start-session').click();
        });
      }).not.toThrow();
    });
  });
});