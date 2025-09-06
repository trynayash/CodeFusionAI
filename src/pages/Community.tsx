import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, Star, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const navigate = useNavigate();

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: "Active Members", value: "50,000+" },
    { icon: <MessageCircle className="w-6 h-6" />, label: "Daily Discussions", value: "1,200+" },
    { icon: <Heart className="w-6 h-6" />, label: "Code Reviews", value: "800+" },
    { icon: <Star className="w-6 h-6" />, label: "Projects Shared", value: "5,000+" }
  ];

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Discussion Forums",
      description: "Get help, share ideas, and connect with fellow developers"
    },
    {
      icon: <Trophy className="w-8 h-8 text-secondary" />,
      title: "Coding Challenges",
      description: "Participate in weekly challenges and showcase your skills"
    },
    {
      icon: <Zap className="w-8 h-8 text-accent" />,
      title: "Project Showcase",
      description: "Share your projects and get feedback from the community"
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
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Developer
                <span className="gradient-text block">Community</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Join thousands of developers learning, sharing, and building together in our vibrant community.
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Join Community
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 -mt-8">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        {stat.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Community <span className="gradient-text">Features</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
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
      </main>

      <Footer />
    </div>
  );
}