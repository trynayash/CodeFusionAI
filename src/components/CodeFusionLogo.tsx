import React from 'react';
import { motion } from 'framer-motion';
import logoSrc from '@/assets/CodeFusionAI.png';

interface CodeFusionLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
}

const CodeFusionLogo: React.FC<CodeFusionLogoProps> = ({ 
  className = '', 
  size = 'md', 
  animated = true,
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-18 h-18',
    xl: 'w-28 h-28'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        initial={animated ? { scale: 0, rotate: -180 } : {}}
        animate={animated ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.img
          src={logoSrc}
          alt="CodeFusionAI"
          className="w-full h-full object-contain drop-shadow-lg"
          whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
          transition={{ duration: 0.3 }}
        />
        
        {/* Glow Effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          className={`font-bold brand-font ${textSizeClasses[size]}`}
          initial={animated ? { opacity: 0, x: -20 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="text-white">
            CodeFusionAI
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default CodeFusionLogo;
