import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OAuthButtonProps {
  provider: 'google' | 'github' | 'linkedin';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const providerConfig = {
  google: {
    name: 'Google',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    baseClasses: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-sm',
    darkClasses: 'dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 dark:border-gray-300',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(66,133,244,0.3)]',
    focusRing: 'focus:ring-blue-500/70'
  },
  github: {
    name: 'GitHub',
    icon: <Github className="w-5 h-5 text-white" />,
    baseClasses: 'bg-gray-900 hover:bg-gray-800 text-white border-gray-700',
    darkClasses: 'dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(55,65,81,0.4)]',
    focusRing: 'focus:ring-gray-500/70'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5 text-white" />,
    baseClasses: 'bg-[#0A66C2] hover:bg-[#004182] text-white border-[#0A66C2]',
    darkClasses: 'dark:bg-[#0A66C2] dark:hover:bg-[#004182] dark:border-[#0A66C2]',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]',
    focusRing: 'focus:ring-blue-600/70'
  }
};

export function OAuthButton({ provider, onClick, disabled = false, className }: OAuthButtonProps) {
  const config = providerConfig[provider];

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          // Base styles
          "relative w-full h-12 px-6 py-3 rounded-2xl font-semibold text-sm",
          "border-2 transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          
          // Provider-specific styles
          config.baseClasses,
          config.darkClasses,
          config.hoverGlow,
          config.focusRing,
          
          // Hover effects
          "hover:border-opacity-80 hover:shadow-lg",
          "transform-gpu will-change-transform",
          
          // Disabled state
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
          
          // Custom className
          className
        )}
      >
        {/* Content with proper z-index */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          <div className="flex-shrink-0">
            {config.icon}
          </div>
          <span className={cn(
            "font-medium transition-colors duration-200",
            // Ensure text color is always visible
            provider === 'google' && "text-gray-900 hover:text-gray-900",
            provider === 'github' && "text-white hover:text-white", 
            provider === 'linkedin' && "text-white hover:text-white"
          )}>
            Continue with {config.name}
          </span>
        </div>
      </Button>
    </motion.div>
  );
}