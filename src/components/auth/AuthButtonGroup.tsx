import { motion } from 'framer-motion';
import { OAuthButton } from './OAuthButton';
import { MagicLinkButton } from './MagicLinkButton';

interface AuthButtonGroupProps {
  onGoogleSignIn: () => void;
  onGithubSignIn: () => void;
  onLinkedInSignIn?: () => void;
  onMagicLinkClick: () => void;
  showMagicLink?: boolean;
  isLoading?: boolean;
}

export function AuthButtonGroup({
  onGoogleSignIn,
  onGithubSignIn,
  onLinkedInSignIn,
  onMagicLinkClick,
  showMagicLink = true,
  isLoading = false
}: AuthButtonGroupProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* OAuth Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div variants={itemVariants}>
          <OAuthButton
            provider="google"
            onClick={onGoogleSignIn}
            disabled={isLoading}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <OAuthButton
            provider="github"
            onClick={onGithubSignIn}
            disabled={isLoading}
          />
        </motion.div>
      </div>

      {/* LinkedIn Button (if provided) */}
      {onLinkedInSignIn && (
        <motion.div variants={itemVariants}>
          <OAuthButton
            provider="linkedin"
            onClick={onLinkedInSignIn}
            disabled={isLoading}
          />
        </motion.div>
      )}

      {/* Magic Link Section */}
      {showMagicLink && (
        <motion.div variants={itemVariants} className="pt-2">
          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-3 text-slate-500 dark:text-slate-400 font-medium">
                Or try passwordless
              </span>
            </div>
          </div>

          {/* Magic Link Button */}
          <MagicLinkButton
            onClick={onMagicLinkClick}
            disabled={isLoading}
          />
        </motion.div>
      )}
    </motion.div>
  );
}