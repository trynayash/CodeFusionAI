/**
 * Session Management Types
 * 
 * Comprehensive TypeScript types for session timeout functionality
 */

export interface SessionConfig {
  /** Session duration in milliseconds (default: 15 minutes) */
  sessionDuration: number;
  /** Warning time before expiry in milliseconds (default: 1 minute) */
  warningTime: number;
  /** Extension duration in milliseconds (default: 10 minutes) */
  extensionDuration: number;
  /** Check interval for session status in milliseconds (default: 30 seconds) */
  checkInterval: number;
}

export interface SessionState {
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Session expiry timestamp */
  expiresAt: number | null;
  /** Whether session warning modal is shown */
  showWarning: boolean;
  /** Whether session is being extended */
  isExtending: boolean;
  /** Last activity timestamp */
  lastActivity: number;
  /** Session start timestamp */
  sessionStart: number | null;
}

export interface SessionActions {
  /** Start a new session */
  startSession: () => void;
  /** Extend current session */
  extendSession: () => void;
  /** End session and logout */
  endSession: () => void;
  /** Update last activity timestamp */
  updateActivity: () => void;
  /** Show session warning modal */
  showSessionWarning: () => void;
  /** Hide session warning modal */
  hideSessionWarning: () => void;
  /** Check if session is expired */
  isSessionExpired: () => boolean;
  /** Get remaining session time in milliseconds */
  getRemainingTime: () => number;
}

export interface SessionContextValue extends SessionState, SessionActions {
  /** Session configuration */
  config: SessionConfig;
}

export interface SessionWarningModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Remaining time in seconds */
  remainingTime: number;
  /** Callback when user extends session */
  onExtend: () => void;
  /** Callback when user logs out */
  onLogout: () => void;
  /** Callback when modal is closed */
  onClose: () => void;
}

export interface UseSessionTimerReturn {
  /** Current session state */
  sessionState: SessionState;
  /** Session actions */
  actions: SessionActions;
  /** Session configuration */
  config: SessionConfig;
  /** Whether session warning should be shown */
  shouldShowWarning: boolean;
  /** Remaining time until expiry in milliseconds */
  remainingTime: number;
}

export interface UseAuthModalReturn {
  /** Whether modal is open */
  isOpen: boolean;
  /** Open the modal */
  open: () => void;
  /** Close the modal */
  close: () => void;
  /** Toggle modal state */
  toggle: () => void;
}

export type SessionStorageKey = 'session_expiry' | 'session_start' | 'last_activity';

export interface SessionStorage {
  /** Get value from storage */
  get: (key: SessionStorageKey) => string | null;
  /** Set value in storage */
  set: (key: SessionStorageKey, value: string) => void;
  /** Remove value from storage */
  remove: (key: SessionStorageKey) => void;
  /** Clear all session storage */
  clear: () => void;
}

export interface SessionEvent {
  type: 'session_start' | 'session_extend' | 'session_warning' | 'session_expire' | 'session_end';
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface SessionMetrics {
  /** Total session duration */
  totalDuration: number;
  /** Number of extensions */
  extensionCount: number;
  /** Time until warning was shown */
  warningTime: number;
  /** Whether session expired naturally */
  expiredNaturally: boolean;
}