import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Github, Menu, X, Command, PanelLeftClose, PanelLeft } from 'lucide-react';
import SearchModal from './SearchModal';
import AuthButton from './AuthButton';

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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            {/* Sidebar toggle for desktop */}
            {onSidebarToggle && (
              <button
                onClick={onSidebarToggle}
                className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                aria-label="Toggle sidebar"
                title={`${isSidebarOpen ? 'Hide' : 'Show'} sidebar (⌘B)`}
              >
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
              </button>
            )}
            
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform duration-200 hover:scale-110">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                KaneDocs
              </h1>
            </div>
          </div>

          {/* Center - Enhanced Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-left group"
            >
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                <Search size={16} />
                <span className="text-sm">Search documentation...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-500 dark:text-slate-400 font-mono">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Mobile search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            {/* GitHub link */}
            <a
              href="https://github.com/yourusername/kanedocs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              aria-label="GitHub"
              title="View on GitHub"
            >
              <Github size={18} />
            </a>

            {/* Auth Button */}
            <AuthButton />

            {/* Sidebar toggle hint for desktop */}
            {onSidebarToggle && (
              <div className="hidden xl:flex items-center gap-1 ml-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 dark:text-slate-400">
                <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs">
                  ⌘B
                </kbd>
                <span>Toggle</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          >
            <Search size={16} />
            <span className="text-sm">Search documentation...</span>
          </button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}