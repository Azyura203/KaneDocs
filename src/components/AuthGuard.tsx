import React, { useState, useEffect } from 'react';
import { User, Lock, Shield, Sparkles, GitBranch, FileText, Zap } from 'lucide-react';
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
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading KaneDocs...</p>
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

  // Default: Show authentication required page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Branding */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-3xl">K</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Welcome to KaneDocs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The modern documentation platform with integrated GitHub-like version control features
            </p>
          </div>

          {/* Authentication Required Message */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Lock className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign Up Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              To access KaneDocs' powerful documentation features, you'll need to create a free account. 
              Join thousands of developers who trust KaneDocs for their documentation needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <User size={20} />
                Get Started Free
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-3 px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-200"
              >
                <Shield size={20} />
                Sign In
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Version Control
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Git-like version control for your documentation with commit history and branching.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Generate comprehensive documentation using AI with pre-built templates.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Live Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Real-time markdown editor with live preview and collaborative features.
              </p>
            </div>
          </div>

          {/* Security & Trust Indicators */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span>Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-blue-500" />
                <span>Data Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" />
                <span>Free to Start</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                Privacy Policy
              </a>
            </p>
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