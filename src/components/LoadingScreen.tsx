import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeFusionLogo from './CodeFusionLogo';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingMessages = [
    "Initializing AI Core...",
    "Synchronizing Data Streams...",
    "Compiling Neural Modules...",
    "Optimizing Neural Network...",
    "Loading CodeFusionAI...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          setTimeout(() => onComplete(), 1000);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [onComplete, loadingMessages.length]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50"
        >
          {/* Background Code Streams */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-gray-700 text-xs font-mono"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: 'clamp(8px, 0.6vw, 12px)',
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.2, 0],
                  y: [0, -30, -60],
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {Math.random() > 0.5 ? 'const ai = new AI();' : 'neuralNetwork.train();'}
              </motion.div>
            ))}
          </div>

          {/* Main Container - Fluid Responsive Layout */}
          <div className="h-full w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Central Content Container */}
            <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-12 lg:space-y-16 w-full max-w-6xl">
              
              {/* Animated Globe - Responsive Sizing */}
              <motion.div
                className="relative flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Outer Orbital Rings - Responsive */}
                <motion.div
                  className="absolute border border-blue-500/20 rounded-full"
                  style={{
                    width: 'clamp(200px, 25vw, 400px)',
                    height: 'clamp(200px, 25vw, 400px)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div
                    className="absolute bg-blue-500 rounded-full top-0 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: 'clamp(8px, 1vw, 16px)',
                      height: 'clamp(8px, 1vw, 16px)',
                    }}
                    animate={{ 
                      boxShadow: [
                        '0 0 8px #3B82F6',
                        '0 0 16px #3B82F6',
                        '0 0 8px #3B82F6'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <motion.div
                  className="absolute border border-cyan-500/20 rounded-full"
                  style={{
                    width: 'clamp(160px, 20vw, 320px)',
                    height: 'clamp(160px, 20vw, 320px)',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div
                    className="absolute bg-cyan-500 rounded-full top-0 right-0"
                    style={{
                      width: 'clamp(6px, 0.8vw, 12px)',
                      height: 'clamp(6px, 0.8vw, 12px)',
                    }}
                    animate={{ 
                      boxShadow: [
                        '0 0 6px #06B6D4',
                        '0 0 12px #06B6D4',
                        '0 0 6px #06B6D4'
                      ]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                </motion.div>

                {/* Main Globe Sphere - Responsive */}
                <motion.div
                  className="relative"
                  style={{
                    width: 'clamp(120px, 15vw, 240px)',
                    height: 'clamp(120px, 15vw, 240px)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  {/* Wireframe Globe */}
                  <div className="absolute inset-0 rounded-full border border-blue-500/30">
                    {/* Grid Pattern */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`v-${i}`}
                        className="absolute w-px h-full bg-blue-500/20"
                        style={{ left: `${(i + 1) * 16.66}%` }}
                        animate={{
                          opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.3,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                    
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={`h-${i}`}
                        className="absolute w-full h-px bg-blue-500/20"
                        style={{ top: `${(i + 1) * 20}%` }}
                        animate={{
                          opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.4,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>

                  {/* Data Packets - Responsive */}
                  {[
                    { x: 25, y: 30, color: 'blue' },
                    { x: 70, y: 25, color: 'cyan' },
                    { x: 60, y: 70, color: 'blue' },
                    { x: 30, y: 75, color: 'cyan' },
                    { x: 75, y: 50, color: 'blue' },
                    { x: 20, y: 55, color: 'cyan' },
                  ].map((packet, index) => (
                    <motion.div
                      key={index}
                      className={`absolute bg-${packet.color}-500 rounded-sm`}
                      style={{
                        left: `${packet.x}%`,
                        top: `${packet.y}%`,
                        width: 'clamp(4px, 0.5vw, 8px)',
                        height: 'clamp(3px, 0.4vw, 6px)',
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                        boxShadow: [
                          `0 0 4px var(--${packet.color}-500)`,
                          `0 0 12px var(--${packet.color}-500)`,
                          `0 0 4px var(--${packet.color}-500)`,
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        delay: index * 0.5,
                        repeat: Infinity,
                      }}
                    />
                  ))}

                  {/* Neural Network Nodes - Responsive */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180);
                    const radius = 35;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    
                    return (
                      <motion.div
                        key={`node-${i}`}
                        className="absolute bg-blue-400 rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: 'clamp(3px, 0.4vw, 6px)',
                          height: 'clamp(3px, 0.4vw, 6px)',
                        }}
                        animate={{
                          opacity: [0.2, 1, 0.2],
                          scale: [0.5, 1.5, 0.5],
                          boxShadow: [
                            '0 0 4px #60A5FA',
                            '0 0 12px #60A5FA',
                            '0 0 4px #60A5FA',
                          ],
                        }}
                        transition={{
                          duration: 4,
                          delay: i * 0.3,
                          repeat: Infinity,
                        }}
                      />
                    );
                  })}

                  {/* Central Core - Responsive */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: 'clamp(12px, 1.5vw, 24px)',
                      height: 'clamp(12px, 1.5vw, 24px)',
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        '0 0 15px rgba(59, 130, 246, 0.4)',
                        '0 0 30px rgba(59, 130, 246, 0.7)',
                        '0 0 15px rgba(59, 130, 246, 0.4)',
                      ],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Logo and Text Section - Responsive */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {/* Logo - Responsive Sizing */}
                <div className="flex-shrink-0">
                  <CodeFusionLogo 
                    size="lg" 
                    animated={true} 
                    showText={false}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
                  />
                </div>
                
                {/* Text - Responsive Typography */}
                <div className="text-center sm:text-left">
                  <h1 className="brand-text leading-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
                    CodeFusionAI
                  </h1>
                </div>
              </motion.div>

              {/* Loading Section - Responsive */}
              <motion.div
                className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 w-full max-w-md sm:max-w-lg lg:max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {/* Loading Text */}
                <h2 
                  className="text-gray-300 font-medium"
                  style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
                >
                  Loading...
                </h2>
                
                {/* Progress Bar - Responsive */}
                <div 
                  className="w-full bg-gray-800 rounded-full overflow-hidden"
                  style={{ height: 'clamp(4px, 0.5vw, 8px)' }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Status Messages - Responsive */}
                <motion.div
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-400 font-mono text-center"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                >
                  {loadingMessages[currentMessage]}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
