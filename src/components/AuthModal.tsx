import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Github, Loader, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../lib/supabase';
import { notificationManager } from './SimpleNotification';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (isSignUp && !fullName.trim()) {
      newErrors.fullName = 'Full name is required for sign up';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      if (isSignUp) {
        await authService.signUp(email, password, fullName);
        
        setEmailSent(true);
        notificationManager.success(
          'Account Created! 🎉',
          `Welcome to KaneDocs! We've sent a confirmation email to ${email}. Please check your inbox and click the link to verify your account.`,
          8000
        );
        
      } else {
        const { user } = await authService.signIn(email, password);
        
        const displayName = user?.user_metadata?.full_name || fullName || email.split('@')[0];
        notificationManager.success(
          `Welcome back, ${displayName}! 👋`,
          'Successfully signed in. Your repositories and data are now available.',
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
    setErrors({});
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="text-white" size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {emailSent ? 'Check Email' : (isSignUp ? 'Join KaneDocs' : 'Welcome Back')}
                  </h2>
                  <p className="text-white/80 text-xs">
                    {emailSent ? 'Verification sent' : (isSignUp ? 'Create account' : 'Sign in to continue')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Email Sent Success State */}
          {emailSent ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Account Created!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                Check your email at <strong>{email}</strong> and click the confirmation link.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setIsSignUp(false);
                    resetForm();
                  }}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Sign In Instead
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Compact Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
                        errors.fullName ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
                      }`}
                      required={isSignUp}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.fullName}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
                      errors.email ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
                      errors.password ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.password}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must be at least 6 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none text-sm"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    {isSignUp ? 'Creating...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <Github size={16} />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Compact Footer */}
          {!emailSent && (
            <div className="px-6 pb-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isSignUp ? 'Have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={toggleMode}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}