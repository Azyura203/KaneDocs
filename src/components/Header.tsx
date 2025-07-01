import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Github, Menu, X, Command, PanelLeftClose, PanelLeft } from 'lucide-react';
import SearchModal from './SearchModal';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen, onSidebarToggle, isSidebarOpen }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        onSidebarToggle?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSidebarToggle]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            {/* Sidebar toggle for desktop */}
            {onSidebarToggle && (
              <button
                onClick={onSidebarToggle}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                aria-label="Toggle sidebar"
                title={`${isSidebarOpen ? 'Hide' : 'Show'} sidebar (⌘B)`}
              >
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
              </button>
            )}
            
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <img 
                src="/kanedocs-logo.svg" 
                alt="KaneDocs Logo" 
                className="w-8 h-8 transition-transform duration-200 hover:scale-110"
                onError={(e) => {
                  // Fallback if logo fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center';
                  fallback.innerHTML = '<span class="text-white font-bold text-sm">K</span>';
                  target.parentNode?.insertBefore(fallback, target);
                }}
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                KaneDocs
              </h1>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-left"
            >
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Search size={16} />
                <span className="text-sm">Search documentation...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-500 dark:text-gray-400">
                  <Command size={12} />
                </kbd>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-500 dark:text-gray-400">
                  K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <a
              href="https://github.com/yourusername/kanedocs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>

            {/* Sidebar toggle hint for desktop */}
            {onSidebarToggle && (
              <div className="hidden xl:flex items-center gap-1 ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 dark:text-gray-400">
                <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">
                  ⌘B
                </kbd>
                <span>Toggle</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}