import React, { useState, useEffect } from 'react';
import { User, Lock, Shield, Sparkles, GitBranch, FileText, Zap, Github, Star, Users } from 'lucide-react';
import { authService, supabase } from '../lib/supabase';
import ImprovedAuthModal from './ImprovedAuthModal';
import { notificationManager } from './SimpleNotification';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, requireAuth = true, fallback }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN') {
        notificationManager.success(
          'Welcome to KaneDocs! 🎉',
          'You now have access to all documentation features.',
          4000
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Loading KaneDocs...</p>
        </div>
      </div>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: Show compact authentication required page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Compact Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            KaneDocs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Modern documentation with version control
          </p>
        </div>

        {/* Compact Authentication Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Sign in to access KaneDocs features including version control, AI generation, and collaborative editing.
            </p>
          </div>

          {/* Compact Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Zap size={14} className="text-green-600" />
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Free</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Shield size={14} className="text-blue-600" />
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Sparkles size={14} className="text-purple-600" />
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">AI-Powered</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <User size={18} />
              Get Started Free
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <Github size={18} />
              Sign In
            </button>
          </div>
        </div>

        {/* Compact Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <GitBranch size={16} className="text-blue-600" />
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Version Control</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Git-like versioning</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Sparkles size={16} className="text-purple-600" />
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">AI Generation</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Smart content</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <FileText size={16} className="text-green-600" />
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Live Editor</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time preview</p>
          </div>
        </div>

        {/* Trust Indicator */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>10k+ Users</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={12} />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <ImprovedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}