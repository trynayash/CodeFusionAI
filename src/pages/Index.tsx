import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Eye, 
  Star, 
  ArrowRight, 
  Menu,
  X,
  Rocket,
  Brain,
  Zap,
  BookOpen,
  Code,
  Shield,
  BarChart3,
  Github,
  Twitter,
  Linkedin,
  Heart,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ChevronRight,
  Activity,
  Target,
  Award,
  Globe,
  Cpu,
  Database,
  Network,
  Layers,
  Sparkles,
  Lightbulb,
  ArrowUpRight,
  Download,
  Upload,
  Monitor,
  Palette,
  Coffee,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingScreen from '@/components/LoadingScreen';
import { Footer } from '@/components/ui/footer';
import CodeFusionLogo from '@/components/CodeFusionLogo';

// Import language icons
import pythonIcon from '@/assets/All_logo_and_pictures-main/programming languages/python.svg';
import javascriptIcon from '@/assets/All_logo_and_pictures-main/programming languages/javascript.svg';
import typescriptIcon from '@/assets/All_logo_and_pictures-main/programming languages/typescript.svg';
import javaIcon from '@/assets/All_logo_and_pictures-main/programming languages/java.svg';
import cppIcon from '@/assets/All_logo_and_pictures-main/programming languages/c++.svg';
import reactIcon from '@/assets/All_logo_and_pictures-main/frameworks/react.svg';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Hero Code Editor Component
const HeroCodeEditor = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const codeLines = [
    { line: 1, content: "import React from 'react';", color: "text-blue-400" },
    { line: 2, content: "import { useState } from 'react';", color: "text-blue-400" },
    { line: 3, content: "", color: "" },
    { line: 4, content: "const App = () => {", color: "text-purple-400" },
    { line: 5, content: "  const [count, setCount] = useState(0);", color: "text-green-400" },
    { line: 6, content: "", color: "" },
    { line: 7, content: "  return (", color: "text-purple-400" },
    { line: 8, content: "    <div className='app'>", color: "text-cyan-400" },
    { line: 9, content: "      <h1>Count: {count}</h1>", color: "text-cyan-400" },
    { line: 10, content: "      <button onClick={() => setCount(count + 1)}>", color: "text-cyan-400" },
    { line: 11, content: "        Increment", color: "text-white" },
    { line: 12, content: "      </button>", color: "text-cyan-400" },
    { line: 13, content: "    </div>", color: "text-cyan-400" },
    { line: 14, content: "  );", color: "text-purple-400" },
    { line: 15, content: "};", color: "text-purple-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % codeLines.length);
    }, 800);
    return () => clearInterval(interval);
  }, [codeLines.length]);

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
                <div className="text-slate-400 text-sm font-mono brand-text">CodeFusionAI Editor</div>
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 font-mono text-sm">
        {codeLines.map((codeLine, index) => (
          <motion.div
            key={codeLine.line}
            className={`flex items-center gap-3 py-1 ${
              index === currentLine ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''
            }`}
          initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="text-slate-500 w-8 text-right">{codeLine.line}</span>
            <span className={codeLine.color || 'text-slate-300'}>
              {codeLine.content}
            </span>
            {index === currentLine && (
            <motion.div
                className="w-2 h-4 bg-blue-500"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            </motion.div>
      ))}
      </div>

      {/* AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mx-4 mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 text-xs font-medium">AI Suggestion</span>
        </div>
        <p className="text-slate-300 text-xs">
          Consider adding error boundaries and loading states for better UX
        </p>
      </motion.div>
    </div>
  );
};

// Stats Component
const StatsSection = () => {
  const stats = [
    { icon: Users, value: 50000, suffix: '+', label: 'Active Developers', color: 'from-blue-500 to-cyan-500' },
    { icon: Code, value: 100, suffix: 'M+', label: 'Lines Generated', color: 'from-purple-500 to-pink-500' },
    { icon: Brain, value: 99, suffix: '%', label: 'AI Accuracy', color: 'from-green-500 to-teal-500' },
    { icon: Zap, value: 2, suffix: 's', label: 'Response Time', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center group"
        >
          <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl p-4 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon className="w-full h-full text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter end={stat.value} />
            {stat.suffix}
          </div>
          <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
          </div>
  );
};

export default function Index() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <CodeFusionLogo size="md" animated={true} showText={true} />
            </div>

            {/* Navigation Menu - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/features" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Features
              </a>
              <a href="#courses" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Courses
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Pricing
              </a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                About
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-6 h-6 text-slate-300" /> : <Menu className="w-6 h-6 text-slate-300" />}
              </button>
            </div>
          </div>
          </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700"
            >
              <div className="px-4 py-4 space-y-2">
                <a href="/features" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                  Features
                </a>
                <a href="#courses" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                  Courses
                </a>
                <a href="#pricing" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                  Pricing
                </a>
                <a href="#about" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                  About
                </a>
              </div>
              </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <FloatingParticles />
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">AI-Powered Development Platform</span>
              </motion.div>

                {/* Main Headline */}
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold leading-tight text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Code Smarter.
                  <br />
                  <span className="text-white">
                    Build Faster.
                  </span>
                </motion.h1>
                
                {/* Description */}
                <motion.p 
                  className="text-xl text-slate-300 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                Transform your development workflow with AI-powered code generation, 
                intelligent debugging, and personalized learning paths. The future of coding is here.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button 
                    size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => navigate('/auth')}
                  >
                  <Rocket className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Start Building Free
                  </Button>
                
                  <Button 
                    size="lg"
                    variant="outline"
                  className="border-2 border-slate-600 hover:border-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl bg-transparent hover:bg-blue-500/10 transition-all duration-300 group"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  <span>Loved By Many Fresh Developers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-300 text-sm">Join Them Now</span>
                  </div>
                </motion.div>
              </motion.div>

            {/* Right Side - Code Editor */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <HeroCodeEditor />
              
              {/* Floating Elements */}
                          <motion.div 
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 shadow-lg"
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="w-full h-full text-white" />
                          </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg"
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Zap className="w-full h-full text-white" />
              </motion.div>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Trusted by Developers Worldwide
                </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join the community that's revolutionizing software development
              </p>
            </motion.div>

          <StatsSection />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Supercharge Your Development
              </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the next generation of coding tools powered by advanced AI
              </p>
            </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Code Generation",
                description: "Generate complex code structures instantly with context-aware AI that understands your project",
                gradient: "from-blue-500 to-cyan-500",
                features: ["Natural language to code", "Context-aware suggestions", "Multi-language support"]
              },
              {
                icon: Shield,
                title: "Smart Debugging",
                description: "Identify and fix bugs before they cause issues with intelligent error detection and solutions",
                gradient: "from-purple-500 to-pink-500",
                features: ["Real-time error detection", "Automated fixes", "Performance optimization"]
              },
              {
                icon: BookOpen,
                title: "Personalized Learning",
                description: "Adaptive learning paths that evolve with your skill level and coding style preferences",
                gradient: "from-green-500 to-teal-500",
                features: ["Custom learning paths", "Interactive tutorials", "Progress tracking"]
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for speed with instant responses and seamless integration into your workflow",
                gradient: "from-orange-500 to-red-500",
                features: ["Sub-second responses", "Cloud-powered", "Offline capability"]
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Work together seamlessly with real-time collaboration and shared AI insights",
                gradient: "from-indigo-500 to-purple-500",
                features: ["Real-time sync", "Shared workspaces", "Team analytics"]
              },
              {
                icon: Target,
                title: "Project Optimization",
                description: "Comprehensive project analysis with actionable insights for better code quality",
                gradient: "from-pink-500 to-rose-500",
                features: ["Code quality metrics", "Performance insights", "Best practice suggestions"]
              }
            ].map((feature, index) => (
                  <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                className="group"
              >
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
          </div>
            </motion.div>
            ))}
            </div>
          </div>
        </section>

      {/* Programming Languages Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Master Any Language
              </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get AI assistance for all major programming languages and frameworks
              </p>
            </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {[
              { name: 'JavaScript', icon: javascriptIcon },
              { name: 'Python', icon: pythonIcon },
              { name: 'React', icon: reactIcon },
              { name: 'TypeScript', icon: typescriptIcon },
              { name: 'Java', icon: javaIcon },
              { name: 'C++', icon: cppIcon },
            ].map((lang, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <img src={lang.icon} alt={lang.name} className="w-16 h-16 mx-auto" />
                <h3 className="text-sm font-medium text-white mt-2">{lang.name}</h3>
              </motion.div>
            ))}
          </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              Ready to 
              <span className="text-white">
                {" "}Code the Future?
              </span>
                </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of developers who are already building tomorrow's applications with AI-powered tools
                </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => navigate('/auth')}
                  >
                <Rocket className="mr-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                Start Building Now
                  </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free to start</span>
                </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
                </div>
            </div>
              </motion.div>
          </div>
        </section>

      <Footer brandSize="lg" />
    </div>
  );
}