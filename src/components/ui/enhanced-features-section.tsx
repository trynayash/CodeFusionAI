import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconScoutAsset, useIconScoutAsset } from '@/components/ui/iconscout-asset';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Code2, 
  Globe, 
  Zap, 
  Shield, 
  Users, 
  Rocket, 
  Database,
  GitBranch,
  Smartphone
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  iconScoutQuery: string;
  badge?: string;
  color: string;
}

const features: Feature[] = [
  {
    title: 'AI-Powered Code Assistant',
    description: 'Get intelligent code suggestions, bug fixes, and optimization recommendations powered by advanced AI.',
    icon: Brain,
    iconScoutQuery: 'artificial intelligence brain',
    badge: 'AI',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: '50+ Programming Languages',
    description: 'Write code in Python, JavaScript, Java, C++, Go, Rust, and 45+ more languages with full syntax support.',
    icon: Code2,
    iconScoutQuery: 'programming languages code',
    badge: '50+',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Real-Time Collaboration',
    description: 'Work together with your team in real-time. Share code, debug together, and build amazing projects.',
    icon: Users,
    iconScoutQuery: 'team collaboration',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Cloud-Based Development',
    description: 'Access your development environment from anywhere. No setup required, just open and start coding.',
    icon: Globe,
    iconScoutQuery: 'cloud computing',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Lightning Fast Performance',
    description: 'Experience blazing-fast code execution and compilation with our optimized cloud infrastructure.',
    icon: Zap,
    iconScoutQuery: 'lightning speed fast',
    badge: 'Fast',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Enterprise Security',
    description: 'Your code is protected with enterprise-grade security, encryption, and privacy controls.',
    icon: Shield,
    iconScoutQuery: 'security shield protection',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Instant Deployment',
    description: 'Deploy your applications instantly to the cloud with one-click deployment and automatic scaling.',
    icon: Rocket,
    iconScoutQuery: 'rocket launch deployment',
    color: 'from-pink-500 to-rose-500'
  },
  {
    title: 'Database Integration',
    description: 'Connect to popular databases like PostgreSQL, MongoDB, MySQL, and more with built-in tools.',
    icon: Database,
    iconScoutQuery: 'database storage',
    color: 'from-teal-500 to-green-500'
  },
  {
    title: 'Git Integration',
    description: 'Seamless Git integration with GitHub, GitLab, and Bitbucket. Version control made simple.',
    icon: GitBranch,
    iconScoutQuery: 'git version control',
    color: 'from-gray-500 to-slate-500'
  },
  {
    title: 'Mobile Development',
    description: 'Build mobile apps for iOS and Android with React Native, Flutter, and native development tools.',
    icon: Smartphone,
    iconScoutQuery: 'mobile app development',
    color: 'from-violet-500 to-purple-500'
  }
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const { asset, loading } = useIconScoutAsset('3d-icon', feature.iconScoutQuery, { style: '3d' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              {/* IconScout 3D Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                {asset && !loading ? (
                  <IconScoutAsset
                    url={asset.url}
                    alt={`${feature.title} Icon`}
                    type="3d-icon"
                    size="lg"
                    className="w-10 h-10"
                  />
                ) : (
                  <feature.icon className="w-8 h-8 text-primary" />
                )}
              </div>
              
              {/* Gradient Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />
            </div>
            
            {feature.badge && (
              <Badge variant="secondary" className="text-xs font-semibold">
                {feature.badge}
              </Badge>
            )}
          </div>
          
          <div>
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
              {feature.title}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="text-base leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EnhancedFeaturesSection: React.FC = () => {
  const { asset: mainIllustration } = useIconScoutAsset('illustration', 'developer coding features', { style: 'modern' });

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            ✨ Powerful Features
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {" "}build amazing software
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From AI-powered assistance to real-time collaboration, our platform provides 
            all the tools and features you need to code efficiently and effectively.
          </p>
        </motion.div>

        {/* Main Illustration */}
        {mainIllustration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center mb-16"
          >
            <div className="relative">
              <IconScoutAsset
                url={mainIllustration.url}
                alt="Development Features Illustration"
                type="illustration"
                className="w-full max-w-md h-auto"
              />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-full h-full bg-primary/20 rounded-full" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="w-full h-full bg-blue-500/30 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to experience the future of coding?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Free Trial
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-border rounded-lg font-semibold hover:bg-muted/50 transition-colors"
            >
              View All Features
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;