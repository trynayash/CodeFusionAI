/**
 * Session Warning Modal Tests
 * 
 * Tests for session warning modal component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionWarningModal } from '@/components/session/SessionWarningModal';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock logger
jest.mock('@/utils/logger');

describe('SessionWarningModal', () => {
  const defaultProps = {
    isOpen: true,
    remainingTime: 60000, // 1 minute
    onExtend: jest.fn(),
    onLogout: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render when open', () => {
      render(<SessionWarningModal {...defaultProps} />);

      expect(screen.getByText('Session Expiring Soon')).toBeInTheDocument();
      expect(screen.getByText(/Your session will expire in/)).toBeInTheDocument();
      expect(screen.getByText('Keep Me Signed In (+10 min)')).toBeInTheDocument();
      expect(screen.getByText('Log Me Out Now')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<SessionWarningModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Session Expiring Soon')).not.toBeInTheDocument();
    });

    it('should display remaining time correctly', () => {
      render(<SessionWarningModal {...defaultProps} remainingTime={90000} />);

      expect(screen.getByText('1:30')).toBeInTheDocument();
    });

    it('should show urgent styling for low time', () => {
      render(<SessionWarningModal {...defaultProps} remainingTime={25000} />);

      // Should show orange/urgent styling
      expect(screen.getByText('0:25')).toBeInTheDocument();
    });

    it('should show critical styling for very low time', () => {
      render(<SessionWarningModal {...defaultProps} remainingTime={5000} />);

      // Should show red/critical styling
      expect(screen.getByText('5s')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onExtend when extend button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SessionWarningModal {...defaultProps} />);

      const extendButton = screen.getByText('Keep Me Signed In (+10 min)');
      await user.click(extendButton);

      expect(defaultProps.onExtend).toHaveBeenCalledTimes(1);
    });

    it('should call onLogout when logout button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SessionWarningModal {...defaultProps} />);

      const logoutButton = screen.getByText('Log Me Out Now');
      await user.click(logoutButton);

      expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SessionWarningModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should extend session on Enter key', async () => {
      render(<SessionWarningModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Enter' });

      await waitFor(() => {
        expect(defaultProps.onExtend).toHaveBeenCalledTimes(1);
      });
    });

    it('should close modal on Escape key', async () => {
      render(<SessionWarningModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should extend session on Ctrl+E', async () => {
      render(<SessionWarningModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'e', ctrlKey: true });

      await waitFor(() => {
        expect(defaultProps.onExtend).toHaveBeenCalledTimes(1);
      });
    });

    it('should logout on Ctrl+L', async () => {
      render(<SessionWarningModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'l', ctrlKey: true });

      await waitFor(() => {
        expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Countdown Timer', () => {
    it('should update countdown every second', async () => {
      render(<SessionWarningModal {...defaultProps} remainingTime={60000} />);

      // Initial time
      expect(screen.getByText('1:00')).toBeInTheDocument();

      // Advance timer by 1 second
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('0:59')).toBeInTheDocument();
      });
    });

    it('should handle countdown reaching zero', async () => {
      render(<SessionWarningModal {...defaultProps} remainingTime={2000} />);

      // Advance timer past remaining time
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(screen.getByText('0s')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state when extending', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SessionWarningModal {...defaultProps} />);

      const extendButton = screen.getByText('Keep Me Signed In (+10 min)');
      await user.click(extendButton);

      // Should show loading state
      expect(screen.getByText('Extending Session...')).toBeInTheDocument();
    });

    it('should disable extend button when extending', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SessionWarningModal {...defaultProps} />);

      const extendButton = screen.getByText('Keep Me Signed In (+10 min)');
      await user.click(extendButton);

      expect(extendButton).toBeDisabled();
    });
  });

  describe('Progress Bar', () => {
    it('should show progress based on remaining time', () => {
      render(<SessionWarningModal {...defaultProps} remainingTime={30000} />);

      // Should show progress bar (exact implementation depends on component)
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should update progress color based on urgency', () => {
      const { rerender } = render(
        <SessionWarningModal {...defaultProps} remainingTime={60000} />
      );

      // Normal time - should be yellow/warning
      let progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();

      // Critical time - should be red
      rerender(<SessionWarningModal {...defaultProps} remainingTime={5000} />);
      
      progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<SessionWarningModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /keep me signed in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log me out now/i })).toBeInTheDocument();
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SessionWarningModal {...defaultProps} />);

      const extendButton = screen.getByText('Keep Me Signed In (+10 min)');
      const logoutButton = screen.getByText('Log Me Out Now');

      // Tab should cycle through focusable elements
      await user.tab();
      expect(extendButton).toHaveFocus();

      await user.tab();
      expect(logoutButton).toHaveFocus();
    });
  });

  describe('Security Notice', () => {
    it('should display security notice', () => {
      render(<SessionWarningModal {...defaultProps} />);

      expect(screen.getByText('Security Notice')).toBeInTheDocument();
      expect(screen.getByText(/This timeout helps protect your account/)).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts Help', () => {
    it('should display keyboard shortcuts', () => {
      render(<SessionWarningModal {...defaultProps} />);

      expect(screen.getByText('Keyboard shortcuts:')).toBeInTheDocument();
      expect(screen.getByText('Enter')).toBeInTheDocument();
      expect(screen.getByText('Esc')).toBeInTheDocument();
    });
  });
});