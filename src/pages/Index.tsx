import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, BookOpen, Play, Users, Star, ArrowRight, Brain, Zap, FileText, HelpCircle, MessageCircle, DollarSign, Menu, X, Sparkles, Rocket, Target, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useScrollDirection } from '@/hooks/useScrollDirection';

// Import language icons from All_logo_and_pictures-main
import pythonIcon from '@/assets/All_logo_and_pictures-main/programming languages/python.svg';
import javascriptIcon from '@/assets/All_logo_and_pictures-main/programming languages/javascript.svg';
import typescriptIcon from '@/assets/All_logo_and_pictures-main/programming languages/typescript.svg';
import javaIcon from '@/assets/All_logo_and_pictures-main/programming languages/java.svg';
import cppIcon from '@/assets/All_logo_and_pictures-main/programming languages/c++.svg';
import cIcon from '@/assets/All_logo_and_pictures-main/programming languages/c.svg';
import htmlIcon from '@/assets/All_logo_and_pictures-main/others/html.svg';
import cssIcon from '@/assets/All_logo_and_pictures-main/others/css.svg';
import reactIcon from '@/assets/All_logo_and_pictures-main/frameworks/react.svg';
import nodejsIcon from '@/assets/All_logo_and_pictures-main/frameworks/nodejs.svg';
import goIcon from '@/assets/All_logo_and_pictures-main/programming languages/go.svg';
import rustIcon from '@/assets/All_logo_and_pictures-main/programming languages/rust.svg';
import phpIcon from '@/assets/All_logo_and_pictures-main/programming languages/php.png';
import rubyIcon from '@/assets/All_logo_and_pictures-main/programming languages/ruby.svg';
import kotlinIcon from '@/assets/All_logo_and_pictures-main/programming languages/kotlin.svg';
import csharpIcon from '@/assets/All_logo_and_pictures-main/programming languages/csharp.svg';
import dartIcon from '@/assets/All_logo_and_pictures-main/programming languages/dart.svg';

