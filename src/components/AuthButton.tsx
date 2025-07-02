import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { authService, supabase, sessionManager } from '../lib/supabase';
import { notificationManager } from './SimpleNotification';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First try to initialize session from storage or Supabase
        const session = await sessionManager.initializeSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          // Fallback to current user check
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, !!session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        sessionManager.saveSession(session);
        
        // Only show welcome notification for actual sign-in events
        if (event === 'SIGNED_IN') {
          notificationManager.success(
            'Welcome!',
            'Successfully signed in to KaneDocs.',
            3000
          );
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        sessionManager.clearSession();
        
        notificationManager.info(
          'Signed Out',
          'You have been signed out successfully.',
          3000
        );
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        sessionManager.saveSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setShowUserMenu(false);
      
      // Clear any cached data
      sessionManager.clearSession();
      
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      notificationManager.error(
        'Sign Out Failed',
        'Failed to sign out. Please try again.',
        4000
      );
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Session will be handled by the auth state change listener
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    );
  }

  return (
    <>
      {user ? (
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')}&size=32&background=random`}
              alt={user.user_metadata?.full_name || 'User'}
              className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700"
            />
            <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
              
              <button
                onClick={() => {
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
        >
          <User size={16} />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}