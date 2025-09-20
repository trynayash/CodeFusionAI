import { motion } from 'framer-motion';
import { Code2, Zap, Users, BookOpen, Brain, Shield, Cloud, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

// Import programming language logos from All_logo_and_pictures-main
import pythonLogo from '@/assets/All_logo_and_pictures-main/programming languages/python.svg';
import javascriptLogo from '@/assets/All_logo_and_pictures-main/programming languages/javascript.svg';
import typescriptLogo from '@/assets/All_logo_and_pictures-main/programming languages/typescript.svg';
import javaLogo from '@/assets/All_logo_and_pictures-main/programming languages/java.svg';
import cppLogo from '@/assets/All_logo_and_pictures-main/programming languages/c++.svg';
import cLogo from '@/assets/All_logo_and_pictures-main/programming languages/c.svg';
import reactLogo from '@/assets/All_logo_and_pictures-main/frameworks/react.svg';

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Code2,
      title: 'Advanced Code Editor',
      description: 'Professional Monaco editor with syntax highlighting, IntelliSense, and multi-language support.',
      color: 'bg-primary',
      details: ['Live syntax highlighting', 'Code completion', 'Error detection', 'Multiple themes']
    },
    {
      icon: Brain,
      title: 'AI-Powered Assistant',
      description: 'Get intelligent code suggestions, explanations, and debugging help powered by AI.',
      color: 'bg-secondary',
      details: ['Code generation', 'Bug detection', 'Performance tips', 'Learning assistance']
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'Your code is automatically saved and synced across all your devices securely.',
      color: 'bg-accent',
      details: ['Auto-save functionality', 'Cross-device sync', 'Version history', 'Secure encryption']
    },
    {
      icon: Users,
      title: 'Collaboration Tools',
      description: 'Share projects, collaborate in real-time, and learn from the community.',
      color: 'bg-gradient-primary',
      details: ['Real-time collaboration', 'Project sharing', 'Community forums', 'Peer reviews']
    },
    {
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Access curated courses, tutorials, and documentation to enhance your skills.',
      color: 'bg-warning',
      details: ['Interactive courses', 'Video tutorials', 'Documentation', 'Practice challenges']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encrypted storage and secure authentication.',
      color: 'bg-success',
      details: ['End-to-end encryption', '2FA support', 'SOC2 compliance', 'Regular audits']
    }
  ];

  const codeLanguages = [
    { name: 'Python', logo: pythonLogo, popularity: 95, color: 'from-blue-500 to-yellow-500', description: 'Versatile & beginner-friendly' },
    { name: 'JavaScript', logo: javascriptLogo, popularity: 90, color: 'from-yellow-400 to-yellow-600', description: 'Web development essential' },
    { name: 'TypeScript', logo: typescriptLogo, popularity: 85, color: 'from-blue-600 to-blue-800', description: 'JavaScript with types' },
    { name: 'Java', logo: javaLogo, popularity: 80, color: 'from-red-500 to-orange-600', description: 'Enterprise & Android' },
    { name: 'C++', logo: cppLogo, popularity: 75, color: 'from-blue-700 to-purple-700', description: 'System programming' },
    { name: 'C', logo: cLogo, popularity: 70, color: 'from-gray-600 to-blue-600', description: 'Low-level programming' },
    { name: 'React', logo: reactLogo, popularity: 88, color: 'from-cyan-400 to-blue-500', description: 'UI library for web' },
    { name: 'Go', icon: '🚀', popularity: 68, color: 'from-cyan-500 to-blue-600', description: 'Fast & concurrent' },
    { name: 'Rust', icon: '🦀', popularity: 65, color: 'from-orange-600 to-red-600', description: 'Memory-safe systems' },
    { name: 'PHP', icon: '🐘', popularity: 72, color: 'from-purple-600 to-indigo-600', description: 'Web backend language' },
    { name: 'Swift', icon: '🍎', popularity: 62, color: 'from-orange-500 to-red-500', description: 'iOS development' },
    { name: 'Kotlin', icon: '📱', popularity: 58, color: 'from-purple-500 to-pink-500', description: 'Modern Android dev' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gradient-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Powerful Features</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Everything You Need
                <br />
                <span className="text-white/90">to Code Better</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
                Discover the powerful features that make CodeFusion AI the ultimate platform 
                for developers of all skill levels.
              </p>
              
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Free Trial
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Comprehensive Development Tools
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From code editing to deployment, we've got every aspect of your development workflow covered.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="glass glow-hover h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Languages */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Multi-Language Support
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Code in your favorite programming language with full syntax highlighting and IntelliSense support.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {codeLanguages.map((lang, index) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="glass text-center p-6 glow-hover group hover:scale-105 transition-all duration-300 h-full">
                    <div className="mb-4 flex justify-center">
                      {lang.logo ? (
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${lang.color} p-3 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                          <img 
                            src={lang.logo} 
                            alt={`${lang.name} logo`}
                            className="w-full h-full object-contain filter brightness-0 invert"
                          />
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${lang.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                          {lang.icon}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 text-lg">{lang.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 min-h-[2.5rem] flex items-center justify-center">
                      {lang.description}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${lang.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${lang.popularity}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{lang.popularity}% Popular</span>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Ready to Experience These Features?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of developers who are already using CodeFusion AI to build amazing projects.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/courses')}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Explore Courses
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}