/**
 * Auth Modal Hook
 * 
 * Custom hook for managing authentication modal state and behavior
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { UseAuthModalReturn } from '@/types/session';
import { useSession } from '@/contexts/SessionContext';
import { log } from '@/utils/logger';

export function useAuthModal(): UseAuthModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Open modal
  const open = useCallback(() => {
    log.info('Opening auth modal', undefined, 'AUTH_MODAL');
    setIsOpen(true);
  }, []);

  // Close modal
  const close = useCallback(() => {
    log.info('Closing auth modal', undefined, 'AUTH_MODAL');
    setIsOpen(false);
    
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Toggle modal
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Auto-open modal when session warning is shown
  useEffect(() => {
    if (session.showWarning && !isOpen) {
      log.info('Auto-opening auth modal due to session warning', undefined, 'AUTH_MODAL');
      open();
    }
  }, [session.showWarning, isOpen, open]);

  // Auto-close modal when session warning is hidden
  useEffect(() => {
    if (!session.showWarning && isOpen) {
      log.info('Auto-closing auth modal as session warning was dismissed', undefined, 'AUTH_MODAL');
      close();
    }
  }, [session.showWarning, isOpen, close]);

  // Auto-close modal when session ends
  useEffect(() => {
    if (!session.isAuthenticated && isOpen) {
      log.info('Auto-closing auth modal as session ended', undefined, 'AUTH_MODAL');
      close();
    }
  }, [session.isAuthenticated, isOpen, close]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * Hook for managing modal auto-close behavior
 */
export function useModalAutoClose(
  isOpen: boolean,
  onClose: () => void,
  autoCloseDelay: number = 30000 // 30 seconds default
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Set auto-close timer
      timeoutRef.current = setTimeout(() => {
        log.info('Auto-closing modal due to timeout', { delay: autoCloseDelay }, 'MODAL_AUTO_CLOSE');
        onClose();
      }, autoCloseDelay);
    } else {
      // Clear timer if modal is closed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, onClose, autoCloseDelay]);

  // Return remaining time until auto-close
  const getRemainingAutoCloseTime = useCallback(() => {
    // This would require more complex state tracking
    // For now, return the full delay when open, 0 when closed
    return isOpen ? autoCloseDelay : 0;
  }, [isOpen, autoCloseDelay]);

  return {
    getRemainingAutoCloseTime,
  };
}

/**
 * Hook for modal keyboard shortcuts
 */
export function useModalKeyboard(
  isOpen: boolean,
  onExtend: () => void,
  onLogout: () => void,
  onClose: () => void
) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          log.info('Modal: Enter key pressed - extending session', undefined, 'MODAL_KEYBOARD');
          onExtend();
          break;
        
        case 'Escape':
          event.preventDefault();
          log.info('Modal: Escape key pressed - closing modal', undefined, 'MODAL_KEYBOARD');
          onClose();
          break;
        
        case 'l':
        case 'L':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            log.info('Modal: Ctrl+L pressed - logging out', undefined, 'MODAL_KEYBOARD');
            onLogout();
          }
          break;
        
        case 'e':
        case 'E':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            log.info('Modal: Ctrl+E pressed - extending session', undefined, 'MODAL_KEYBOARD');
            onExtend();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onExtend, onLogout, onClose]);
}

/**
 * Hook for modal focus management
 */
export function useModalFocus(isOpen: boolean) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    
    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  return {
    modalRef,
  };
}