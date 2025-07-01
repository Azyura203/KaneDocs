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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 animate-pulse"></div>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading KaneDocs...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:20px_20px] opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/50 to-purple-50/50 dark:from-transparent dark:via-blue-900/20 dark:to-purple-900/20"></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-white font-bold text-4xl">K</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-25 animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              KaneDocs
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              The modern documentation platform with integrated 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> GitHub-like version control</span> features
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mb-12 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                <span>10,000+ Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span>Enterprise Ready</span>
              </div>
            </div>
          </div>

          {/* Authentication Card */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Join KaneDocs Today
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  Create your free account to access powerful documentation tools trusted by developers worldwide.
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Zap size={20} className="text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Free Forever</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Shield size={20} className="text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Secure</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Sparkles size={20} className="text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">AI-Powered</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <User size={20} />
                    Get Started Free
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <Github size={20} />
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GitBranch className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Version Control
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Git-like version control for your documentation with commit history, branching, and visual diffs.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  AI Generation
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generate comprehensive documentation using AI with pre-built templates and smart suggestions.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Live Editor
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Real-time markdown editor with live preview, collaborative features, and advanced formatting.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center">
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Trusted by developers at leading companies
              </p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="w-24 h-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="w-24 h-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="w-24 h-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="w-24 h-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
              </div>
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