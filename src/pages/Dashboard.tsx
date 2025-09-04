import { motion } from 'framer-motion';
import { Code2, BookOpen, Users, Zap, TrendingUp, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { icon: Code2, label: 'Code Snippets', value: '12', color: 'text-primary' },
    { icon: BookOpen, label: 'Projects', value: '5', color: 'text-secondary' },
    { icon: Clock, label: 'Hours Coded', value: '47', color: 'text-accent' },
    { icon: Star, label: 'Achievements', value: '8', color: 'text-warning' },
  ];

  const recentActivity = [
    { title: 'Python Data Analysis', language: 'Python', time: '2 hours ago', type: 'Snippet' },
    { title: 'React Calculator', language: 'JavaScript', time: '5 hours ago', type: 'Project' },
    { title: 'Binary Search Algorithm', language: 'C++', time: '1 day ago', type: 'Snippet' },
    { title: 'REST API Server', language: 'Java', time: '2 days ago', type: 'Project' },
  ];

  const quickActions = [
    { icon: Code2, label: 'New Code Snippet', action: () => navigate('/editor'), color: 'bg-primary' },
    { icon: BookOpen, label: 'Create Project', action: () => navigate('/editor'), color: 'bg-secondary' },
    { icon: Users, label: 'Browse Community', action: () => navigate('/features'), color: 'bg-accent' },
    { icon: Zap, label: 'AI Assistant', action: () => navigate('/features'), color: 'bg-gradient-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Welcome Section */}
        <section className="py-12 gradient-bg">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Welcome back, {user?.user_metadata?.full_name || 'Developer'}! 👋
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Ready to continue your coding journey? Let's build something amazing together.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat, index) => (
              <Card key={stat.label} className="glass glow-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>Start coding right away</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className="w-full justify-start h-12 glow-hover"
                      onClick={action.action}
                    >
                      <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Your latest coding sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.language} • {activity.type}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/editor')}>
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Continue Coding CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Card className="gradient-bg p-12">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to code?</h2>
                <p className="text-xl text-white/80 mb-8">
                  Jump into the advanced code editor and bring your ideas to life
                </p>
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => navigate('/editor')}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Code2 className="mr-2 h-5 w-5" />
                  Open Code Editor
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}