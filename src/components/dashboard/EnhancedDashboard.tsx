/**
 * Enhanced Dashboard Component
 * Real-time updates, improved UX, and comprehensive analytics
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  Code,
  Trophy,
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap,
  BookOpen,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Settings,
  Bell,
  Filter,
  Download,
  Share2,
  Eye,
  Heart,
  MessageSquare,
  GitBranch,
  Play,
  Pause,
  SkipForward,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { queryKeys } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { log } from '@/utils/logger';

// Types
interface DashboardStats {
  totalProjects: number;
  totalExecutions: number;
  totalLinesOfCode: number;
  streakDays: number;
  achievements: Achievement[];
  weeklyActivity: ActivityData[];
  languageUsage: LanguageUsage[];
  recentActivity: ActivityItem[];
  collaborations: number;
  publicProjects: number;
  privateProjects: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

interface ActivityData {
  date: string;
  executions: number;
  linesOfCode: number;
  projects: number;
}

interface LanguageUsage {
  language: string;
  percentage: number;
  projects: number;
  executions: number;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'project_created' | 'code_executed' | 'achievement_unlocked' | 'collaboration_started';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  streak: number;
  badge?: string;
}

interface TrendingProject {
  id: string;
  name: string;
  description: string;
  language: string;
  author: string;
  authorAvatar?: string;
  views: number;
  likes: number;
  forks: number;
  createdAt: string;
}

// Mock data generators
const generateMockStats = (): DashboardStats => ({
  totalProjects: 12,
  totalExecutions: 156,
  totalLinesOfCode: 2847,
  streakDays: 7,
  achievements: [
    {
      id: '1',
      name: 'First Steps',
      description: 'Created your first project',
      icon: '🎯',
      unlockedAt: '2024-01-15T10:00:00Z',
      rarity: 'common',
    },
    {
      id: '2',
      name: 'Code Runner',
      description: 'Executed 100 code snippets',
      icon: '⚡',
      unlockedAt: '2024-01-20T15:30:00Z',
      rarity: 'rare',
    },
    {
      id: '3',
      name: 'Week Warrior',
      description: 'Maintained a 7-day coding streak',
      icon: '🔥',
      unlockedAt: '2024-01-22T09:15:00Z',
      rarity: 'epic',
      progress: 7,
      maxProgress: 7,
    },
  ],
  weeklyActivity: [
    { date: '2024-01-15', executions: 12, linesOfCode: 245, projects: 1 },
    { date: '2024-01-16', executions: 8, linesOfCode: 189, projects: 0 },
    { date: '2024-01-17', executions: 15, linesOfCode: 312, projects: 2 },
    { date: '2024-01-18', executions: 22, linesOfCode: 456, projects: 1 },
    { date: '2024-01-19', executions: 18, linesOfCode: 378, projects: 0 },
    { date: '2024-01-20', executions: 25, linesOfCode: 523, projects: 3 },
    { date: '2024-01-21', executions: 19, linesOfCode: 401, projects: 1 },
  ],
  languageUsage: [
    { language: 'JavaScript', percentage: 45, projects: 5, executions: 70, color: '#F7DF1E' },
    { language: 'Python', percentage: 30, projects: 3, executions: 47, color: '#3776AB' },
    { language: 'TypeScript', percentage: 15, projects: 2, executions: 23, color: '#3178C6' },
    { language: 'Go', percentage: 10, projects: 2, executions: 16, color: '#00ADD8' },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'project_created',
      title: 'Created "React Dashboard"',
      description: 'A new React project with TypeScript',
      timestamp: '2024-01-21T14:30:00Z',
    },
    {
      id: '2',
      type: 'code_executed',
      title: 'Executed Python script',
      description: 'Data analysis with pandas',
      timestamp: '2024-01-21T13:15:00Z',
    },
    {
      id: '3',
      type: 'achievement_unlocked',
      title: 'Unlocked "Week Warrior"',
      description: 'Maintained a 7-day coding streak',
      timestamp: '2024-01-21T09:00:00Z',
    },
  ],
  collaborations: 3,
  publicProjects: 8,
  privateProjects: 4,
  totalViews: 1247,
  totalLikes: 89,
  totalComments: 23,
});

const generateMockLeaderboard = (): LeaderboardEntry[] => [
  { rank: 1, userId: '1', username: 'codemaster', points: 2450, streak: 15, badge: '👑' },
  { rank: 2, userId: '2', username: 'pythonista', points: 2180, streak: 12, badge: '🥈' },
  { rank: 3, userId: '3', username: 'jsdev', points: 1950, streak: 8, badge: '🥉' },
  { rank: 4, userId: '4', username: 'rustacean', points: 1720, streak: 6 },
  { rank: 5, userId: '5', username: 'gopher', points: 1580, streak: 4 },
];

const generateMockTrending = (): TrendingProject[] => [
  {
    id: '1',
    name: 'AI Chat Bot',
    description: 'A conversational AI built with Python and OpenAI',
    language: 'Python',
    author: 'aidev',
    views: 1250,
    likes: 89,
    forks: 23,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'React Component Library',
    description: 'Reusable UI components for React applications',
    language: 'TypeScript',
    author: 'reactpro',
    views: 980,
    likes: 67,
    forks: 18,
    createdAt: '2024-01-19T15:30:00Z',
  },
  {
    id: '3',
    name: 'Go Microservice',
    description: 'High-performance microservice architecture',
    language: 'Go',
    author: 'gopher',
    views: 756,
    likes: 45,
    forks: 12,
    createdAt: '2024-01-18T09:15:00Z',
  },
];

export function EnhancedDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: queryKeys.dashboard.stats(user?.id || ''),
    queryFn: () => generateMockStats(),
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds if enabled
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: queryKeys.dashboard.leaderboard(),
    queryFn: () => generateMockLeaderboard(),
    refetchInterval: autoRefresh ? 60000 : false, // Refresh every minute
  });

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: queryKeys.dashboard.trending(),
    queryFn: () => generateMockTrending(),
    refetchInterval: autoRefresh ? 120000 : false, // Refresh every 2 minutes
  });

  // Real-time updates simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats(user?.id || '') });
      log.debug('Dashboard auto-refresh triggered', undefined, 'DASHBOARD');
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, queryClient, user?.id]);

  const handleRefresh = () => {
    refetchStats();
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.leaderboard() });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.trending() });
    log.user('Dashboard manually refreshed');
  };

  const handleExportData = () => {
    // Export dashboard data
    const data = { stats, leaderboard, trending };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    log.user('Dashboard data exported');
  };

  if (statsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'Developer'}! 👋
            </h1>
            <p className="text-white/70">
              Here's what's happening with your coding journey
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm text-white/70">Auto-refresh</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically refresh dashboard data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Button
              onClick={handleExportData}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-white/20">
              Community
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-white/20">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab stats={stats!} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab stats={stats!} />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityTab 
              leaderboard={leaderboard!} 
              trending={trending!}
              isLoading={leaderboardLoading || trendingLoading}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsTab achievements={stats?.achievements || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats }: { stats: DashboardStats }) {
  return (
    <>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Code className="w-6 h-6" />}
          trend="+2 this week"
          color="blue"
        />
        <MetricCard
          title="Code Executions"
          value={stats.totalExecutions}
          icon={<Play className="w-6 h-6" />}
          trend="+15 today"
          color="green"
        />
        <MetricCard
          title="Lines of Code"
          value={stats.totalLinesOfCode.toLocaleString()}
          icon={<BarChart3 className="w-6 h-6" />}
          trend="+234 this week"
          color="purple"
        />
        <MetricCard
          title="Streak Days"
          value={stats.streakDays}
          icon={<Zap className="w-6 h-6" />}
          trend="Keep it up!"
          color="orange"
        />
      </div>

      {/* Activity and Language Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart data={stats.weeklyActivity} />
        <LanguageUsageChart data={stats.languageUsage} />
      </div>

      {/* Recent Activity */}
      <RecentActivityCard activities={stats.recentActivity} />
    </>
  );
}

