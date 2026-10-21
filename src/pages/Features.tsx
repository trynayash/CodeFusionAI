import { Footer } from '@/components/ui/footer';
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
  Twitter
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
      icon: Code,
      title: "Browser Code Editor",
      description: "A Monaco editor (the editor behind VS Code) with a picker for 13 languages. The Run button shows a simulated result. Code is not executed on a server",
      gradient: "from-blue-500 to-cyan-500",
      features: ["Syntax highlighting", "Hello World starter code", "Basic syntax checks before a run"]
    },
    {
      icon: Database,
      title: "Saved Snippets",
      description: "Save code snippets to your account. They are stored in Supabase and listed on your dashboard",
      gradient: "from-emerald-500 to-green-500",
      features: ["Save and load snippets", "Recent activity on the dashboard"]
    },
    {
      icon: Shield,
      title: "Code Tips",
      description: "Panels that explain code and suggest fixes using rule-based pattern checks. They do not call a live AI model",
      gradient: "from-purple-500 to-pink-500",
      features: ["Common error checks", "Refactoring hints", "Performance hints"]
    },
    {
      icon: BookOpen,
      title: "Courses",
      description: "A course catalog where each lesson links to a free video or article",
      gradient: "from-green-500 to-teal-500",
      features: ["Learning paths", "Lesson progress tracking", "Completion certificates with a verify page"]
    },
    {
      icon: Users,
      title: "Accounts",
      description: "Sign in with email and password, a magic link, or Google and GitHub, using Supabase Auth",
      gradient: "from-indigo-500 to-purple-500",
      features: ["Email verification", "Password reset", "Session timeout warning"]
    }
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
              <span className="text-sm text-blue-400 font-medium">Features</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              What You Can Do
                <br />
              <span className="text-white">
                in CodeFusion AI
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A short list of what the app does today, and what it does not do yet.
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
              Feature List
              </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              There is no real-time collaboration and no server-side code execution yet
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
              Languages
              </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A few of the languages in the editor picker
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
                {" "}Try It?
              </span>
              </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Create a free account and open the editor.
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

            </motion.div>
          </div>
        </section>

      <Footer />
    </div>
  );
}