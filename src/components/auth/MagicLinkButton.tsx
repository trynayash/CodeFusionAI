import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MagicLinkButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function MagicLinkButton({ onClick, disabled = false, className }: MagicLinkButtonProps) {
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
          "border-2 transition-all duration-300 ease-out overflow-hidden",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/70",
          
          // Magic link specific styles
          "bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100",
          "dark:from-purple-950/30 dark:to-blue-950/30 dark:hover:from-purple-900/40 dark:hover:to-blue-900/40",
          "border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:hover:border-purple-700",
          "text-purple-700 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-200",
          
          // Glow effect
          "hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] dark:hover:shadow-[0_0_25px_rgba(147,51,234,0.2)]",
          "hover:shadow-lg transform-gpu will-change-transform",
          
          // Disabled state
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
          
          // Custom className
          className
        )}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.1), rgba(59,130,246,0.1), rgba(147,51,234,0.1), transparent)',
          }}
        />

        {/* Sparkle animation overlay */}
        <div className="absolute inset-0 rounded-2xl">
          <motion.div
            className="absolute top-2 right-4 text-purple-400/60"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-4 text-blue-400/60"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Sparkles className="w-2 h-2" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-center gap-3 z-10">
          <motion.div
            className="flex-shrink-0"
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Send className="w-5 h-5" />
          </motion.div>
          <span className="font-medium">
            Send Magic Link ✨
          </span>
        </div>

        {/* Hover glow overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Button>
    </motion.div>
  );
}