import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import logoSvg from '@/assets/logo-cool.png';

export default function EmailVerification() {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is already verified
    if (user?.email_confirmed_at) {
      setIsVerified(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }

    // Handle email confirmation from URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (accessToken && refreshToken && type === 'signup') {
      // User clicked verification link
      setIsVerified(true);
      toast({
        variant: "success",
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  }, [user, searchParams, navigate, toast]);

  useEffect(() => {
    // Cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No email address found. Please sign up again.",
      });
      return;
    }

    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          variant: "success",
          title: "Verification email sent!",
          description: "Check your inbox for the verification link.",
        });
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back to home button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 backdrop-blur-sm border border-white/20 dark:border-slate-700/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-2xl rounded-3xl">
          {!isVerified ? (
            <>
              {/* Logo and Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={logoSvg} alt="CodeFusion AI" className="w-12 h-12 rounded-xl shadow-lg" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"></div>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white">CodeFusion AI</h1>
                    </div>
                  </div>
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Verify Your Email
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We've sent a verification link to{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {user?.email}
                  </span>
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Check your email
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                      Click the verification link in your email to activate your account. 
                      The link will expire in 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resend Button */}
              <div className="space-y-4">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || resendCooldown > 0}
                  variant="outline"
                  className="w-full bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300"
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : resendCooldown > 0 ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Resend in {resendCooldown}s
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Resend Verification Email
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Didn't receive the email? Check your spam folder.
                  </p>
                  
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="ghost"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={logoSvg} alt="CodeFusion AI" className="w-12 h-12 rounded-xl shadow-lg" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"></div>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white">CodeFusion AI</h1>
                    </div>
                  </div>
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Email Verified!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Your email has been successfully verified. Welcome to CodeFusion AI!
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Redirecting you to the dashboard...
                </p>
                
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}