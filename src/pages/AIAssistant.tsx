import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Cpu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function AIAssistant() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Smart Code Completion",
      description: "AI-powered code suggestions that understand your context and help you write better code faster."
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: "Error Detection",
      description: "Real-time error detection and intelligent suggestions for fixing common programming mistakes."
    },
    {
      icon: <Cpu className="w-8 h-8 text-accent" />,
      title: "Code Optimization",
      description: "Automatic code optimization suggestions to improve performance and maintainability."
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Multi-Language Support",
      description: "Support for Python, JavaScript, TypeScript, Java, C++, and more programming languages."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 gradient-bg">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <div className="perspective-1000 mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl transform-3d hover:rotate-y-12 transition-transform duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                AI-Powered
                <span className="gradient-text block">Coding Assistant</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Supercharge your coding experience with our intelligent AI assistant that helps you write better code, 
                fix errors, and learn faster than ever before.
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Try AI Assistant Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                AI Features That <span className="gradient-text">Transform</span> Your Coding
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the future of programming with intelligent assistance that adapts to your coding style.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 gradient-bg">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Code with AI?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who are already using our AI assistant to write better code faster.
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}