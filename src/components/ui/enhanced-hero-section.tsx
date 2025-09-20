import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconScoutAsset, useIconScoutAsset } from '@/components/ui/iconscout-asset';
import { ArrowRight, Play, Star, Users, Code, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EnhancedHeroSection: React.FC = () => {
  const navigate = useNavigate();

  // Fetch IconScout assets for the hero section
  const { asset: aiIcon } = useIconScoutAsset('3d-icon', 'artificial intelligence robot', { style: '3d' });
  const { asset: codingIllustration } = useIconScoutAsset('illustration', 'programming coding developer', { style: 'modern' });
  const { asset: animationAsset } = useIconScoutAsset('lottie-animation', 'coding animation', {});

  const stats = [
    { icon: Users, label: 'Active Users', value: '50K+' },
    { icon: Code, label: 'Languages', value: '50+' },
    { icon: Star, label: 'Rating', value: '4.9' },
    { icon: Zap, label: 'Projects', value: '100K+' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Floating 3D Icons */}
      <div className="absolute top-20 left-10 opacity-60">
        {aiIcon && (
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <IconScoutAsset
              url={aiIcon.url}
              alt="AI Robot Icon"
              type="3d-icon"
              size="xl"
              className="w-20 h-20"
            />
          </motion.div>
        )}
      </div>

      <div className="absolute top-32 right-16 opacity-40">
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <IconScoutAsset
            url="/api/placeholder/80/80"
            alt="Code Icon"
            type="3d-icon"
            size="lg"
            className="w-16 h-16"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-32 left-20 opacity-50">
        <motion.div
          animate={{ 
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <IconScoutAsset
            url="/api/placeholder/60/60"
            alt="Settings Icon"
            type="3d-icon"
            size="md"
            className="w-12 h-12"
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                🚀 AI-Powered Development Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Code with
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {" "}AI Power
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Experience the future of coding with our AI-powered platform. 
                Write, debug, and deploy code in 50+ programming languages with 
                intelligent assistance and real-time collaboration.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold"
                onClick={() => navigate('/auth')}
              >
                Start Coding Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold"
                onClick={() => navigate('/features')}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Illustration */}
              <div className="relative z-10">
                {codingIllustration ? (
                  <IconScoutAsset
                    url={codingIllustration.url}
                    alt="Coding Illustration"
                    type="illustration"
                    className="w-full h-auto max-w-lg mx-auto"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Code className="w-24 h-24 text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold">AI-Powered Coding</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Animation */}
              {animationAsset && (
                <motion.div
                  className="absolute -top-10 -right-10 w-32 h-32"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <IconScoutAsset
                    url={animationAsset.url}
                    alt="Coding Animation"
                    type="lottie-animation"
                    className="w-full h-full"
                    autoPlay={true}
                    loop={true}
                  />
                </motion.div>
              )}

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/10 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default EnhancedHeroSection;