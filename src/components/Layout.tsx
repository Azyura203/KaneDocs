import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { NotificationContainer, notificationManager } from './SimpleNotification';
import { sessionManager } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
    
    // Initialize session on app start
    sessionManager.initializeSession().catch(console.error);
    
    // Reset notification session to prevent stale notifications
    notificationManager.resetSession();
  }, []);

  // Load sidebar state from localStorage
  useEffect(() => {
    if (!mounted) return;
    
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setIsSidebarOpen(savedState === 'true');
    }
  }, [mounted]);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('sidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen, mounted]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!mounted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header 
        onSidebarToggle={showSidebar ? toggleSidebar : undefined}
        isSidebarOpen={showSidebar ? isSidebarOpen : false}
        onMenuToggle={showSidebar ? toggleMobileMenu : undefined}
        isMenuOpen={showSidebar ? isMobileMenuOpen : false}
      />

      <div className="flex">
        {showSidebar && (
          <Sidebar 
            isOpen={isMobileMenuOpen}
            onClose={closeMobileMenu}
            isCollapsed={!isSidebarOpen}
          />
        )}

        <main className={`flex-1 min-w-0 transition-all duration-300 ${
          showSidebar && isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          {children}
        </main>
      </div>

      {/* Notification Container - Only render once */}
      <NotificationContainer />
    </div>
  );
}