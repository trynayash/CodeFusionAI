import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Sparkles, LogOut, User, BookOpen, Brain, Zap, DollarSign, MessageCircle, HelpCircle, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import logoSvg from '@/assets/logo-cool.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const menuItems = [
    { name: 'Tutorials', icon: BookOpen, path: '/courses' },
    { name: 'Code Editor', icon: Code, path: '/editor' },
    { name: 'AI Assistant', icon: Brain, path: '/ai-assistant' },
    { name: 'Features', icon: Zap, path: '/features' },
    { name: 'Pricing', icon: DollarSign, path: '/pricing' },
    { name: 'Community', icon: MessageCircle, path: '/community' },
    { name: 'Help', icon: HelpCircle, path: '/help' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl border-b border-border/30 shadow-lg"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <motion.img 
                src={logoSvg} 
                alt="CodeFusion AI" 
                className="h-10 w-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-lg blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <motion.h1 
              className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
            >
              CodeFusion AI
            </motion.h1>
          </motion.div>

          {/* Login/Signup Buttons - Always visible */}
          <div className="flex items-center space-x-3">
            {!user ? (
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="gradient" 
                  size="sm"
                  className="glow-hover shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/auth')}
                >
                  Sign Up
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:flex items-center space-x-3"
              >
                <Button 
                  variant="glass" 
                  size="sm"
                  className="text-foreground/80 hover:text-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-foreground/80 hover:text-primary"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            )}

            
            {/* Hamburger Menu Button */}
            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-2 rounded-lg hover:bg-muted/50 transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Hamburger Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-border/30 bg-background/95 backdrop-blur-xl"
            >
              <motion.nav 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="py-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-4">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 text-left group hover:scale-105 active:scale-95"
                        onClick={() => handleNavigation(item.path)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.name === 'Tutorials' && 'Learn step by step'}
                            {item.name === 'Code Editor' && 'Write and test code'}
                            {item.name === 'AI Assistant' && 'Get coding help'}
                            {item.name === 'Features' && 'Explore capabilities'}
                            {item.name === 'Pricing' && 'View plans'}
                            {item.name === 'Community' && 'Join discussions'}
                            {item.name === 'Help' && 'Get support'}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Mobile User Actions */}
                {user && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="mt-4 pt-4 border-t border-border/30 px-4 md:hidden"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="glass" 
                        className="justify-start"
                        onClick={() => handleNavigation('/dashboard')}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}