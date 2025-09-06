import { motion } from 'framer-motion';
import { Briefcase, MapPin, Users, Star, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function Careers() {
  const navigate = useNavigate();

  const positions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      level: "Senior"
    },
    {
      title: "AI/ML Engineer",
      department: "AI Research",
      location: "Remote / New York",
      type: "Full-time", 
      level: "Mid-Senior"
    },
    {
      title: "Curriculum Designer",
      department: "Education",
      location: "Remote",
      type: "Full-time",
      level: "Mid-level"
    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote / Seattle",
      type: "Full-time",
      level: "Senior"
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-secondary" />,
      title: "Growth & Learning",
      description: "Continuous learning budget and career development"
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours"
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
                  <Briefcase className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Join Our
                <span className="gradient-text block">Amazing Team</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Help us shape the future of coding education. We're looking for passionate individuals who want to make a difference.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Open <span className="gradient-text">Positions</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore exciting opportunities to work with cutting-edge technology and passionate teams.
              </p>
            </motion.div>

            <div className="space-y-6">
              {positions.map((position, index) => (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 lg:mb-0">
                            <span className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {position.department}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {position.location}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              {position.level}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                            {position.type}
                          </span>
                          <Button>Apply Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Work <span className="gradient-text">With Us</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 gradient-bg">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Don't See Your Role?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals. Send us your resume and let's talk!
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/contact')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Get In Touch
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}