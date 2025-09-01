import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Code, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';

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
  const { signUp, signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  const signUpForm = useForm<SignUpForm>();
  const signInForm = useForm<SignInForm>();

  useEffect(() => {
    if (user && !loading) {
      navigate('/editor');
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

    await signUp(data.email, data.password, data.fullName, data.username);
  };

  const onSignIn = async (data: SignInForm) => {
    await signIn(data.email, data.password);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-20 h-20 bg-secondary rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Back to home button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 text-white">
              <Code className="w-8 h-8" />
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-2xl font-bold">CodeFusion AI</span>
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="flex bg-white/10 rounded-lg p-1 mb-6">
            <Button
              variant={!isSignUp ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsSignUp(false)}
              className="flex-1 text-white hover:bg-white/20"
            >
              Sign In
            </Button>
            <Button
              variant={isSignUp ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsSignUp(true)}
              className="flex-1 text-white hover:bg-white/20"
            >
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
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <Input
                    id="fullName"
                    {...signUpForm.register('fullName', { required: 'Full name is required' })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    placeholder="Enter your full name"
                  />
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-destructive-foreground text-sm">{signUpForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    {...signUpForm.register('username', { required: 'Username is required' })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    placeholder="Choose a username"
                  />
                  {signUpForm.formState.errors.username && (
                    <p className="text-destructive-foreground text-sm">{signUpForm.formState.errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...signUpForm.register('email', { required: 'Email is required' })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    placeholder="Enter your email"
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-destructive-foreground text-sm">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...signUpForm.register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70 pr-10"
                      placeholder="Create a password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-transparent"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-destructive-foreground text-sm">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...signUpForm.register('confirmPassword', { required: 'Please confirm your password' })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70 pr-10"
                      placeholder="Confirm your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-transparent"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-destructive-foreground text-sm">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                  disabled={signUpForm.formState.isSubmitting}
                >
                  {signUpForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={signInForm.handleSubmit(onSignIn)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    {...signInForm.register('email', { required: 'Email is required' })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    placeholder="Enter your email"
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-destructive-foreground text-sm">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      {...signInForm.register('password', { required: 'Password is required' })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70 pr-10"
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-transparent"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-destructive-foreground text-sm">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                  disabled={signInForm.formState.isSubmitting}
                >
                  {signInForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}