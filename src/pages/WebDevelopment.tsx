import { motion } from 'framer-motion';
import { Globe, Smartphone, Code, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function WebDevelopment() {
  const navigate = useNavigate();

  const modules = [
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "HTML & CSS Fundamentals",
      description: "Build solid foundations with modern HTML5 and CSS3",
      duration: "4 weeks",
      projects: 3
    },
    {
      icon: <Globe className="w-8 h-8 text-secondary" />,
      title: "JavaScript & DOM",
      description: "Master JavaScript and dynamic web interactions",
      duration: "6 weeks", 
      projects: 5
    },
    {
      icon: <Smartphone className="w-8 h-8 text-accent" />,
      title: "React & Modern Frameworks",
      description: "Build powerful SPAs with React and modern tools",
      duration: "8 weeks",
      projects: 7
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "Full-Stack Development",
      description: "Backend APIs, databases, and deployment strategies",
      duration: "10 weeks",
      projects: 4
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
                  <Globe className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Web Development
                <span className="gradient-text block">Mastery</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Learn to build modern, responsive websites and web applications from scratch to deployment.
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Your Journey
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Course Modules */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Course <span className="gradient-text">Modules</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Structured learning path from beginner to advanced web developer with hands-on projects.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {modules.map((module, index) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
                        {module.icon}
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>📅 {module.duration}</span>
                        <span>🚀 {module.projects} projects</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">
                        {module.description}
                      </CardDescription>
                      <Button variant="outline" className="w-full">
                        View Curriculum
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Your Learning <span className="gradient-text">Path</span>
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[
                  "Master HTML, CSS, and responsive design principles",
                  "Learn JavaScript fundamentals and DOM manipulation", 
                  "Build interactive projects with modern frameworks",
                  "Understand backend development and APIs",
                  "Deploy and maintain production applications"
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <p className="text-lg">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}