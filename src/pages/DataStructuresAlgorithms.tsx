import { motion } from 'framer-motion';
import { Activity, Code, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useNavigate } from 'react-router-dom';

export default function DataStructuresAlgorithms() {
  const navigate = useNavigate();

  const topics = [
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      title: "Arrays & Linked Lists",
      description: "Master fundamental data structures and their operations",
      difficulty: "Beginner",
      lessons: 12
    },
    {
      icon: <Activity className="w-8 h-8 text-secondary" />,
      title: "Sorting Algorithms",
      description: "Learn bubble sort, merge sort, quick sort and more",
      difficulty: "Intermediate",
      lessons: 8
    },
    {
      icon: <Code className="w-8 h-8 text-accent" />,
      title: "Trees & Graphs",
      description: "Understand binary trees, BST, and graph algorithms",
      difficulty: "Advanced",
      lessons: 15
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Dynamic Programming",
      description: "Solve complex problems with optimal substructure",
      difficulty: "Advanced",
      lessons: 10
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
                  <Activity className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Data Structures &
                <span className="gradient-text block">Algorithms</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Master the fundamental building blocks of computer science with our comprehensive course on data structures and algorithms.
              </p>
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Learning Now
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Course <span className="gradient-text">Topics</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive coverage of essential data structures and algorithms with hands-on coding practice.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {topics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass glow-hover h-full">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
                        {topic.icon}
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {topic.difficulty}
                        </span>
                        <span>{topic.lessons} lessons</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">
                        {topic.description}
                      </CardDescription>
                      <Button variant="outline" className="w-full">
                        View Lessons
                      </Button>
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