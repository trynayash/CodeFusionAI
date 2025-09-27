import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Zap,
  Shield,
  Code,
  Users,
  BookOpen,
  Target,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Rocket,
  Globe,
  Cpu,
  Database,
  Network,
  Layers,
  Sparkles,
  Lightbulb,
  Monitor,
  Coffee,
  MessageSquare,
  Heart,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
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
  const particles = Array.from({ length: 30 }, (_, i) => ({
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

export default function Features() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI Code Generation",
      description: "Generate complex code structures instantly with context-aware AI that understands your project",
      gradient: "from-blue-500 to-cyan-500",
      features: ["Natural language to code", "Context-aware suggestions", "Multi-language support", "Code optimization"]
    },
    {
      icon: Shield,
      title: "Smart Debugging",
      description: "Identify and fix bugs before they cause issues with intelligent error detection and solutions",
      gradient: "from-purple-500 to-pink-500",
      features: ["Real-time error detection", "Automated fixes", "Performance optimization", "Security scanning"]
    },
    {
      icon: BookOpen,
      title: "Personalized Learning",
      description: "Adaptive learning paths that evolve with your skill level and coding style preferences",
      gradient: "from-green-500 to-teal-500",
      features: ["Custom learning paths", "Interactive tutorials", "Progress tracking", "Skill assessments"]
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with instant responses and seamless integration into your workflow",
      gradient: "from-orange-500 to-red-500",
      features: ["Sub-second responses", "Cloud-powered", "Offline capability", "Auto-save"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time collaboration and shared AI insights",
      gradient: "from-indigo-500 to-purple-500",
      features: ["Real-time sync", "Shared workspaces", "Team analytics", "Code reviews"]
    },
    {
      icon: Target,
      title: "Project Optimization",
      description: "Comprehensive project analysis with actionable insights for better code quality",
      gradient: "from-pink-500 to-rose-500",
      features: ["Code quality metrics", "Performance insights", "Best practice suggestions", "Refactoring tips"]
    },
    {
      icon: Code,
      title: "Advanced Editor",
      description: "Professional code editor with syntax highlighting, IntelliSense, and multi-language support",
      gradient: "from-cyan-500 to-blue-500",
      features: ["Syntax highlighting", "Code completion", "Error detection", "Multiple themes"]
    },
    {
      icon: Database,
      title: "Cloud Storage",
      description: "Your code is automatically saved and synced across all your devices securely",
      gradient: "from-emerald-500 to-green-500",
      features: ["Auto-save functionality", "Cross-device sync", "Version history", "Secure encryption"]
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Support for 50+ programming languages with specialized AI assistance for each",
      gradient: "from-violet-500 to-purple-500",
      features: ["50+ languages", "Language-specific AI", "Framework support", "Library integration"]
    }
  ];

  const stats = [
    { icon: Users, value: 50000, suffix: '+', label: 'Active Developers', color: 'from-blue-500 to-cyan-500' },
    { icon: Code, value: 100, suffix: 'M+', label: 'Lines Generated', color: 'from-purple-500 to-pink-500' },
    { icon: Brain, value: 99, suffix: '%', label: 'AI Accuracy', color: 'from-green-500 to-teal-500' },
    { icon: Zap, value: 2, suffix: 's', label: 'Response Time', color: 'from-orange-500 to-red-500' },
  ];

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
              <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Features
              </a>
              <a href="/courses" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Courses
              </a>
              <a href="/pricing" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Pricing
              </a>
              <a href="/about" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
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
        {showMobileMenu && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700">
            <div className="px-4 py-4 space-y-2">
              <a href="#features" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                Features
              </a>
              <a href="/courses" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                Courses
              </a>
              <a href="/pricing" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                Pricing
              </a>
              <a href="/about" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                About
              </a>
            </div>
          </div>
        )}
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
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              <span className="text-sm text-blue-400 font-medium">Comprehensive Feature Set</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Powerful Features for
                <br />
              <span className="text-white">
                Modern Development
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover the comprehensive suite of AI-powered tools designed to accelerate your development workflow and enhance your coding experience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
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
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Explore Features
              </Button>
            </motion.div>
          </motion.div>
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
              Join the CodeFusionAI community that's revolutionizing software development
            </p>
          </motion.div>

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
              Comprehensive Feature Set
              </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to build, learn, and collaborate in one powerful platform
              </p>
            </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
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
              Support for All Major Languages
              </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get AI assistance for 50+ programming languages and frameworks
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
                {" "}Experience These Features?
              </span>
              </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of developers who are already using these powerful features to build amazing applications
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <CodeFusionLogo size="md" animated={false} showText={true} />
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Empowering the next generation of developers through AI-powered learning and intelligent code assistance.
              </p>
              
              {/* Newsletter */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Stay Updated
                </h4>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your email" 
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                  />
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="/features" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Features</a></li>
                <li><a href="/pricing" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Pricing</a></li>
                <li><a href="/ai-assistant" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">AI Assistant</a></li>
                
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/documentation" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Documentation</a></li>
                
                <li><a href="/blog" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Blog</a></li>
                <li><a href="/community" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">About Us</a></li>
                <li><a href="/careers" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Careers</a></li>
                <li><a href="/contact" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Contact</a></li>
                <li><a href="/privacy-policy" className="text-slate-300 hover:text-white transition-colors transition-transform duration-200 hover:translate-x-1">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              © 2025 CodeFusionAI. All rights reserved. Made with <Heart className="w-4 h-4 text-red-500" /> for developers
            </p>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="https://github.com" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}