// Analytics Tab Component
function AnalyticsTab({ stats }: { stats: DashboardStats }) {
  return (
    <>
      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total Views</span>
                <span className="text-white font-semibold">{stats.totalViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Public Projects</span>
                <span className="text-white font-semibold">{stats.publicProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Private Projects</span>
                <span className="text-white font-semibold">{stats.privateProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total Likes</span>
                <span className="text-white font-semibold">{stats.totalLikes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Comments</span>
                <span className="text-white font-semibold">{stats.totalComments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Collaborations</span>
                <span className="text-white font-semibold">{stats.collaborations}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">This Week</span>
                <span className="text-green-400 font-semibold">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">This Month</span>
                <span className="text-green-400 font-semibold">+34%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">All Time</span>
                <span className="text-blue-400 font-semibold">Rank #42</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Coding Activity Heatmap</CardTitle>
            <CardDescription className="text-white/70">
              Your coding activity over the past weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-white/50">
              Activity heatmap visualization would go here
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Community Tab Component
function CommunityTab({ 
  leaderboard, 
  trending, 
  isLoading 
}: { 
  leaderboard: LeaderboardEntry[]; 
  trending: TrendingProject[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div className="text-white">Loading community data...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leaderboard */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </CardTitle>
          <CardDescription className="text-white/70">
            Top performers this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm">
                      {entry.rank}
                    </div>
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        {entry.username}
                        {entry.badge && <span>{entry.badge}</span>}
                      </div>
                      <div className="text-white/60 text-sm">
                        {entry.streak} day streak
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {entry.points.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">points</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Trending Projects */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trending Projects
          </CardTitle>
          <CardDescription className="text-white/70">
            Popular projects in the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {trending.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold">{project.name}</h3>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {project.language}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-white/60 text-sm">by {project.author}</div>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {project.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {project.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {project.forks}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Achievements Tab Component
function AchievementsTab({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{achievement.icon}</div>
                <div>
                  <h3 className="text-white font-semibold">{achievement.name}</h3>
                  <p className="text-white/70 text-sm">{achievement.description}</p>
                </div>
              </div>
              
              {achievement.progress !== undefined && achievement.maxProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className={`
                    ${achievement.rarity === 'common' && 'bg-gray-500/20 text-gray-300'}
                    ${achievement.rarity === 'rare' && 'bg-blue-500/20 text-blue-300'}
                    ${achievement.rarity === 'epic' && 'bg-purple-500/20 text-purple-300'}
                    ${achievement.rarity === 'legendary' && 'bg-yellow-500/20 text-yellow-300'}
                  `}
                >
                  {achievement.rarity}
                </Badge>
                <span className="text-white/60 text-sm">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Helper Components
function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  trend: string; 
  color: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-white/70 text-sm">{title}</div>
          </div>
        </div>
        <div className="text-green-400 text-sm">{trend}</div>
      </CardContent>
    </Card>
  );
}

function ActivityChart({ data }: { data: ActivityData[] }) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Weekly Activity
        </CardTitle>
        <CardDescription className="text-white/70">
          Your coding activity over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all hover:from-blue-400 hover:to-blue-300"
                style={{ height: `${(day.executions / 25) * 100}%` }}
              />
              <div className="text-white/60 text-xs">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LanguageUsageChart({ data }: { data: LanguageUsage[] }) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Language Usage
        </CardTitle>
        <CardDescription className="text-white/70">
          Your most used programming languages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((lang) => (
            <div key={lang.language} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{lang.language}</span>
                <span className="text-white/70">{lang.percentage}%</span>
              </div>
              <Progress value={lang.percentage} className="h-2" />
              <div className="flex justify-between text-sm text-white/60">
                <span>{lang.projects} projects</span>
                <span>{lang.executions} executions</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityCard({ activities }: { activities: ActivityItem[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created':
        return <Code className="w-4 h-4" />;
      case 'code_executed':
        return <Play className="w-4 h-4" />;
      case 'achievement_unlocked':
        return <Trophy className="w-4 h-4" />;
      case 'collaboration_started':
        return <Users className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-white/70">
          Your latest coding activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-full bg-blue-500/20 text-blue-300">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{activity.title}</h4>
                  <p className="text-white/70 text-sm">{activity.description}</p>
                  <span className="text-white/50 text-xs">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-white/10 rounded-lg"></div>
            <div className="h-80 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedDashboard;