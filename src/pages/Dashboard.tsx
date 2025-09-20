import { motion } from 'framer-motion';
import { Code2, BookOpen, Users, Zap, TrendingUp, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Dashboard3D } from '@/components/ui/dashboard-3d';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState, useCallback } from 'react';
import { UserStats, Activity, APIResponse } from '@/types/api';
import { transformSupabaseResponse, handleAPIError, formatRelativeTime } from '@/utils/api';
import { log } from '@/utils/logger';
import { withErrorBoundary } from '@/components/ErrorBoundary';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({ 
    snippets: 0, 
    projects: 0, 
    totalHours: 0,
    streak: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 1000,
    linesOfCode: 0,
    languagesUsed: []
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    if (!user) {
      log.warn('Attempted to load user data without authenticated user', undefined, 'DASHBOARD');
      return;
    }

    const startTime = performance.now();
    setLoading(true);
    setError(null);

    try {
      log.info('Loading dashboard data', { userId: user.id }, 'DASHBOARD');

      // Load snippets count with proper error handling
      const snippetsResponse = await supabase
        .from('code_snippets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const snippetsResult = transformSupabaseResponse(snippetsResponse, 'load snippets count');
      if (!snippetsResult.success) {
        throw new Error(snippetsResult.error);
      }

      // Load projects count with proper error handling
      const projectsResponse = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const projectsResult = transformSupabaseResponse(projectsResponse, 'load projects count');
      if (!projectsResult.success) {
        throw new Error(projectsResult.error);
      }

      // Load recent snippets
      const recentSnippetsResponse = await supabase
        .from('code_snippets')
        .select('id, title, language, created_at, updated_at, tags, status, description')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      const recentSnippetsResult = transformSupabaseResponse(recentSnippetsResponse, 'load recent snippets');

      // Load recent projects
      const recentProjectsResponse = await supabase
        .from('projects')
        .select('id, title, language, created_at, updated_at, tags, status, description')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      const recentProjectsResult = transformSupabaseResponse(recentProjectsResponse, 'load recent projects');

      // Combine and sort activities with proper typing
      const snippetsData = recentSnippetsResult.success ? recentSnippetsResult.data || [] : [];
      const projectsData = recentProjectsResult.success ? recentProjectsResult.data || [] : [];

      const activities: Activity[] = [
        ...snippetsData.map(item => ({ 
          ...item, 
          type: 'snippet' as const,
          tags: item.tags || [],
          status: item.status || 'draft',
          description: item.description || ''
        })),
        ...projectsData.map(item => ({ 
          ...item, 
          type: 'project' as const,
          tags: item.tags || [],
          status: item.status || 'active',
          description: item.description || ''
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);

      const snippetsCount = snippetsResponse.count || 0;
      const projectsCount = projectsResponse.count || 0;
      const totalItems = snippetsCount + projectsCount;
      const estimatedHours = Math.floor(snippetsCount * 0.5 + projectsCount * 2.5);
      const estimatedXp = totalItems * 50 + Math.floor(Math.random() * 500);
      const level = Math.floor(estimatedXp / 1000) + 1;

      const newStats: UserStats = {
        snippets: snippetsCount,
        projects: projectsCount,
        totalHours: estimatedHours,
        streak: Math.floor(Math.random() * 15) + 5, // Mock data - would come from actual tracking
        level,
        xp: estimatedXp,
        nextLevelXp: level * 1000,
        linesOfCode: totalItems * 50, // Estimated
        languagesUsed: [...new Set(activities.map(a => a.language))], // Unique languages
      };

      setStats(newStats);
      setRecentActivity(activities);

      const endTime = performance.now();
      log.perf('Dashboard data loaded', endTime - startTime, {
        snippetsCount,
        projectsCount,
        activitiesCount: activities.length
      });

      log.user('Dashboard viewed', { 
        stats: newStats,
        activitiesCount: activities.length 
      });

    } catch (error) {
      const appError = handleAPIError(error, 'loadUserData');
      setError(appError.message);
      log.error('Failed to load dashboard data', error as Error, 'DASHBOARD');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  const handleQuickAction = useCallback((action: string, path: string) => {
    log.user(`Quick action clicked: ${action}`, { path });
    navigate(path);
  }, [navigate]);

  const handleActivityClick = useCallback((activity: Activity) => {
    log.user('Activity item clicked', { 
      activityId: activity.id, 
      type: activity.type,
      language: activity.language 
    });
    navigate('/editor');
  }, [navigate]);

  const dashboardStats = [
    { 
      icon: Code2, 
      label: 'Code Snippets', 
      value: loading ? '...' : stats.snippets.toString(), 
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-500'
    },
    { 
      icon: BookOpen, 
      label: 'Projects', 
      value: loading ? '...' : stats.projects.toString(), 
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      iconBg: 'bg-purple-500'
    },
    { 
      icon: Clock, 
      label: 'Hours Coded', 
      value: loading ? '...' : stats.totalHours.toString(), 
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      iconBg: 'bg-green-500'
    },
    { 
      icon: Star, 
      label: 'Total Items', 
      value: loading ? '...' : (stats.snippets + stats.projects).toString(), 
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-orange-500/20',
      iconBg: 'bg-yellow-500'
    },
  ];

  const quickActions = [
    { 
      icon: Code2, 
      label: 'New Code Snippet', 
      action: () => navigate('/editor'), 
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-100'
    },
    { 
      icon: BookOpen, 
      label: 'Create Project', 
      action: () => navigate('/editor'), 
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-100'
    },
    { 
      icon: Users, 
      label: 'Browse Community', 
      action: () => navigate('/community'), 
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-100'
    },
    { 
      icon: Zap, 
      label: 'AI Assistant', 
      action: () => navigate('/ai-assistant'), 
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-100'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Header />
      
      <main className="pt-20 relative z-10">
        {/* Enhanced Welcome Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Welcome back, {user?.user_metadata?.full_name || 'Developer'}! 👋
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Ready to continue your coding journey? Let's build something amazing together.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/editor')}
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
                >
                  <Code2 className="mr-2 h-5 w-5" />
                  Start Coding
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/courses')}
                  className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Courses
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="group"
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 card-3d shadow-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-slate-300 text-sm font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold text-white drop-shadow-sm">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Enhanced Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg text-white">
                    <Zap className="h-5 w-5 text-accent" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription className="text-white/70">Start coding right away</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-16 p-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                        onClick={action.action}
                      >
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} mr-4 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-base font-medium text-white group-hover:text-white/90">{action.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg text-white">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription className="text-white/70">Your latest coding sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                            <div className="space-y-1">
                              <div className="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
                              <div className="h-3 bg-white/20 rounded w-20 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="h-3 bg-white/20 rounded w-16 animate-pulse"></div>
                        </div>
                      ))
                    ) : recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                          onClick={() => handleActivityClick(activity)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-white truncate">{activity.title}</p>
                              <p className="text-sm text-white/60 capitalize">
                                {activity.language} • {activity.type}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-white/60 flex-shrink-0 ml-2">
                            {formatRelativeTime(activity.created_at)}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-white/60">
                        <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No recent activity</p>
                        <p className="text-sm">Start coding to see your activity here</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300" 
                    onClick={() => navigate('/editor')}
                  >
                    {recentActivity.length > 0 ? 'View All Activity' : 'Start Coding'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 sm:mt-12"
          >
            <Card className="glass overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Code2 className="h-5 w-5 text-primary" />
                  <span>Interactive 3D Workspace</span>
                </CardTitle>
                <CardDescription>Explore your coding journey in 3D space</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Dashboard3D />
              </CardContent>
            </Card>
          </motion.div>

          {/* Continue Coding CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
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

// Export with error boundary wrapper
export default withErrorBoundary(Dashboard, {
  fallback: (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Dashboard Error</h1>
        <p className="text-white/70 mb-6">Unable to load dashboard. Please try refreshing the page.</p>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    </div>
  ),
  onError: (error, errorInfo) => {
    log.error('Dashboard component error', error, 'DASHBOARD_ERROR_BOUNDARY');
    log.error('Error info', errorInfo, 'DASHBOARD_ERROR_BOUNDARY');
  }
});