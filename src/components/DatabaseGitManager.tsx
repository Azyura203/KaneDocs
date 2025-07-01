import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Database,
  CheckCircle,
  Users,
  LogOut
} from 'lucide-react';
import LocalDatabaseGitManager from './LocalDatabaseGitManager';
import ImprovedAuthModal from './ImprovedAuthModal';
import { authService, supabase } from '../lib/supabase';
import { notificationManager } from './SimpleNotification';

export default function DatabaseGitManager() {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status
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
          'Welcome!',
          'Successfully signed in to KaneDocs.',
          3000
        );
      } else if (event === 'SIGNED_OUT') {
        notificationManager.info(
          'Signed Out',
          'You have been signed out successfully.',
          3000
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      notificationManager.success(
        'Signed Out',
        'You have been signed out successfully.',
        3000
      );
    } catch (error) {
      notificationManager.error(
        'Sign Out Failed',
        'Failed to sign out. Please try again.',
        4000
      );
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // User state will be updated by the auth state listener
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Database className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Local Git Manager
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Git-like version control with local storage
                </p>
              </div>
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-300">Local Storage</span>
              </div>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Users size={16} />
                  Sign In
                </button>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Local Storage Mode:</strong> All your repositories and data are stored securely in your browser. 
              {user ? ' You can optionally sign in to sync preferences.' : ' Sign in to save your preferences across devices.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <LocalDatabaseGitManager />
      </div>

      {/* Auth Modal */}
      <ImprovedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}