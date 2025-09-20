import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconScoutAsset, useIconScoutAsset } from '@/components/ui/iconscout-asset';
import { motion } from 'framer-motion';
import { 
  FileX, 
  Search, 
  Plus, 
  RefreshCw, 
  Folder,
  Code,
  Users,
  BookOpen,
  Zap
} from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'no-files' | 'no-projects' | 'no-courses' | 'no-collaborators' | 'error' | 'loading';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  showAnimation?: boolean;
}

const emptyStateConfig = {
  'no-results': {
    icon: Search,
    defaultTitle: 'No results found',
    defaultDescription: 'Try adjusting your search criteria or filters to find what you\'re looking for.',
    animationQuery: 'search empty no results',
    actionLabel: 'Clear filters',
    color: 'text-blue-500'
  },
  'no-files': {
    icon: FileX,
    defaultTitle: 'No files yet',
    defaultDescription: 'Create your first file to get started with your project.',
    animationQuery: 'empty folder no files',
    actionLabel: 'Create file',
    color: 'text-purple-500'
  },
  'no-projects': {
    icon: Folder,
    defaultTitle: 'No projects yet',
    defaultDescription: 'Start your coding journey by creating your first project.',
    animationQuery: 'empty project folder',
    actionLabel: 'Create project',
    color: 'text-green-500'
  },
  'no-courses': {
    icon: BookOpen,
    defaultTitle: 'No courses available',
    defaultDescription: 'Check back later for new courses or explore our other learning resources.',
    animationQuery: 'empty education learning',
    actionLabel: 'Browse all courses',
    color: 'text-orange-500'
  },
  'no-collaborators': {
    icon: Users,
    defaultTitle: 'No collaborators yet',
    defaultDescription: 'Invite team members to collaborate on this project.',
    animationQuery: 'empty team collaboration',
    actionLabel: 'Invite collaborators',
    color: 'text-pink-500'
  },
  'error': {
    icon: RefreshCw,
    defaultTitle: 'Something went wrong',
    defaultDescription: 'We encountered an error while loading your content. Please try again.',
    animationQuery: 'error broken sad',
    actionLabel: 'Try again',
    color: 'text-red-500'
  },
  'loading': {
    icon: Zap,
    defaultTitle: 'Loading...',
    defaultDescription: 'Please wait while we fetch your content.',
    animationQuery: 'loading spinner progress',
    actionLabel: '',
    color: 'text-blue-500'
  }
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
  showAnimation = true
}) => {
  const config = emptyStateConfig[type];
  const IconComponent = config.icon;

  // Fetch Lottie animation for the empty state
  const { asset: animationAsset, loading: animationLoading } = useIconScoutAsset(
    'lottie-animation',
    config.animationQuery,
    {}
  );

  // Fetch illustration as fallback
  const { asset: illustrationAsset } = useIconScoutAsset(
    'illustration',
    config.animationQuery,
    {}
  );

  const effectiveTitle = title || config.defaultTitle;
  const effectiveDescription = description || config.defaultDescription;
  const effectiveActionLabel = actionLabel || config.actionLabel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center text-center space-y-6 p-8">
          {/* Animation/Illustration */}
          {showAnimation && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-48 h-48 flex items-center justify-center"
            >
              {animationAsset && !animationLoading ? (
                <IconScoutAsset
                  url={animationAsset.url}
                  alt={`${type} animation`}
                  type="lottie-animation"
                  className="w-full h-full"
                  autoPlay={true}
                  loop={type === 'loading'}
                />
              ) : illustrationAsset ? (
                <IconScoutAsset
                  url={illustrationAsset.url}
                  alt={`${type} illustration`}
                  type="illustration"
                  className="w-full h-full"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center">
                  <IconComponent className={`w-16 h-16 ${config.color}`} />
                </div>
              )}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3 max-w-md"
          >
            <h3 className="text-2xl font-semibold text-foreground">
              {effectiveTitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {effectiveDescription}
            </p>
          </motion.div>

          {/* Actions */}
          {(effectiveActionLabel || secondaryActionLabel) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {effectiveActionLabel && onAction && (
                <Button
                  onClick={onAction}
                  size="lg"
                  className="px-6"
                  disabled={type === 'loading'}
                >
                  {type === 'loading' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {effectiveActionLabel}
                </Button>
              )}
              
              {secondaryActionLabel && onSecondaryAction && (
                <Button
                  variant="outline"
                  onClick={onSecondaryAction}
                  size="lg"
                  className="px-6"
                >
                  {secondaryActionLabel}
                </Button>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Specialized empty state components
export const NoResultsState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-results" {...props} />
);

export const NoFilesState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-files" {...props} />
);

export const NoProjectsState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-projects" {...props} />
);

export const NoCoursesState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-courses" {...props} />
);

export const NoCollaboratorsState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-collaborators" {...props} />
);

export const ErrorState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="error" {...props} />
);

export const LoadingState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="loading" {...props} />
);

export default EmptyState;