import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HighlightCardProps {
  title: string;
  description: string;
  features: Array<{
    icon: ReactNode;
    text: string;
    color: string;
  }>;
  delay?: number;
}

export function HighlightCard({ title, description, features, delay = 0 }: HighlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 80,
        damping: 20
      }}
      className="relative group"
    >
      {/* Glassmorphism card */}
      <div className="relative bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-white/20 shadow-2xl overflow-hidden">
        
        {/* Animated background gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
        
        {/* Gradient border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        
        <div className="relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-300/30 dark:border-blue-700/30 backdrop-blur-sm">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                NEXT-GEN PLATFORM
              </span>
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {title}
          </motion.h3>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-slate-700 dark:text-slate-300 text-center leading-relaxed mb-8 text-lg"
          >
            {description}
          </motion.p>
          
          {/* Features grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: delay + 0.6 + (index * 0.1),
                  type: "spring",
                  stiffness: 100
                }}
                className="flex items-center gap-3 group/feature"
              >
                <div className={`w-2 h-2 rounded-full ${feature.color} group-hover/feature:scale-125 transition-transform duration-200`} />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover/feature:text-slate-800 dark:group-hover/feature:text-slate-200 transition-colors duration-200 font-medium">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  );
}