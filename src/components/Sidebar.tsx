import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Book, User, Edit3, FolderOpen, Sparkles, GitBranch, Database, GitCommit } from 'lucide-react';
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
  },
  {
    title: 'Editor',
    icon: <Edit3 size={16} />,
    href: '/editor',
  },
  {
    title: 'AI Generator',
    icon: <Sparkles size={16} />,
    href: '/ai-generator',
    badge: 'AI',
  },
  {
    title: 'Version Control',
    icon: <GitCommit size={16} />,
    href: '/version-control',
    badge: 'VCS',
  },
  {
    title: 'Git Manager',
    icon: <GitBranch size={16} />,
    href: '/git',
  },
  {
    title: 'Database Git',
    icon: <Database size={16} />,
    href: '/database-git',
  },
  {
    title: 'About',
    icon: <User size={16} />,
    href: '/about',
  },
];

function NavItemComponent({ item, level = 0, isCollapsed }: { item: NavItem; level?: number; isCollapsed?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <a
        href={item.href}
        className={clsx(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400',
          level > 0 && 'ml-4 text-xs',
          isCollapsed && 'justify-center px-2'
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
          {item.icon}
          {!isCollapsed && (
            <>
              {item.title}
              {item.badge && (
                <span className={clsx(
                  'px-2 py-0.5 text-white text-xs rounded-full font-medium',
                  item.badge === 'AI' && 'bg-gradient-to-r from-primary-500 to-accent-500',
                  item.badge === 'VCS' && 'bg-gradient-to-r from-blue-500 to-cyan-500'
                )}>
                  {item.badge}
                </span>
              )}
            </>
          )}
        </span>
        {hasChildren && !isCollapsed && (
          <span className="transition-transform duration-200">
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
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
          'lg:relative lg:top-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-1">
              {navigationItems.map((item, index) => (
                <NavItemComponent key={index} item={item} isCollapsed={isCollapsed} />
              ))}
            </nav>
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between mb-2">
                  <span>Version:</span>
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                    v2.1.0
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}