import { motion } from 'framer-motion';
import { Cpu, FileText, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function Documentation() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "Getting Started",
      description: "Quick setup guide and first steps with CodeFusion AI",
      links: ["Installation", "Basic Setup", "First Project"]
    },
    {
      icon: <FileText className="w-8 h-8 text-secondary" />,
      title: "API Reference",
      description: "Complete documentation for all available APIs",
      links: ["Authentication", "Code Editor API", "AI Assistant API"]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-accent" />,
      title: "Tutorials",
      description: "Step-by-step guides for common use cases",
      links: ["Building Your First App", "Advanced Features", "Best Practices"]
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-primary" />,
      title: "FAQ",
      description: "Frequently asked questions and troubleshooting",
      links: ["Common Issues", "Performance Tips", "Security Guide"]
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
                  <FileText className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Developer
                <span className="gradient-text block">Documentation</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Everything you need to know to build amazing applications with CodeFusion AI.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
                        {section.icon}
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                              {link}
                            </Button>
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

        {/* Quick Links */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                Need Help?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/community')}>
                  Join Community
                </Button>
                <Button size="lg" variant="outline">
                  Report Bug
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