import { motion } from 'framer-motion';
import { Code2, BookOpen, Users, Zap, TrendingUp, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface UserStats {
  snippets: number;
  projects: number;
  totalHours: number;
}

interface Activity {
  id: string;
  title: string;
  language: string;
  created_at: string;
  type: 'snippet' | 'project';
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({ snippets: 0, projects: 0, totalHours: 0 });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load snippets count
      const { count: snippetsCount } = await supabase
        .from('code_snippets')
        .select('*', { count: 'exact', head: true });

      // Load projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Load recent snippets
      const { data: snippetsData } = await supabase
        .from('code_snippets')
        .select('id, title, language, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Load recent projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('id, title, language, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Combine and sort activities
      const activities: Activity[] = [
        ...(snippetsData || []).map(item => ({ ...item, type: 'snippet' as const })),
        ...(projectsData || []).map(item => ({ ...item, type: 'project' as const }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);

      setStats({
        snippets: snippetsCount || 0,
        projects: projectsCount || 0,
        totalHours: Math.floor((snippetsCount || 0) * 0.5 + (projectsCount || 0) * 2.5) // Estimate
      });
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const dashboardStats = [
    { icon: Code2, label: 'Code Snippets', value: loading ? '...' : stats.snippets.toString(), color: 'text-primary' },
    { icon: BookOpen, label: 'Projects', value: loading ? '...' : stats.projects.toString(), color: 'text-secondary' },
    { icon: Clock, label: 'Hours Coded', value: loading ? '...' : stats.totalHours.toString(), color: 'text-accent' },
    { icon: Star, label: 'Total Items', value: loading ? '...' : (stats.snippets + stats.projects).toString(), color: 'text-warning' },
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {dashboardStats.map((stat, index) => (
              <Card key={stat.label} className="glass glow-hover">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs sm:text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="glass">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription className="text-sm">Start coding right away</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className="w-full justify-start h-12 glow-hover text-left"
                      onClick={action.action}
                    >
                      <div className={`p-2 rounded-lg ${action.color} mr-3 flex-shrink-0`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm sm:text-base">{action.label}</span>
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
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription className="text-sm">Your latest coding sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/30">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                            <div className="space-y-1">
                              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                              <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                        </div>
                      ))
                    ) : recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                          onClick={() => navigate('/editor')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm sm:text-base truncate">{activity.title}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                                {activity.language} • {activity.type}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0 ml-2">
                            {formatTimeAgo(activity.created_at)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                        <p className="text-xs mt-1">Start coding to see your activity here</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 text-sm sm:text-base" 
                    onClick={() => navigate('/editor')}
                  >
                    {recentActivity.length > 0 ? 'View All Activity' : 'Start Coding'}
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
            className="mt-8 sm:mt-12 text-center"
          >
            <Card className="gradient-bg p-6 sm:p-12">
              <div className="text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to code?</h2>
                <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8">
                  Jump into the advanced code editor and bring your ideas to life
                </p>
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => navigate('/editor')}
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                >
                  <Code2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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