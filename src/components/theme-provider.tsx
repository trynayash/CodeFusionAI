/**
 * Dark Theme Provider (Fixed Dark Mode)
 * 
 * CodeFusion AI is locked to dark theme for the optimal coding experience!
 * Features:
 * - Permanent dark mode (no theme switching)
 * - Optimized dark color palette
 * - Performance optimized
 * - Consistent dark theme across all components
 */

import React, { createContext, useContext, useEffect } from 'react';
import { log } from '@/utils/logger';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: 'dark';
  storageKey?: string;
};

type ThemeProviderState = {
  theme: 'dark';
  actualTheme: 'dark';
  setTheme: () => void;
  toggleTheme: () => void;
  isSystemTheme: false;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  setCustomColors: () => void;
};

const darkThemeColors = {
  primary: 'hsl(210 40% 98%)',
  secondary: 'hsl(217.2 32.6% 17.5%)',
  accent: 'hsl(217.2 32.6% 17.5%)',
  background: 'hsl(222.2 84% 4.9%)',
  foreground: 'hsl(210 40% 98%)',
  muted: 'hsl(217.2 32.6% 17.5%)',
  border: 'hsl(217.2 32.6% 17.5%)',
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  actualTheme: 'dark',
  setTheme: () => null,
  toggleTheme: () => null,
  isSystemTheme: false,
  themeColors: darkThemeColors,
  setCustomColors: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'codefusion-theme',
  ...props
}: ThemeProviderProps) {

  // Apply dark theme on mount and ensure it stays dark
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Force dark theme
    root.classList.add('dark');
    
    // Apply dark theme colors
    Object.entries(darkThemeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', darkThemeColors.background);
    }

    // Clear any old theme preferences and set to dark
    localStorage.setItem(storageKey, 'dark');
    
    log.info('🌙 CodeFusion AI locked to dark theme for the best coding experience!', undefined, 'THEME');
  }, [storageKey]);

  const value: ThemeProviderState = {
    theme: 'dark',
    actualTheme: 'dark',
    setTheme: () => {
      // No-op: theme is permanently locked to dark
      log.debug('Theme change attempted but CodeFusion AI is locked to dark mode for optimal experience', undefined, 'THEME');
    },
    toggleTheme: () => {
      // No-op: theme is permanently locked to dark
      log.debug('Theme toggle attempted but CodeFusion AI is locked to dark mode for optimal experience', undefined, 'THEME');
    },
    isSystemTheme: false,
    themeColors: darkThemeColors,
    setCustomColors: () => {
      // No-op: colors are optimized for dark theme
      log.debug('Custom colors attempted but CodeFusion AI uses optimized dark theme colors', undefined, 'THEME');
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// ThemeToggle component removed - CodeFusion AI is permanently dark themed!
// This ensures no theme switching UI appears anywhere in the app
// The dark theme provides the best coding experience! 🌙✨