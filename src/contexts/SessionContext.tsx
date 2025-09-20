/**
 * Session Context Provider
 * 
 * Global session management with timeout, warnings, and automatic logout
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContextValue, SessionState, SessionActions, SessionConfig, SessionEvent } from '@/types/session';
import { sessionStorage, SessionDataHelpers } from '@/utils/sessionStorage';
import { useAuth } from '@/hooks/useAuth';
import { log } from '@/utils/logger';

// Default session configuration
const DEFAULT_CONFIG: SessionConfig = {
  sessionDuration: 15 * 60 * 1000, // 15 minutes
  warningTime: 1 * 60 * 1000, // 1 minute before expiry
  extensionDuration: 10 * 60 * 1000, // 10 minutes extension
  checkInterval: 30 * 1000, // Check every 30 seconds
};

// Session state actions
type SessionAction =
  | { type: 'START_SESSION'; payload: { expiresAt: number; sessionStart: number } }
  | { type: 'EXTEND_SESSION'; payload: { expiresAt: number } }
  | { type: 'END_SESSION' }
  | { type: 'UPDATE_ACTIVITY'; payload: { lastActivity: number } }
  | { type: 'SHOW_WARNING' }
  | { type: 'HIDE_WARNING' }
  | { type: 'SET_EXTENDING'; payload: { isExtending: boolean } }
  | { type: 'RESTORE_SESSION'; payload: Partial<SessionState> };

// Initial session state
const initialState: SessionState = {
  isAuthenticated: false,
  expiresAt: null,
  showWarning: false,
  isExtending: false,
  lastActivity: Date.now(),
  sessionStart: null,
};

// Session reducer
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        expiresAt: action.payload.expiresAt,
        sessionStart: action.payload.sessionStart,
        lastActivity: Date.now(),
        showWarning: false,
        isExtending: false,
      };

    case 'EXTEND_SESSION':
      return {
        ...state,
        expiresAt: action.payload.expiresAt,
        lastActivity: Date.now(),
        showWarning: false,
        isExtending: false,
      };

    case 'END_SESSION':
      return {
        ...initialState,
        lastActivity: Date.now(),
      };

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: action.payload.lastActivity,
      };

    case 'SHOW_WARNING':
      return {
        ...state,
        showWarning: true,
      };

    case 'HIDE_WARNING':
      return {
        ...state,
        showWarning: false,
      };

    case 'SET_EXTENDING':
      return {
        ...state,
        isExtending: action.payload.isExtending,
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// Create context
const SessionContext = createContext<SessionContextValue | null>(null);

// Session provider props
interface SessionProviderProps {
  children: React.ReactNode;
  config?: Partial<SessionConfig>;
}

export function SessionProvider({ children, config: userConfig }: SessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const config: SessionConfig = { ...DEFAULT_CONFIG, ...userConfig };
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const expiryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Event tracking
  const trackSessionEvent = useCallback((event: SessionEvent) => {
    log.info(`Session event: ${event.type}`, event, 'SESSION');
  }, []);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (expiryTimeoutRef.current) {
      clearTimeout(expiryTimeoutRef.current);
      expiryTimeoutRef.current = null;
    }
  }, []);

  // Force logout
  const forceLogout = useCallback(async () => {
    log.warn('Session expired - forcing logout', undefined, 'SESSION');
    
    trackSessionEvent({
      type: 'session_expire',
      timestamp: Date.now(),
      data: { reason: 'timeout' }
    });

    clearTimers();
    sessionStorage.clear();
    dispatch({ type: 'END_SESSION' });
    
    try {
      await signOut();
    } catch (error) {
      log.error('Error during forced logout', error as Error, 'SESSION');
    }
    
    navigate('/auth', { replace: true });
  }, [signOut, navigate, clearTimers, trackSessionEvent]);

  // Setup session timers
  const setupTimers = useCallback((expiresAt: number) => {
    clearTimers();

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const timeUntilWarning = timeUntilExpiry - config.warningTime;

    log.debug('Setting up session timers', {
      expiresAt,
      timeUntilExpiry,
      timeUntilWarning,
      warningTime: config.warningTime
    }, 'SESSION');

    // Set warning timer
    if (timeUntilWarning > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        log.info('Showing session warning', undefined, 'SESSION');
        dispatch({ type: 'SHOW_WARNING' });
        
        trackSessionEvent({
          type: 'session_warning',
          timestamp: Date.now(),
          data: { remainingTime: config.warningTime }
        });
      }, timeUntilWarning);
    } else {
      // If we're already in warning period, show warning immediately
      dispatch({ type: 'SHOW_WARNING' });
    }

    // Set expiry timer
    if (timeUntilExpiry > 0) {
      expiryTimeoutRef.current = setTimeout(() => {
        forceLogout();
      }, timeUntilExpiry);
    } else {
      // Session already expired
      forceLogout();
    }

    // Set periodic check interval
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime >= expiresAt) {
        forceLogout();
      }
    }, config.checkInterval);
  }, [config, clearTimers, forceLogout, trackSessionEvent]);

  // Session actions
  const actions: SessionActions = {
    startSession: useCallback(() => {
      const now = Date.now();
      const expiresAt = now + config.sessionDuration;
      
      log.info('Starting new session', { expiresAt, duration: config.sessionDuration }, 'SESSION');
      
      // Store in persistent storage
      sessionStorage.set('session_expiry', SessionDataHelpers.formatTimestamp(expiresAt));
      sessionStorage.set('session_start', SessionDataHelpers.formatTimestamp(now));
      sessionStorage.set('last_activity', SessionDataHelpers.formatTimestamp(now));
      
      dispatch({ 
        type: 'START_SESSION', 
        payload: { expiresAt, sessionStart: now } 
      });
      
      setupTimers(expiresAt);
      
      trackSessionEvent({
        type: 'session_start',
        timestamp: now,
        data: { duration: config.sessionDuration }
      });
    }, [config.sessionDuration, setupTimers, trackSessionEvent]),

    extendSession: useCallback(() => {
      const now = Date.now();
      const newExpiresAt = now + config.extensionDuration;
      
      log.info('Extending session', { newExpiresAt, extension: config.extensionDuration }, 'SESSION');
      
      dispatch({ type: 'SET_EXTENDING', payload: { isExtending: true } });
      
      // Update storage
      sessionStorage.set('session_expiry', SessionDataHelpers.formatTimestamp(newExpiresAt));
      sessionStorage.set('last_activity', SessionDataHelpers.formatTimestamp(now));
      
      setTimeout(() => {
        dispatch({ 
          type: 'EXTEND_SESSION', 
          payload: { expiresAt: newExpiresAt } 
        });
        
        setupTimers(newExpiresAt);
        
        trackSessionEvent({
          type: 'session_extend',
          timestamp: now,
          data: { extension: config.extensionDuration }
        });
      }, 500); // Small delay for UX
    }, [config.extensionDuration, setupTimers, trackSessionEvent]),

    endSession: useCallback(async () => {
      log.info('Ending session manually', undefined, 'SESSION');
      
      trackSessionEvent({
        type: 'session_end',
        timestamp: Date.now(),
        data: { reason: 'manual' }
      });

      clearTimers();
      sessionStorage.clear();
      dispatch({ type: 'END_SESSION' });
      
      try {
        await signOut();
      } catch (error) {
        log.error('Error during manual logout', error as Error, 'SESSION');
      }
      
      navigate('/auth', { replace: true });
    }, [signOut, navigate, clearTimers, trackSessionEvent]),

    updateActivity: useCallback(() => {
      const now = Date.now();
      sessionStorage.set('last_activity', SessionDataHelpers.formatTimestamp(now));
      dispatch({ type: 'UPDATE_ACTIVITY', payload: { lastActivity: now } });
    }, []),

    showSessionWarning: useCallback(() => {
      dispatch({ type: 'SHOW_WARNING' });
    }, []),

    hideSessionWarning: useCallback(() => {
      dispatch({ type: 'HIDE_WARNING' });
    }, []),

    isSessionExpired: useCallback(() => {
      if (!state.expiresAt) return false;
      return Date.now() >= state.expiresAt;
    }, [state.expiresAt]),

    getRemainingTime: useCallback(() => {
      if (!state.expiresAt) return 0;
      return SessionDataHelpers.getRemainingTime(state.expiresAt);
    }, [state.expiresAt]),
  };

  // Restore session on mount
  useEffect(() => {
    if (!user) return;

    const storedExpiry = sessionStorage.get('session_expiry');
    const storedStart = sessionStorage.get('session_start');
    const storedActivity = sessionStorage.get('last_activity');

    if (storedExpiry) {
      const expiresAt = SessionDataHelpers.parseTimestamp(storedExpiry);
      const sessionStart = SessionDataHelpers.parseTimestamp(storedStart);
      const lastActivity = SessionDataHelpers.parseTimestamp(storedActivity) || Date.now();

      if (expiresAt && SessionDataHelpers.isValidFutureTimestamp(expiresAt)) {
        log.info('Restoring session from storage', { expiresAt, sessionStart, lastActivity }, 'SESSION');
        
        dispatch({
          type: 'RESTORE_SESSION',
          payload: {
            isAuthenticated: true,
            expiresAt,
            sessionStart,
            lastActivity,
            showWarning: false,
            isExtending: false,
          }
        });

        setupTimers(expiresAt);
      } else {
        log.warn('Stored session expired, clearing storage', { expiresAt }, 'SESSION');
        sessionStorage.clear();
      }
    }
  }, [user, setupTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Update activity on user interaction
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const handleActivity = () => {
      actions.updateActivity();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [state.isAuthenticated, actions]);

  const contextValue: SessionContextValue = {
    ...state,
    ...actions,
    config,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session context
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}