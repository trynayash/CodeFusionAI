import { motion } from 'framer-motion';
import { Heart, Users, Target, Award, Code, Lightbulb, Globe, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CodeFusionLogo from '@/components/CodeFusionLogo';

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Passion for Teaching',
      description: 'We believe in making programming accessible and enjoyable for everyone, regardless of their background.',
      color: 'bg-red-500'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a supportive community where developers help each other grow and succeed together.',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Goal-Oriented Learning',
      description: 'Focused on practical skills and real-world applications that advance your career.',
      color: 'bg-green-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI technology to personalize and enhance the learning experience.',
      color: 'bg-yellow-500'
    }
  ];

  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former Google engineer with 10+ years in software development and education.',
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO & Co-Founder', 
      bio: 'AI researcher and full-stack developer, passionate about educational technology.',
      avatar: '👩‍💻'
    },
    {
      name: 'Michael Brown',
      role: 'Head of Education',
      bio: 'Former Stanford CS professor with expertise in curriculum design and pedagogy.',
      avatar: '👨‍🏫'
    },
    {
      name: 'Emily Davis',
      role: 'VP of Engineering',
      bio: 'Platform architect with experience scaling educational platforms to millions of users.',
      avatar: '👩‍🔬'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Students Worldwide', icon: Users },
    { number: '95%', label: 'Course Completion Rate', icon: Award },
    { number: '50+', label: 'Programming Languages', icon: Code },
    { number: '180+', label: 'Countries Reached', icon: Globe }
  ];

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a vision to democratize programming education' },
    { year: '2021', title: '10K Students', description: 'Reached our first major milestone with innovative course design' },
    { year: '2022', title: 'AI Integration', description: 'Launched our AI-powered coding assistant and personalized learning' },
    { year: '2023', title: '100K Students', description: 'Expanded globally with enterprise partnerships and advanced features' },
    { year: '2025', title: 'Market Leader', description: 'Became the leading platform for AI-enhanced programming education' }
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
                <Heart className="h-5 w-5" />
                <span className="text-sm font-medium">Our Story</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Empowering the Next
                <br />
                <span className="text-white/90">Generation of Developers</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/80 mb-10 max-w-4xl mx-auto">
                We're on a mission to make programming education accessible, engaging, and effective 
                for millions of learners worldwide through AI-powered technology.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  To bridge the gap between traditional programming education and the real-world skills 
                  developers need to succeed in today's tech industry.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  We believe that everyone should have access to high-quality programming education, 
                  regardless of their background, location, or financial situation. Our platform combines 
                  expert instruction with AI-powered personalization to create the most effective learning 
                  experience possible.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/courses')}
                  className="glow-hover"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Explore Our Courses
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-hero rounded-3xl p-8 text-white shadow-hero">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold mb-4">Launched in 2020</h3>
                  <p className="text-white/90 mb-6">
                    Starting from a small team of passionate educators and engineers, 
                    we've grown to serve over 500,000 students worldwide.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">4.9★</div>
                      <div className="text-sm text-white/80">Average Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-sm text-white/80">Support</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do and shape our platform's development.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="glass glow-hover h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <value.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Impact by Numbers
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The results speak for themselves - we're proud of what we've achieved together.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="glass text-center p-8 glow-hover">
                    <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Key milestones in our mission to revolutionize programming education.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-primary h-full rounded-full"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`w-full ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'} max-w-md`}>
                      <Card className="glass">
                        <CardContent className="p-6">
                          <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-semibold mb-3">{milestone.title}</h3>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The passionate individuals behind CodeFusionAI who make our mission possible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="glass glow-hover">
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">{member.avatar}</div>
                      <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </CardContent>
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
                Join Our Community
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Be part of our mission to democratize programming education and help shape the future of learning.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Contact Us
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