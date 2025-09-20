/**
 * Auth with Session Integration Hook
 * 
 * Integrates authentication with session management
 */

import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSession } from '@/contexts/SessionContext';
import { log } from '@/utils/logger';

export function useAuthWithSession() {
  const auth = useAuth();
  const session = useSession();

  // Start session when user logs in
  useEffect(() => {
    if (auth.user && !session.isAuthenticated) {
      log.info('User authenticated, starting session', {
        userId: auth.user.id,
        email: auth.user.email
      }, 'AUTH_SESSION');
      
      session.startSession();
    }
  }, [auth.user, session.isAuthenticated, session]);

  // Enhanced sign in with session start
  const signInWithSession = useCallback(async (email: string, password: string) => {
    log.info('Attempting sign in with session management', { email }, 'AUTH_SESSION');
    
    const result = await auth.signIn(email, password);
    
    if (!result.error) {
      log.info('Sign in successful, session will be started automatically', undefined, 'AUTH_SESSION');
    }
    
    return result;
  }, [auth]);

  // Enhanced sign up with session start
  const signUpWithSession = useCallback(async (
    email: string, 
    password: string, 
    fullName: string, 
    username: string
  ) => {
    log.info('Attempting sign up with session management', { email, username }, 'AUTH_SESSION');
    
    const result = await auth.signUp(email, password, fullName, username);
    
    if (!result.error) {
      log.info('Sign up successful, session will be started when email is verified', undefined, 'AUTH_SESSION');
    }
    
    return result;
  }, [auth]);

  // Enhanced sign out with session end
  const signOutWithSession = useCallback(async () => {
    log.info('Signing out with session management', undefined, 'AUTH_SESSION');
    
    // End session first
    if (session.isAuthenticated) {
      await session.endSession();
    }
    
    // Then sign out from auth
    await auth.signOut();
    
    log.info('Sign out complete', undefined, 'AUTH_SESSION');
  }, [auth, session]);

  return {
    // Auth state
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    
    // Enhanced auth methods
    signIn: signInWithSession,
    signUp: signUpWithSession,
    signOut: signOutWithSession,
    
    // Session state
    sessionState: {
      isAuthenticated: session.isAuthenticated,
      expiresAt: session.expiresAt,
      showWarning: session.showWarning,
      isExtending: session.isExtending,
      remainingTime: session.getRemainingTime(),
    },
    
    // Session actions
    extendSession: session.extendSession,
    endSession: session.endSession,
    updateActivity: session.updateActivity,
  };
}