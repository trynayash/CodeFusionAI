import React, { useState, useEffect } from 'react';
import { Code, BookOpen, DollarSign, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import CodeFusionLogo from '@/components/CodeFusionLogo';

export function Header() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
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
            className="cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <CodeFusionLogo size="md" animated={true} showText={true} />
          </motion.div>

          {/* Navigation Menu - Desktop */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
              onClick={() => navigate('/editor')}
            >
              <Code className="w-4 h-4" />
              Code Editor
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
              onClick={() => navigate('/courses')}
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
              onClick={() => navigate('/pricing')}
            >
              <DollarSign className="w-4 h-4" />
              Pricing
            </Button>
          </motion.nav>

          {/* Login/Signup Buttons */}
          <div className="flex items-center space-x-3">
            {!user ? (
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
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
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center space-x-3"
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
          </div>
        </div>

      </div>
    </motion.header>
  );
}