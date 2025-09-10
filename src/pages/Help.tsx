import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MessageCircle, Book, Video, FileText, HelpCircle, Zap, Users, ChevronRight } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const helpCategories = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Learn the basics of CodeFusion AI",
    articles: 12,
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Book,
    title: "Courses & Learning",
    description: "How to make the most of our courses",
    articles: 8,
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Users,
    title: "Account & Billing",
    description: "Manage your subscription and profile",
    articles: 15,
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Get help with our AI coding assistant",
    articles: 6,
    color: "from-orange-500 to-red-500"
  }
];

const popularArticles = [
  "How to get started with CodeFusion AI",
  "Setting up your development environment",
  "Understanding the AI code suggestions",
  "Managing your learning progress",
  "Troubleshooting common issues",
  "Customizing your coding experience"
];

const quickActions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "Start Chat"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch step-by-step guides",
    action: "View Videos"
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Browse our detailed docs",
    action: "Read Docs"
  }
];

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Find answers to your questions and get the most out of CodeFusion AI
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-background/50 backdrop-blur-sm border-2 border-border/20 focus:border-primary/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mb-16">
        <div className="container max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                      <action.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{action.description}</p>
                      <Button variant="outline" size="sm">
                        {action.action}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="px-4 mb-16">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find help organized by topics</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + 0.1 * index }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg mb-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{category.articles} articles</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="px-4 pb-20">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Popular Articles</h2>
            <p className="text-muted-foreground">Most viewed help articles this month</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Card className="divide-y divide-border/30">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={article}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + 0.05 * index }}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <span className="text-foreground/80 hover:text-primary transition-colors">{article}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}