import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Github, Loader, Sparkles, CheckCircle, Shield, Zap, Star } from 'lucide-react';
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
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {emailSent ? 'Check Your Email' : (isSignUp ? 'Join KaneDocs' : 'Welcome Back')}
                </h2>
                <p className="text-white/80 text-sm">
                  {emailSent ? 'Verification email sent' : (isSignUp ? 'Create your free account' : 'Sign in to continue')}
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
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Account Created Successfully!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              We've sent a verification email to <strong className="text-slate-900 dark:text-white">{email}</strong>. 
              Please check your inbox and click the confirmation link to complete your registration.
            </p>
            
            {/* Benefits reminder */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                What's waiting for you:
              </h4>
              <div className="grid grid-cols-1 gap-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                    <Shield size={14} />
                  </div>
                  <span>Secure access to all features</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <span>AI-powered documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                    <Github size={14} />
                  </div>
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
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
              >
                Sign In Instead
              </button>
              <button
                onClick={onClose}
                className="w-full px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
          </div>
        ) : (
          /* Form */
          <>
            {/* Benefits Banner for Sign Up */}
            {isSignUp && (
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Zap size={10} className="text-green-600" />
                    </div>
                    <span className="font-medium">Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Shield size={10} className="text-blue-600" />
                    </div>
                    <span className="font-medium">Enterprise Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Star size={10} className="text-purple-600" />
                    </div>
                    <span className="font-medium">AI-Powered</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required={isSignUp}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This will be your display name in commits and repositories
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must be at least 6 characters long
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <Github size={20} />
                    {isSignUp ? 'Create Free Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* Footer */}
        {!emailSent && (
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up Free'}
              </button>
            </p>
            
            {isSignUp && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
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