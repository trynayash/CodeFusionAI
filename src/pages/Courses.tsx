import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, Star, Trophy, Target, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const navigate = useNavigate();

  const courses = [
    {
      title: 'Python for Beginners',
      description: 'Master Python fundamentals with hands-on projects and real-world applications.',
      level: 'Beginner',
      duration: '8 weeks',
      students: 15420,
      rating: 4.9,
      price: 'Free',
      image: '🐍',
      skills: ['Variables & Data Types', 'Control Structures', 'Functions', 'OOP Basics'],
      featured: true
    },
    {
      title: 'Advanced JavaScript',
      description: 'Deep dive into modern JavaScript, ES6+, async programming, and frameworks.',
      level: 'Advanced',
      duration: '12 weeks',
      students: 8930,
      rating: 4.8,
      price: '$99',
      image: '⚡',
      skills: ['ES6+ Features', 'Async/Await', 'React/Vue', 'Node.js']
    },
    {
      title: 'Data Structures & Algorithms',
      description: 'Master computer science fundamentals essential for technical interviews.',
      level: 'Intermediate',
      duration: '10 weeks',
      students: 12150,
      rating: 4.9,
      price: '$149',
      image: '🧠',
      skills: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'System Design']
    },
    {
      title: 'Full-Stack Web Development',
      description: 'Build complete web applications from frontend to backend deployment.',
      level: 'Intermediate',
      duration: '16 weeks',
      students: 6780,
      rating: 4.7,
      price: '$199',
      image: '🌐',
      skills: ['React/Angular', 'Node.js/Express', 'Databases', 'AWS/Docker']
    },
    {
      title: 'Machine Learning with Python',
      description: 'Learn ML algorithms, data preprocessing, and model deployment.',
      level: 'Advanced',
      duration: '14 weeks',
      students: 4920,
      rating: 4.8,
      price: '$249',
      image: '🤖',
      skills: ['Scikit-learn', 'TensorFlow', 'Data Analysis', 'Model Deployment']
    },
    {
      title: 'Mobile App Development',
      description: 'Create native and cross-platform mobile applications.',
      level: 'Intermediate',
      duration: '12 weeks',
      students: 7340,
      rating: 4.6,
      price: '$179',
      image: '📱',
      skills: ['React Native', 'Flutter', 'iOS/Android', 'App Store Publishing']
    }
  ];

  const learningPaths = [
    {
      title: 'Frontend Developer',
      description: 'Master modern frontend technologies',
      courses: 4,
      duration: '6 months',
      icon: '🎨'
    },
    {
      title: 'Backend Engineer',
      description: 'Build scalable server-side applications',
      courses: 5,
      duration: '7 months',
      icon: '⚙️'
    },
    {
      title: 'Data Scientist',
      description: 'Analyze data and build ML models',
      courses: 6,
      duration: '8 months',
      icon: '📊'
    },
    {
      title: 'DevOps Engineer',
      description: 'Deploy and scale applications',
      courses: 4,
      duration: '5 months',
      icon: '🚀'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-success';
      case 'Intermediate': return 'bg-warning';
      case 'Advanced': return 'bg-destructive';
      default: return 'bg-primary';
    }
  };

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
                <Trophy className="h-5 w-5" />
                <span className="text-sm font-medium">Expert-Led Courses</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Learn to Code
                <br />
                <span className="text-white/90">Like a Pro</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
                Master programming with our comprehensive courses designed by industry experts. 
                From beginner to advanced, we've got your learning journey covered.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Choose Your Path
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Structured learning paths designed to take you from beginner to expert in your chosen field.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="glass glow-hover cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{path.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                      <p className="text-muted-foreground mb-4">{path.description}</p>
                      <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        <span>{path.courses} courses</span>
                        <span>{path.duration}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Path
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Popular Courses
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join thousands of students in our most popular programming courses.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className={`glass glow-hover cursor-pointer h-full ${course.featured ? 'ring-2 ring-primary' : ''}`}>
                    {course.featured && (
                      <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                        FEATURED
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{course.image}</div>
                        <Badge className={`${getLevelColor(course.level)} text-white`}>
                          {course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">What you'll learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 2).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {course.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.skills.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">{course.price}</div>
                        <Button size="sm" onClick={() => navigate('/auth')}>
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
                <p className="text-muted-foreground">Active Students</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">200+</div>
                <p className="text-muted-foreground">Expert Instructors</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">95%</div>
                <p className="text-muted-foreground">Completion Rate</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">4.8★</div>
                <p className="text-muted-foreground">Average Rating</p>
              </motion.div>
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
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join our community of learners and start building your programming skills today.
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Target className="mr-2 h-5 w-5" />
                Start Learning Today
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}