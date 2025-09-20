/**
 * Session Warning Modal Component
 * 
 * Beautiful modal that warns users about session expiry and allows extension
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  LogOut, 
  RefreshCw, 
  AlertTriangle, 
  Shield, 
  Timer,
  Zap,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SessionWarningModalProps } from '@/types/session';
import { SessionDataHelpers } from '@/utils/sessionStorage';
import { useModalKeyboard, useModalFocus } from '@/hooks/useAuthModal';
import { log } from '@/utils/logger';

export function SessionWarningModal({
  isOpen,
  remainingTime,
  onExtend,
  onLogout,
  onClose,
}: SessionWarningModalProps) {
  const [countdown, setCountdown] = useState(remainingTime);
  const [isExtending, setIsExtending] = useState(false);
  const { modalRef } = useModalFocus(isOpen);

  // Update countdown every second
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Sync countdown with remainingTime prop
  useEffect(() => {
    setCountdown(remainingTime);
  }, [remainingTime]);

  // Handle extend session with loading state
  const handleExtend = async () => {
    setIsExtending(true);
    log.info('User extending session from modal', { remainingTime: countdown }, 'SESSION_MODAL');
    
    try {
      await onExtend();
    } catch (error) {
      log.error('Error extending session', error as Error, 'SESSION_MODAL');
    } finally {
      setIsExtending(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    log.info('User logging out from modal', { remainingTime: countdown }, 'SESSION_MODAL');
    onLogout();
  };

  // Handle close
  const handleClose = () => {
    log.info('User closing session modal', { remainingTime: countdown }, 'SESSION_MODAL');
    onClose();
  };

  // Keyboard shortcuts
  useModalKeyboard(isOpen, handleExtend, handleLogout, handleClose);

  // Calculate progress percentage (0-100)
  const progressPercentage = Math.max(0, (countdown / (60 * 1000)) * 100); // Based on 1 minute warning
  const isUrgent = countdown <= 30 * 1000; // Last 30 seconds
  const isCritical = countdown <= 10 * 1000; // Last 10 seconds

  // Format time display
  const formattedTime = SessionDataHelpers.formatRemainingTime(countdown);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        ref={modalRef}
        className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={handleClose}
      >
        <DialogHeader className="text-center space-y-4">
          {/* Animated Warning Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isCritical 
                ? 'bg-red-500/20 text-red-400' 
                : isUrgent 
                ? 'bg-orange-500/20 text-orange-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              <motion.div
                animate={{ 
                  scale: isCritical ? [1, 1.2, 1] : [1, 1.1, 1],
                  rotate: isCritical ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: isCritical ? 0.5 : 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle className="w-8 h-8" />
              </motion.div>
            </div>
          </motion.div>

          <DialogTitle className="text-xl font-bold text-slate-200">
            Session Expiring Soon
          </DialogTitle>
          
          <DialogDescription className="text-slate-400 text-center">
            Your session will expire in{' '}
            <motion.span 
              key={formattedTime}
              initial={{ scale: 1.2, color: isCritical ? '#ef4444' : isUrgent ? '#f97316' : '#eab308' }}
              animate={{ scale: 1, color: isCritical ? '#ef4444' : isUrgent ? '#f97316' : '#eab308' }}
              className="font-mono font-bold"
            >
              {formattedTime}
            </motion.span>
            . Would you like to extend your session?
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              Time Remaining
            </span>
            <Badge 
              variant={isCritical ? "destructive" : isUrgent ? "secondary" : "outline"}
              className="font-mono"
            >
              {formattedTime}
            </Badge>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${
              isCritical 
                ? '[&>div]:bg-red-500' 
                : isUrgent 
                ? '[&>div]:bg-orange-500'
                : '[&>div]:bg-yellow-500'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleExtend}
            disabled={isExtending}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              {isExtending ? (
                <motion.div
                  key="extending"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                  Extending Session...
                </motion.div>
              ) : (
                <motion.div
                  key="extend"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Keep Me Signed In (+10 min)
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Me Out Now
          </Button>
        </div>

        {/* Security Notice */}
        <div className="bg-slate-800/50 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300 mb-1">Security Notice</p>
              <p>
                This timeout helps protect your account from unauthorized access. 
                Your session will be automatically terminated if no action is taken.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="text-xs text-slate-500 text-center space-y-1">
          <p>Keyboard shortcuts:</p>
          <div className="flex justify-center gap-4">
            <span><kbd className="px-1 py-0.5 bg-slate-700 rounded text-slate-300">Enter</kbd> Extend</span>
            <span><kbd className="px-1 py-0.5 bg-slate-700 rounded text-slate-300">Esc</kbd> Close</span>
          </div>
        </div>

        {/* Close Button */}
        <Button
          onClick={handleClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Compact Session Warning Modal for mobile/small screens
 */
export function CompactSessionWarningModal({
  isOpen,
  remainingTime,
  onExtend,
  onLogout,
  onClose,
}: SessionWarningModalProps) {
  const [countdown, setCountdown] = useState(remainingTime);
  const [isExtending, setIsExtending] = useState(false);

  // Update countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    setCountdown(remainingTime);
  }, [remainingTime]);

  const handleExtend = async () => {
    setIsExtending(true);
    try {
      await onExtend();
    } finally {
      setIsExtending(false);
    }
  };

  const formattedTime = SessionDataHelpers.formatRemainingTime(countdown);
  const isCritical = countdown <= 10 * 1000;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
        >
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    scale: isCritical ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: isCritical ? Infinity : 0,
                  }}
                >
                  <AlertTriangle className={`w-5 h-5 ${
                    isCritical ? 'text-red-400' : 'text-yellow-400'
                  }`} />
                </motion.div>
                <span className="text-sm font-medium text-slate-200">
                  Session expires in {formattedTime}
                </span>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleExtend}
                disabled={isExtending}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isExtending ? (
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <Zap className="w-3 h-3 mr-1" />
                )}
                Extend
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}