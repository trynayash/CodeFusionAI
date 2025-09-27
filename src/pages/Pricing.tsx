import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Rocket, 
  CheckCircle,
  ArrowRight,
  Play,
  Users,
  Globe,
  Shield,
  Brain,
  Code,
  Database,
  MessageSquare,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CodeFusionLogo from '@/components/CodeFusionLogo';

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

export default function Pricing() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const plans = [
    {
      name: "Free",
      icon: <Star className="w-8 h-8" />,
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with coding",
      features: [
        "5 Code snippets per month",
        "Basic code editor",
        "Community support",
        "Public projects",
        "Basic AI assistance",
        "1 language support"
      ],
      buttonText: "Get Started Free",
      popular: false,
      color: "from-slate-500 to-slate-600",
      gradient: "from-slate-500 to-slate-600"
    },
    {
      name: "Pro",
      icon: <Zap className="w-8 h-8" />,
      price: "$19",
      period: "per month",
      description: "Best for individual developers",
      features: [
        "Unlimited code snippets",
        "Advanced code editor",
        "Priority support",
        "Private projects",
        "Advanced AI assistance",
        "All 50+ languages",
        "Code collaboration",
        "Export capabilities",
        "Custom themes",
        "API access"
      ],
      buttonText: "Start Pro Trial",
      popular: true,
      color: "from-blue-500 to-purple-600",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Team",
      icon: <Users className="w-8 h-8" />,
      price: "$49",
      period: "per month",
      description: "Perfect for growing teams",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Admin dashboard",
        "User management",
        "Team analytics",
        "Custom integrations",
        "Priority support",
        "Dedicated account manager",
        "Custom branding",
        "Advanced security"
      ],
      buttonText: "Start Team Trial",
      popular: false,
      color: "from-purple-500 to-pink-600",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      name: "Enterprise",
      icon: <Crown className="w-8 h-8" />,
      price: "Custom",
      period: "contact us",
      description: "For large organizations",
      features: [
        "Everything in Team",
        "Unlimited users",
        "On-premise deployment",
        "Custom AI models",
        "SLA guarantee",
        "24/7 phone support",
        "Custom training",
        "Compliance tools",
        "Advanced analytics",
        "White-label solution"
      ],
      buttonText: "Contact Sales",
      popular: false,
      color: "from-yellow-500 to-orange-600",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  const stats = [
    { icon: Users, value: 50000, suffix: '+', label: 'Active Users', color: 'from-blue-500 to-cyan-500' },
    { icon: Code, value: 100, suffix: 'M+', label: 'Lines of Code', color: 'from-purple-500 to-pink-500' },
    { icon: Brain, value: 99, suffix: '%', label: 'Satisfaction Rate', color: 'from-green-500 to-teal-500' },
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
              <a href="/features" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Features
              </a>
              <a href="/courses" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                Courses
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium">
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
              <a href="/features" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                Features
              </a>
              <a href="/courses" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
                Courses
              </a>
              <a href="#pricing" className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300">
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
              <Crown className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Simple, Transparent Pricing</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Choose Your
              <br />
              <span className="text-white">
                Perfect Plan
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Start free and scale as you grow. No hidden fees, no surprises. Cancel anytime.
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
                Start Free Trial
              </Button>
            
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 hover:border-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl bg-transparent hover:bg-blue-500/10 transition-all duration-300 group"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Plans
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
              Join thousands using CodeFusionAI to build amazing applications
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

      {/* Pricing Plans Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
              >
                    {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                <div className={`bg-slate-800/50 border rounded-2xl p-8 h-full ${
                  plan.popular 
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/20' 
                    : 'border-slate-700 hover:border-slate-600'
                } transition-all duration-300`}>
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl p-4 mx-auto mb-4`}>
                        {plan.icon}
                      </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{plan.description}</p>
                      </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                    className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                        onClick={() => navigate('/auth')}
                      >
                        {plan.buttonText}
                      </Button>
                </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Frequently Asked Questions
              </h2>
            <p className="text-xl text-slate-300">
              Everything you need to know about our pricing and plans
            </p>
            </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "Can I change my plan at any time?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial."
              },
              {
                question: "What happens to my data if I cancel?",
                answer: "Your data is safe with us. You can export all your projects and code before canceling. We keep your data for 30 days after cancellation."
                },
                {
                  question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
              },
              {
                question: "Can I get a custom plan for my organization?",
                answer: "Absolutely! Contact our sales team to discuss custom pricing and features for your organization's specific needs."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-300">{faq.answer}</p>
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
                {" "}Get Started?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing applications with our platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => navigate('/auth')}
              >
                <Rocket className="mr-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                Start Free Trial
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>14-day free trial</span>
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
              <a href="https://github.com/trynayash/" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/yxshsuthar/" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/yxshsuthar/" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}