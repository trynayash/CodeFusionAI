/**
 * Session Manager Component
 * 
 * Global session management component that handles warnings and timeouts
 */

import React from 'react';
import { SessionWarningModal, CompactSessionWarningModal } from './SessionWarningModal';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useAuth } from '@/hooks/useAuth';
import { log } from '@/utils/logger';

export function SessionManager() {
  const { user } = useAuth();
  const { sessionState, actions, remainingTime, shouldShowWarning } = useSessionTimer();
  const { isOpen, close } = useAuthModal();

  // Don't render if user is not authenticated
  if (!user || !sessionState.isAuthenticated) {
    return null;
  }

  // Handle extend session
  const handleExtend = async () => {
    log.info('Extending session from SessionManager', {
      remainingTime,
      currentExpiry: sessionState.expiresAt
    }, 'SESSION_MANAGER');
    
    actions.extendSession();
    actions.hideSessionWarning();
    close();
  };

  // Handle logout
  const handleLogout = async () => {
    log.info('Logging out from SessionManager', {
      remainingTime,
      reason: 'user_choice'
    }, 'SESSION_MANAGER');
    
    await actions.endSession();
    close();
  };

  // Handle close modal (dismiss warning)
  const handleClose = () => {
    log.info('Dismissing session warning from SessionManager', {
      remainingTime
    }, 'SESSION_MANAGER');
    
    actions.hideSessionWarning();
    close();
  };

  // Show modal if session warning is active or should show warning
  const showModal = sessionState.showWarning || shouldShowWarning || isOpen;

  return (
    <>
      {/* Desktop Modal */}
      <SessionWarningModal
        isOpen={showModal}
        remainingTime={remainingTime}
        onExtend={handleExtend}
        onLogout={handleLogout}
        onClose={handleClose}
      />

      {/* Mobile Compact Modal */}
      <CompactSessionWarningModal
        isOpen={showModal}
        remainingTime={remainingTime}
        onExtend={handleExtend}
        onLogout={handleLogout}
        onClose={handleClose}
      />
    </>
  );
}

/**
 * Session Status Indicator Component
 * 
 * Shows session status in the UI (optional)
 */
export function SessionStatusIndicator() {
  const { sessionState, remainingTime } = useSessionTimer();
  const { user } = useAuth();

  // Don't show if not authenticated
  if (!user || !sessionState.isAuthenticated) {
    return null;
  }

  // Don't show if plenty of time remaining (more than 5 minutes)
  if (remainingTime > 5 * 60 * 1000) {
    return null;
  }

  const minutes = Math.floor(remainingTime / (60 * 1000));
  const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
  const isUrgent = remainingTime <= 60 * 1000; // Last minute
  const isCritical = remainingTime <= 30 * 1000; // Last 30 seconds

  return (
    <div className={`fixed top-20 right-4 z-40 px-3 py-2 rounded-lg text-xs font-mono ${
      isCritical 
        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
        : isUrgent 
        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    }`}>
      Session: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

/**
 * Session Debug Panel (Development Only)
 */
export function SessionDebugPanel() {
  const { sessionState, actions, config, remainingTime } = useSessionTimer();
  const { user } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Don't show if not authenticated
  if (!user || !sessionState.isAuthenticated) {
    return null;
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-slate-900/90 border border-slate-700 rounded-lg p-4 text-xs font-mono text-slate-300 max-w-sm">
      <div className="font-bold text-slate-200 mb-2">Session Debug</div>
      
      <div className="space-y-1">
        <div>Status: {sessionState.isAuthenticated ? 'Active' : 'Inactive'}</div>
        <div>Remaining: {formatTime(remainingTime)}</div>
        <div>Warning: {sessionState.showWarning ? 'Yes' : 'No'}</div>
        <div>Extending: {sessionState.isExtending ? 'Yes' : 'No'}</div>
        <div>Expires: {sessionState.expiresAt ? new Date(sessionState.expiresAt).toLocaleTimeString() : 'N/A'}</div>
        <div>Started: {sessionState.sessionStart ? new Date(sessionState.sessionStart).toLocaleTimeString() : 'N/A'}</div>
      </div>

      <div className="flex gap-1 mt-3">
        <button
          onClick={actions.showSessionWarning}
          className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
        >
          Show Warning
        </button>
        <button
          onClick={actions.extendSession}
          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
        >
          Extend
        </button>
        <button
          onClick={actions.endSession}
          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          End
        </button>
      </div>
    </div>
  );
}