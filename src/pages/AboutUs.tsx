import { motion } from 'framer-motion';
import { Building, MapPin, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "Pushing the boundaries of what's possible in coding education"
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: "Community",
      description: "Building a supportive environment for all developers"
    },
    {
      icon: <Building className="w-8 h-8 text-accent" />,
      title: "Excellence",
      description: "Delivering the highest quality learning experiences"
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
                  <Building className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                About
                <span className="gradient-text block">CodeFusion AI</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                We're on a mission to democratize coding education and empower developers worldwide with AI-powered learning tools.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                To make coding education accessible, engaging, and effective for everyone. We believe that with the right tools 
                and guidance, anyone can become a great developer. Our AI-powered platform provides personalized learning 
                experiences that adapt to your pace and style.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Our <span className="gradient-text">Values</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        {value.icon}
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Meet Our <span className="gradient-text">Team</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A passionate group of educators, developers, and AI researchers working together to revolutionize coding education.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Alex Chen", role: "CEO & Co-Founder", expertise: "AI & Machine Learning" },
                { name: "Sarah Johnson", role: "CTO & Co-Founder", expertise: "Full-Stack Development" },
                { name: "Michael Brown", role: "Head of Education", expertise: "Curriculum Design" },
                { name: "Emily Davis", role: "Lead AI Engineer", expertise: "Natural Language Processing" },
                { name: "David Wilson", role: "Senior Developer", expertise: "Frontend Development" },
                { name: "Lisa Rodriguez", role: "Community Manager", expertise: "Developer Relations" }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-primary text-sm mb-2">{member.role}</p>
                      <p className="text-muted-foreground text-xs">{member.expertise}</p>
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
                Join Our Journey
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Be part of the future of coding education. Start learning with us today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Start Learning
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/careers')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Join Our Team
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