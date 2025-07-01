import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Github, Loader, Sparkles, CheckCircle, Shield, Zap } from 'lucide-react';
import { authService } from '../lib/supabase';
import { notificationManager } from './SimpleNotification';

interface ImprovedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImprovedAuthModal({ isOpen, onClose, onSuccess }: ImprovedAuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true); // Default to sign up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      notificationManager.error('Validation Error', 'Email is required');
      return false;
    }
    
    if (!email.includes('@')) {
      notificationManager.error('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      notificationManager.error('Validation Error', 'Password is required');
      return false;
    }
    
    if (password.length < 6) {
      notificationManager.error('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (isSignUp && !fullName.trim()) {
      notificationManager.error('Validation Error', 'Full name is required for sign up');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isSignUp) {
        await authService.signUp(email, password, fullName);
        
        setEmailSent(true);
        notificationManager.success(
          'Welcome to KaneDocs! 🎉',
          `Account created successfully! We've sent a confirmation email to ${email}. Please check your inbox and click the link to verify your account.`,
          8000
        );
        
        // Show additional info after a delay
        setTimeout(() => {
          notificationManager.info(
            'Check Your Email 📧',
            'Don\'t forget to check your spam folder if you don\'t see the email in your inbox.',
            6000
          );
        }, 2000);
        
      } else {
        const { user } = await authService.signIn(email, password);
        
        const displayName = user?.user_metadata?.full_name || fullName || email.split('@')[0];
        notificationManager.success(
          `Welcome back, ${displayName}! 👋`,
          'Successfully signed in. You now have access to all KaneDocs features.',
          4000
        );
        
        onSuccess();
        onClose();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      
      let friendlyMessage = errorMessage;
      if (errorMessage.includes('Invalid login credentials')) {
        friendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorMessage.includes('Email not confirmed')) {
        friendlyMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (errorMessage.includes('User already registered')) {
        friendlyMessage = 'An account with this email already exists. Try signing in instead.';
        setIsSignUp(false);
      }
      
      notificationManager.error('Authentication Failed', friendlyMessage, 6000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
    setEmailSent(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {emailSent ? 'Check Your Email' : (isSignUp ? 'Join KaneDocs' : 'Welcome Back')}
                </h2>
                <p className="text-white/80 text-sm">
                  {emailSent ? 'Verification email sent' : (isSignUp ? 'Create your free account' : 'Sign in to your account')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Email Sent Success State */}
        {emailSent ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Account Created Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              We've sent a verification email to <strong>{email}</strong>. 
              Please check your inbox and click the confirmation link to complete your registration and access all KaneDocs features.
            </p>
            
            {/* Benefits reminder */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What's Next?
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <Shield size={14} />
                  <span>Secure access to all features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} />
                  <span>AI-powered documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github size={14} />
                  <span>Git-like version control</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setIsSignUp(false);
                  resetForm();
                }}
                className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                Sign In Instead
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
          </div>
        ) : (
          /* Form */
          <>
            {/* Benefits Banner for Sign Up */}
            {isSignUp && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-green-500" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={12} className="text-blue-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={12} className="text-purple-500" />
                    <span>AI-Powered</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required={isSignUp}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This will be your display name in commits and repositories
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 6 characters long
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <Github size={18} />
                    {isSignUp ? 'Create Free Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* Footer */}
        {!emailSent && (
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up Free'}
              </button>
            </p>
            
            {isSignUp && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}