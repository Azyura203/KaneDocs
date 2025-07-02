import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Book, 
  User, 
  Edit3, 
  FolderOpen, 
  Sparkles, 
  GitBranch, 
  Database, 
  GitCommit,
  Tag,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  children?: NavItem[];
  badge?: string;
  requiresAuth?: boolean;
}

const navigationItems: NavItem[] = [
  {
    title: 'Overview',
    icon: <Book size={16} />,
    href: '/',
  },
  {
    title: 'Projects',
    icon: <FolderOpen size={16} />,
    href: '/projects',
    requiresAuth: true,
  },
  {
    title: 'Editor',
    icon: <Edit3 size={16} />,
    href: '/editor',
    requiresAuth: true,
  },
  {
    title: 'AI Generator',
    icon: <Sparkles size={16} />,
    href: '/ai-generator',
    badge: 'AI',
    requiresAuth: true,
  },
  {
    title: 'Version Control',
    icon: <GitCommit size={16} />,
    href: '/version-control',
    badge: 'VCS',
    requiresAuth: true,
  },
  {
    title: 'Git Manager',
    icon: <GitBranch size={16} />,
    href: '/git',
    requiresAuth: true,
  },
  {
    title: 'Database Git',
    icon: <Database size={16} />,
    href: '/database-git',
    requiresAuth: true,
  },
  {
    title: 'Releases',
    icon: <Tag size={16} />,
    href: '/releases',
    requiresAuth: true,
  },
  {
    title: 'Issues',
    icon: <AlertCircle size={16} />,
    href: '/issues',
    requiresAuth: true,
  },
  {
    title: 'About',
    icon: <User size={16} />,
    href: '/about',
  },
];

function NavItemComponent({ item, level = 0, isCollapsed }: { item: NavItem; level?: number; isCollapsed?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // Check if this item is active based on current URL
  useEffect(() => {
    const checkActive = () => {
      if (typeof window === 'undefined') return;
      
      const pathname = window.location.pathname;
      
      // Exact match for index page
      if (item.href === '/') {
        setIsActive(pathname === '/' || pathname === '');
      } else {
        // For other pages, check exact match only
        setIsActive(pathname === item.href);
      }
    };

    checkActive();
    
    // Listen for navigation events (including programmatic navigation)
    const handleLocationChange = () => {
      setTimeout(checkActive, 100); // Small delay to ensure URL has updated
    };

    // Listen for both popstate and custom navigation events
    window.addEventListener('popstate', handleLocationChange);
    
    // Also listen for clicks on the document to catch navigation
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        setTimeout(checkActive, 100);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    // Check on mount and when pathname might change
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== pathname) {
        checkActive();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, [item.href]);

  // Also check when the component mounts or updates
  useEffect(() => {
    const checkActive = () => {
      if (typeof window === 'undefined') return;
      
      const pathname = window.location.pathname;
      
      if (item.href === '/') {
        setIsActive(pathname === '/' || pathname === '');
      } else {
        setIsActive(pathname === item.href);
      }
    };

    checkActive();
  });

  return (
    <div>
      <a
        href={item.href}
        className={clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          isActive 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500' 
            : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400',
          level > 0 && 'ml-4 text-xs',
          isCollapsed && 'justify-center px-2',
          item.requiresAuth && !isActive && 'border-l-2 border-transparent hover:border-blue-500'
        )}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        title={isCollapsed ? item.title : undefined}
      >
        <span className={clsx('flex items-center gap-3 flex-1', isCollapsed && 'justify-center')}>
          <span className={clsx(
            'text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
            isActive && 'text-blue-500 dark:text-blue-400'
          )}>
            {item.icon}
          </span>
          {!isCollapsed && (
            <>
              <span className="truncate">{item.title}</span>
              {item.badge && (
                <span className={clsx(
                  'px-2 py-0.5 text-white text-xs rounded-full font-medium ml-auto',
                  item.badge === 'AI' && 'bg-gradient-to-r from-purple-500 to-pink-500',
                  item.badge === 'VCS' && 'bg-gradient-to-r from-blue-500 to-cyan-500'
                )}>
                  {item.badge}
                </span>
              )}
              {item.requiresAuth && !isActive && (
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60" title="Requires authentication" />
              )}
            </>
          )}
        </span>
        {hasChildren && !isCollapsed && (
          <span className="transition-transform duration-200 text-slate-400">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </a>
      
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="ml-2 mt-1 space-y-1">
          {item.children!.map((child, index) => (
            <NavItemComponent key={index} item={child} level={level + 1} isCollapsed={isCollapsed} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen = false, onClose, isCollapsed = false }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] transform bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out',
          'lg:relative lg:top-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-3 py-6">
            <nav className="space-y-1">
              {navigationItems.map((item, index) => (
                <NavItemComponent key={index} item={item} isCollapsed={isCollapsed} />
              ))}
            </nav>
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between mb-2">
                  <span>Version:</span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                    v2.1.0
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 dark:text-slate-500">KaneDocs</span>
                </div>
                <div className="mt-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Auth Required</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}