const programmingLanguages = [
  { name: 'Python', icon: pythonIcon, color: 'from-blue-500 to-blue-600', position: { x: -200, y: -150 } },
  { name: 'JavaScript', icon: javascriptIcon, color: 'from-yellow-500 to-yellow-600', position: { x: 200, y: -150 } },
  { name: 'Java', icon: javaIcon, color: 'from-red-500 to-red-600', position: { x: -300, y: 0 } },
  { name: 'C++', icon: cppIcon, color: 'from-purple-500 to-purple-600', position: { x: 300, y: 0 } },
  { name: 'TypeScript', icon: typescriptIcon, color: 'from-blue-600 to-blue-700', position: { x: -250, y: 150 } },
  { name: 'C', icon: cIcon, color: 'from-gray-500 to-gray-600', position: { x: 250, y: 150 } },
  { name: 'HTML', icon: htmlIcon, color: 'from-orange-500 to-orange-600', position: { x: -150, y: -200 } },
  { name: 'CSS', icon: cssIcon, color: 'from-blue-400 to-blue-500', position: { x: 150, y: -200 } },
  { name: 'React', icon: reactIcon, color: 'from-cyan-500 to-cyan-600', position: { x: -350, y: -75 } },
  { name: 'Node.js', icon: nodejsIcon, color: 'from-green-500 to-green-600', position: { x: 350, y: -75 } },
  { name: 'Go', icon: goIcon, color: 'from-blue-500 to-blue-600', position: { x: -350, y: 75 } },
  { name: 'Rust', icon: rustIcon, color: 'from-orange-600 to-orange-700', position: { x: 350, y: 75 } },
  { name: 'Swift', icon: swiftIcon, color: 'from-orange-500 to-orange-600', position: { x: -150, y: 200 } },
  { name: 'Kotlin', icon: kotlinIcon, color: 'from-purple-600 to-purple-700', position: { x: 150, y: 200 } },
  { name: 'PHP', icon: phpIcon, color: 'from-indigo-500 to-indigo-600', position: { x: -100, y: -250 } },
  { name: 'Ruby', icon: rubyIcon, color: 'from-red-600 to-red-700', position: { x: 100, y: -250 } },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollAnimation, setShowScrollAnimation] = useState(false);
  const navigate = useNavigate();
  const { scrollDirection, scrollY } = useScrollDirection();

  useEffect(() => {
    // Trigger the loading animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Show languages boom effect after main content loads
      setTimeout(() => {
        setShowLanguages(true);
        // Hide languages after animation completes
        setTimeout(() => {
          setShowLanguages(false);
        }, 3000); // Hide after 3 seconds
      }, 1000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageClick = (language: string) => {
    navigate('/editor', { state: { language: language.toLowerCase() } });
  };

  const filteredLanguages = programmingLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
              />
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white"
              >
                CodeFusion AI
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/80"
              >
                Loading your coding experience...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section with Language Boom Effect */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
          </div>

          {/* Programming Languages Boom Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence>
              {showLanguages && programmingLanguages.map((lang, index) => (
                <motion.div
                  key={lang.name}
                  initial={{ 
                    x: lang.position.x, 
                    y: lang.position.y, 
                    scale: 0, 
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  animate={{ 
                    x: 0, 
                    y: 0, 
                    scale: 1, 
                    opacity: 1,
                    rotate: 0
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    transition: { duration: 0.3 }
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  className="absolute pointer-events-auto"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg cursor-pointer flex items-center justify-center group hover:shadow-2xl transition-all duration-300 border border-white/20"
                    onClick={() => handleLanguageClick(lang.name)}
                  >
                    <img 
                      src={lang.icon} 
                      alt={lang.name} 
                      className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: -5 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                    >
                      {lang.name}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Welcome to the Future of Coding</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                Master Programming
                <br />
                <span className="text-3xl md:text-5xl lg:text-6xl">with AI Power</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              >
                Experience interactive learning with real-time code visualization, AI-powered assistance, and hands-on practice across 16+ programming languages.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/editor')}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Start Coding Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/courses')}
                  className="border-2 border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Courses
                </Button>
              </motion.div>

                          </motion.div>
          </div>
        </section>

        {/* Practice with Online Compilers Section - Programiz Style */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
          {/* Enhanced Background Elements - Programiz Style */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large background circles */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
            
            {/* Decorative dots pattern - Enhanced */}
            <div className="absolute left-10 top-1/4 grid grid-cols-6 gap-3 opacity-40">
              {[...Array(24)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-3 h-3 bg-blue-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
            
            {/* Additional decorative elements */}
            <div className="absolute right-20 top-1/3 w-20 h-20 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-xl"></div>
            <div className="absolute left-1/4 bottom-1/4 w-16 h-16 bg-gradient-to-br from-green-300/20 to-teal-300/20 rounded-full blur-xl"></div>
            <div className="absolute right-1/3 bottom-1/3 w-24 h-24 bg-gradient-to-br from-orange-300/20 to-red-300/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div 
                className="inline-flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-8 py-4 rounded-full mb-8 shadow-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Practice with our Online Compilers
                </h2>
              </motion.div>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                We believe coding should be accessible to all, so we made our own compilers for web and mobile—and they're free!
              </p>
            </motion.div>

            {/* Top Programming Languages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {[
                { name: 'Python', icon: pythonIcon, route: '/editor/python', description: 'AI & Data Science', color: 'from-blue-500 to-blue-600' },
                { name: 'JavaScript', icon: javascriptIcon, route: '/editor/javascript', description: 'Web Development', color: 'from-yellow-500 to-yellow-600' },
                { name: 'TypeScript', icon: typescriptIcon, route: '/editor/typescript', description: 'Type Safety', color: 'from-blue-600 to-blue-700' },
                { name: 'Java', icon: javaIcon, route: '/editor/java', description: 'Enterprise', color: 'from-red-500 to-red-600' },
                { name: 'C++', icon: cppIcon, route: '/editor/cpp', description: 'System Programming', color: 'from-purple-500 to-purple-600' },
                { name: 'C', icon: cIcon, route: '/editor/c', description: 'Low Level', color: 'from-gray-600 to-gray-700' },
                { name: 'C#', icon: csharpIcon, route: '/editor/csharp', description: 'Microsoft Stack', color: 'from-purple-600 to-purple-700' },
                { name: 'Go', icon: goIcon, route: '/editor/go', description: 'Cloud Native', color: 'from-cyan-500 to-cyan-600' },
                { name: 'Rust', icon: rustIcon, route: '/editor/rust', description: 'Memory Safety', color: 'from-orange-600 to-orange-700' },
                { name: 'PHP', icon: phpIcon, route: '/editor/php', description: 'Web Backend', color: 'from-indigo-500 to-indigo-600' },
                { name: 'Swift', icon: swiftIcon, route: '/editor/swift', description: 'iOS Development', color: 'from-orange-500 to-orange-600' },
                { name: 'Kotlin', icon: kotlinIcon, route: '/editor/kotlin', description: 'Android Dev', color: 'from-purple-700 to-purple-800' },
              ].map((language, index) => (
                <motion.div
                  key={language.name}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.08, y: -8 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(language.route)}
                >
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 overflow-hidden group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50/30 dark:group-hover:from-slate-800 dark:group-hover:to-blue-900/20">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${language.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-xl group-hover:bg-white dark:group-hover:bg-slate-600/50 transition-all duration-300">
                        <img 
                          src={language.icon} 
                          alt={language.name} 
                          className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" 
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                          {language.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 mt-1 font-medium">
                          {language.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* More Languages Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/editor')}
                className="relative bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-600 dark:hover:border-blue-300 px-10 py-5 text-lg font-bold transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 overflow-hidden"
              >
                {/* Button gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex items-center">
                  <Code className="w-6 h-6 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors duration-300">
                    More Programming Languages
                  </span>
                  <ChevronDown className="w-6 h-6 ml-3 group-hover:translate-y-1 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </div>
              </Button>
              <p className="text-base text-slate-700 dark:text-slate-300 mt-4 font-medium">
                50+ programming languages and technologies available
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-6 py-3 rounded-full mb-6 border border-blue-200 dark:border-blue-700"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">World-Class Features</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Why Choose CodeFusion AI?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Experience the next generation of programming education with cutting-edge features designed for modern developers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Learning",
                  description: "Get personalized coding assistance and explanations tailored to your learning style with advanced AI algorithms.",
                  color: "from-purple-500 to-pink-500",
                  hoverColor: "group-hover:from-purple-600 group-hover:to-pink-600"
                },
                {
                  icon: Zap,
                  title: "Real-time Visualization",
                  description: "See your code come to life with interactive visualizations and step-by-step execution in real-time.",
                  color: "from-blue-500 to-cyan-500",
                  hoverColor: "group-hover:from-blue-600 group-hover:to-cyan-600"
                },
                {
                  icon: Target,
                  title: "Hands-on Practice",
                  description: "Learn by doing with interactive exercises, real-world coding challenges, and project-based learning.",
                  color: "from-green-500 to-emerald-500",
                  hoverColor: "group-hover:from-green-600 group-hover:to-emerald-600"
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 overflow-hidden">
                      {/* Gradient background overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                      
                      <div className="relative z-10 text-center">
                        <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} ${feature.hoverColor} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                          <Icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 leading-relaxed text-lg transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Trusted by Developers Worldwide
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Join our growing community of passionate developers and learners
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: "50K+", label: "Active Learners", icon: Users, color: "from-blue-500 to-blue-600" },
                { number: "200+", label: "Interactive Tutorials", icon: BookOpen, color: "from-green-500 to-green-600" },
                { number: "50+", label: "Programming Languages", icon: Code, color: "from-purple-500 to-purple-600" },
                { number: "4.8★", label: "Average Rating", icon: Star, color: "from-yellow-500 to-yellow-600" }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 overflow-hidden">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                          {stat.number}
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 font-semibold group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                          {stat.label}
                        </div>
                      </div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Coding Journey?
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  Join thousands of developers who are already mastering programming with CodeFusion AI
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/auth')}
                    className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/courses')}
                    className="border-2 border-white text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                  >
                    View All Courses
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;