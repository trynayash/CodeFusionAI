import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Code, Sparkles, ArrowLeft, User, Mail, Lock, Shield, Github, Chrome, Linkedin, CheckCircle, AlertCircle, Star, Users, BookOpen, Zap, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { PasswordValidator } from '@/components/ui/password-validator';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { MagicLinkModal } from '@/components/auth/MagicLinkModal';
import { AuthButtonGroup } from '@/components/auth/AuthButtonGroup';
import { FeatureCard } from '@/components/auth/FeatureCard';
import { HighlightCard } from '@/components/auth/HighlightCard';
import CodeFusionLogo from '@/components/CodeFusionLogo';

interface SignUpForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInForm {
  email: string;
  password: string;
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showMagicLinkForm, setShowMagicLinkForm] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const { signUp, signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  const signUpForm = useForm<SignUpForm>();
  const signInForm = useForm<SignInForm>();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const onSignUp = async (data: SignUpForm) => {
    if (data.password !== data.confirmPassword) {
      signUpForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    if (!isPasswordValid) {
      signUpForm.setError('password', {
        type: 'manual',
        message: 'Password does not meet security requirements'
      });
      return;
    }

    await signUp(data.email, data.password, data.fullName, data.username);
  };

  const onSignIn = async (data: SignInForm) => {
    await signIn(data.email, data.password);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const handleGithubSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const handleMagicLinkSignIn = async (email: string) => {
    setIsMagicLinkLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/magic-link-handler`,
        },
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Magic link error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
        
        {/* Floating code elements */}
        <div className="absolute top-20 left-20 opacity-20">
          <Code className="w-8 h-8 text-blue-500 animate-bounce" />
        </div>
        <div className="absolute bottom-32 right-32 opacity-20">
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
        <div className="absolute top-1/3 right-20 opacity-20">
          <Zap className="w-7 h-7 text-indigo-500 animate-bounce delay-500" />
        </div>
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

      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg text-center"
        >
          {/* Logo and Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <CodeFusionLogo size="xl" animated={true} showText={true} />
              <div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Code smarter. Learn faster.</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {isSignUp ? 'Start Your Coding Journey' : 'Welcome Back, Developer!'}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              {isSignUp 
                ? 'Join thousands of developers mastering programming with AI-powered learning and real-time code visualization.'
                : 'Continue your coding adventure with personalized AI assistance and interactive learning experiences.'
              }
            </p>
          </motion.div>

          {/* AI Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg relative overflow-hidden">
                <Zap className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-pulse"></div>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">AI-Powered</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Smart Code Analysis</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg relative overflow-hidden">
                <Code className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse delay-300"></div>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">50+ Languages</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Multi-Language Support</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg relative overflow-hidden">
                <Sparkles className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse delay-500"></div>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">Real-Time</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Live Code Visualization</div>
            </div>
          </motion.div>

          {/* Innovation Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/30 relative overflow-hidden"
          >
            {/* Animated background elements */}
            <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-300/30 dark:border-blue-700/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">BETA ACCESS</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">
                🚀 Next-Gen AI Coding Platform
              </h3>
              
              <p className="text-slate-700 dark:text-slate-300 text-sm text-center leading-relaxed mb-4">
                Experience the future of programming with our revolutionary AI assistant that understands your code, provides intelligent suggestions, and visualizes complex algorithms in real-time.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Intelligent Code Completion</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Algorithm Visualization</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Real-time Error Detection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  <span>Interactive Learning</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-2xl rounded-3xl">
            {/* Mobile Logo - Only show on mobile */}
            <div className="flex lg:hidden items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <CodeFusionLogo size="lg" animated={true} showText={true} />
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Code smarter. Learn faster.</p>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {isSignUp 
                  ? 'Join the community of developers learning with AI'
                  : 'Sign in to continue your coding journey'
                }
              </p>
            </div>

            {/* Enhanced toggle buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-2xl p-1 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 transition-all duration-300 rounded-xl ${!isSignUp 
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-lg' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 transition-all duration-300 rounded-xl ${isSignUp 
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-lg' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </div>

          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={signUpForm.handleSubmit(onSignUp)}
                className="space-y-4"
              >
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      {...signUpForm.register('fullName', { required: 'Full name is required' })}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {signUpForm.formState.errors.fullName && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {signUpForm.formState.errors.fullName.message}
                    </motion.p>
                  )}
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      {...signUpForm.register('username', { required: 'Username is required' })}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Choose a username"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {signUpForm.formState.errors.username && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {signUpForm.formState.errors.username.message}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      {...signUpForm.register('email', { required: 'Email is required' })}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {signUpForm.formState.errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...signUpForm.register('password', { 
                        required: 'Password is required',
                        validate: () => isPasswordValid || 'Password does not meet security requirements'
                      })}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Create a secure password"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {signUpForm.formState.errors.password.message}
                    </motion.p>
                  )}
                  <PasswordValidator 
                    password={signUpForm.watch('password') || ''} 
                    onValidationChange={setIsPasswordValid}
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...signUpForm.register('confirmPassword', { required: 'Please confirm your password' })}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {signUpForm.formState.errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={signUpForm.formState.isSubmitting || !isPasswordValid}
                >
                  {signUpForm.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Account
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Auth Button Group */}
                <AuthButtonGroup
                  onGoogleSignIn={handleGoogleSignIn}
                  onGithubSignIn={handleGithubSignIn}
                  onMagicLinkClick={() => setShowMagicLinkForm(true)}
                  showMagicLink={false}
                  isLoading={signUpForm.formState.isSubmitting}
                />
              </motion.form>
            ) : (
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={signInForm.handleSubmit(onSignIn)}
                className="space-y-6"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="signin-email"
                      type="email"
                      {...signInForm.register('email', { required: 'Email is required' })}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {signInForm.formState.errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {signInForm.formState.errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium p-0 h-auto"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      {...signInForm.register('password', { required: 'Password is required' })}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {signInForm.formState.errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={signInForm.formState.isSubmitting}
                >
                  {signInForm.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Sign In
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Auth Button Group */}
                <AuthButtonGroup
                  onGoogleSignIn={handleGoogleSignIn}
                  onGithubSignIn={handleGithubSignIn}
                  onMagicLinkClick={() => setShowMagicLinkForm(true)}
                  showMagicLink={true}
                  isLoading={signInForm.formState.isSubmitting}
                />

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsSignUp(true)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold p-0 h-auto"
                    >
                      Sign up here
                    </Button>
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />

      {/* Magic Link Modal */}
      <MagicLinkModal 
        isOpen={showMagicLinkForm} 
        onClose={() => setShowMagicLinkForm(false)} 
      />
    </div>
  );
}