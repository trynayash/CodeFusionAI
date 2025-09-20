/**
 * Session Timer Hook
 * 
 * Custom hook for managing session timers and state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { UseSessionTimerReturn, SessionConfig } from '@/types/session';
import { useSession } from '@/contexts/SessionContext';
import { SessionDataHelpers } from '@/utils/sessionStorage';
import { log } from '@/utils/logger';

export function useSessionTimer(): UseSessionTimerReturn {
  const session = useSession();
  const [remainingTime, setRemainingTime] = useState(0);
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update remaining time
  const updateRemainingTime = useCallback(() => {
    if (!session.isAuthenticated || !session.expiresAt) {
      setRemainingTime(0);
      setShouldShowWarning(false);
      return;
    }

    const remaining = SessionDataHelpers.getRemainingTime(session.expiresAt);
    setRemainingTime(remaining);

    // Check if we should show warning
    const shouldWarn = remaining <= session.config.warningTime && remaining > 0;
    setShouldShowWarning(shouldWarn);

    // Log remaining time periodically (every minute)
    if (remaining % (60 * 1000) < 1000) {
      log.debug('Session time remaining', {
        remaining,
        formatted: SessionDataHelpers.formatRemainingTime(remaining),
        shouldWarn
      }, 'SESSION_TIMER');
    }
  }, [session.isAuthenticated, session.expiresAt, session.config.warningTime]);

  // Start/stop timer updates
  useEffect(() => {
    if (session.isAuthenticated && session.expiresAt) {
      // Update immediately
      updateRemainingTime();

      // Set up interval for updates
      updateIntervalRef.current = setInterval(updateRemainingTime, 1000);

      log.debug('Started session timer updates', {
        expiresAt: session.expiresAt,
        interval: 1000
      }, 'SESSION_TIMER');
    } else {
      // Clear interval if not authenticated
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      
      setRemainingTime(0);
      setShouldShowWarning(false);
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [session.isAuthenticated, session.expiresAt, updateRemainingTime]);

  // Enhanced actions with logging
  const enhancedActions = {
    ...session,
    startSession: useCallback(() => {
      log.info('Starting session via useSessionTimer', undefined, 'SESSION_TIMER');
      session.startSession();
    }, [session]),

    extendSession: useCallback(() => {
      log.info('Extending session via useSessionTimer', {
        currentRemaining: remainingTime,
        extension: session.config.extensionDuration
      }, 'SESSION_TIMER');
      session.extendSession();
    }, [session, remainingTime]),

    endSession: useCallback(() => {
      log.info('Ending session via useSessionTimer', undefined, 'SESSION_TIMER');
      session.endSession();
    }, [session]),

    updateActivity: useCallback(() => {
      session.updateActivity();
    }, [session]),

    showSessionWarning: useCallback(() => {
      log.info('Showing session warning via useSessionTimer', {
        remainingTime
      }, 'SESSION_TIMER');
      session.showSessionWarning();
    }, [session, remainingTime]),

    hideSessionWarning: useCallback(() => {
      log.info('Hiding session warning via useSessionTimer', undefined, 'SESSION_TIMER');
      session.hideSessionWarning();
    }, [session]),

    isSessionExpired: useCallback(() => {
      const expired = session.isSessionExpired();
      if (expired) {
        log.warn('Session expired check via useSessionTimer', undefined, 'SESSION_TIMER');
      }
      return expired;
    }, [session]),

    getRemainingTime: useCallback(() => {
      return remainingTime;
    }, [remainingTime]),
  };

  return {
    sessionState: {
      isAuthenticated: session.isAuthenticated,
      expiresAt: session.expiresAt,
      showWarning: session.showWarning,
      isExtending: session.isExtending,
      lastActivity: session.lastActivity,
      sessionStart: session.sessionStart,
    },
    actions: enhancedActions,
    config: session.config,
    shouldShowWarning,
    remainingTime,
  };
}

/**
 * Hook for session timer display formatting
 */
export function useSessionDisplay() {
  const { remainingTime, sessionState, config } = useSessionTimer();

  const formatTime = useCallback((time: number) => {
    return SessionDataHelpers.formatRemainingTime(time);
  }, []);

  const getTimeColor = useCallback((time: number) => {
    if (time <= 30 * 1000) return 'text-red-500'; // Last 30 seconds
    if (time <= config.warningTime) return 'text-yellow-500'; // Warning period
    return 'text-green-500'; // Safe time
  }, [config.warningTime]);

  const getProgressPercentage = useCallback((time: number) => {
    if (!sessionState.sessionStart || !sessionState.expiresAt) return 0;
    
    const totalDuration = sessionState.expiresAt - sessionState.sessionStart;
    const elapsed = Date.now() - sessionState.sessionStart;
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    
    return progress;
  }, [sessionState.sessionStart, sessionState.expiresAt]);

  const isInWarningPeriod = remainingTime <= config.warningTime && remainingTime > 0;
  const isCritical = remainingTime <= 30 * 1000 && remainingTime > 0;

  return {
    remainingTime,
    formattedTime: formatTime(remainingTime),
    timeColor: getTimeColor(remainingTime),
    progressPercentage: getProgressPercentage(remainingTime),
    isInWarningPeriod,
    isCritical,
    isActive: sessionState.isAuthenticated && remainingTime > 0,
  };
}

/**
 * Hook for session metrics and analytics
 */
export function useSessionMetrics() {
  const { sessionState, config } = useSessionTimer();
  const [extensionCount, setExtensionCount] = useState(0);

  // Track extensions
  useEffect(() => {
    if (sessionState.isExtending) {
      setExtensionCount(prev => prev + 1);
    }
  }, [sessionState.isExtending]);

  // Reset count on new session
  useEffect(() => {
    if (sessionState.sessionStart) {
      setExtensionCount(0);
    }
  }, [sessionState.sessionStart]);

  const getSessionDuration = useCallback(() => {
    if (!sessionState.sessionStart) return 0;
    return Date.now() - sessionState.sessionStart;
  }, [sessionState.sessionStart]);

  const getIdleTime = useCallback(() => {
    return Date.now() - sessionState.lastActivity;
  }, [sessionState.lastActivity]);

  const getEfficiencyScore = useCallback(() => {
    const totalDuration = getSessionDuration();
    const idleTime = getIdleTime();
    
    if (totalDuration === 0) return 100;
    
    const activeTime = totalDuration - idleTime;
    return Math.max(0, Math.min(100, (activeTime / totalDuration) * 100));
  }, [getSessionDuration, getIdleTime]);

  return {
    extensionCount,
    sessionDuration: getSessionDuration(),
    idleTime: getIdleTime(),
    efficiencyScore: getEfficiencyScore(),
    isIdle: getIdleTime() > 5 * 60 * 1000, // 5 minutes idle
    sessionStart: sessionState.sessionStart,
    lastActivity: sessionState.lastActivity,
  };
}