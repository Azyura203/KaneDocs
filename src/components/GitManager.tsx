import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  Plus, 
  Minus, 
  FileText, 
  Folder, 
  Check, 
  X, 
  Clock, 
  User, 
  Calendar,
  Upload,
  Download,
  RefreshCw,
  Settings,
  Terminal,
  Eye,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  GitPullRequest,
  Filter,
  Search,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';

interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  staged: boolean;
}

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  files: number;
  additions: number;
  deletions: number;
}

interface Branch {
  name: string;
  current: boolean;
  lastCommit: string;
  ahead: number;
  behind: number;
}

export default function GitManager() {
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branches, setBranches] = useState<Branch[]>([
    { name: 'main', current: true, lastCommit: '2 hours ago', ahead: 0, behind: 0 },
    { name: 'feature/ai-generator', current: false, lastCommit: '1 day ago', ahead: 3, behind: 1 },
    { name: 'docs/update', current: false, lastCommit: '3 days ago', ahead: 1, behind: 5 }
  ]);
  
  const [fileChanges, setFileChanges] = useState<FileChange[]>([
    { path: 'src/components/AIMarkdownGenerator.tsx', status: 'modified', additions: 45, deletions: 12, staged: false },
    { path: 'src/pages/ai-generator.astro', status: 'modified', additions: 8, deletions: 3, staged: false },
    { path: 'docs/README.md', status: 'added', additions: 120, deletions: 0, staged: false },
    { path: 'src/components/GitManager.tsx', status: 'added', additions: 350, deletions: 0, staged: false },
    { path: 'package.json', status: 'modified', additions: 2, deletions: 0, staged: true }
  ]);

  const [commits, setCommits] = useState<Commit[]>([
    {
      id: 'a1b2c3d',
      message: 'feat: enhance AI markdown generator with better UI',
      author: 'John Doe',
      date: '2 hours ago',
      files: 3,
      additions: 45,
      deletions: 12
    },
    {
      id: 'e4f5g6h',
      message: 'fix: resolve sidebar toggle issues',
      author: 'John Doe',
      date: '1 day ago',
      files: 2,
      additions: 23,
      deletions: 8
    },
    {
      id: 'i7j8k9l',
      message: 'docs: update installation guide',
      author: 'Jane Smith',
      date: '2 days ago',
      files: 1,
      additions: 15,
      deletions: 5
    }
  ]);

  const [commitMessage, setCommitMessage] = useState('');
  const [commitDescription, setCommitDescription] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [activeTab, setActiveTab] = useState<'changes' | 'history' | 'branches'>('changes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'staged' | 'unstaged'>('all');
  const [showCommitOptions, setShowCommitOptions] = useState(false);

  const stagedFiles = fileChanges.filter(file => file.staged);
  const unstagedFiles = fileChanges.filter(file => !file.staged);

  // Filter files based on search and status
  const filteredFiles = fileChanges.filter(file => {
    const matchesSearch = file.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'staged' && file.staged) ||
      (filterStatus === 'unstaged' && !file.staged);
    return matchesSearch && matchesFilter;
  });

  const toggleFileStaging = (path: string) => {
    setFileChanges(prev => 
      prev.map(file => 
        file.path === path ? { ...file, staged: !file.staged } : file
      )
    );
  };

  const stageAllFiles = () => {
    setFileChanges(prev => prev.map(file => ({ ...file, staged: true })));
  };

  const unstageAllFiles = () => {
    setFileChanges(prev => prev.map(file => ({ ...file, staged: false })));
  };

  const handleCommit = () => {
    if (!commitMessage.trim() || stagedFiles.length === 0) return;

    const newCommit: Commit = {
      id: Math.random().toString(36).substr(2, 7),
      message: commitMessage,
      author: 'You',
      date: 'just now',
      files: stagedFiles.length,
      additions: stagedFiles.reduce((sum, file) => sum + file.additions, 0),
      deletions: stagedFiles.reduce((sum, file) => sum + file.deletions, 0)
    };

    setCommits(prev => [newCommit, ...prev]);
    setFileChanges(prev => prev.filter(file => !file.staged));
    setCommitMessage('');
    setCommitDescription('');
    setShowCommitOptions(false);
  };

  const createBranch = () => {
    if (!newBranchName.trim()) return;

    const newBranch: Branch = {
      name: newBranchName,
      current: false,
      lastCommit: 'just now',
      ahead: 0,
      behind: 0
    };

    setBranches(prev => [...prev, newBranch]);
    setNewBranchName('');
    setShowNewBranch(false);
  };

  const switchBranch = (branchName: string) => {
    setBranches(prev => 
      prev.map(branch => ({
        ...branch,
        current: branch.name === branchName
      }))
    );
    setCurrentBranch(branchName);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <Plus className="text-green-500" size={16} />;
      case 'modified':
        return <FileText className="text-yellow-500" size={16} />;
      case 'deleted':
        return <Minus className="text-red-500" size={16} />;
      default:
        return <FileText className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'modified':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'deleted':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg">
                <GitBranch className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Git Manager
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your repository like GitHub
                </p>
              </div>
            </div>
            
            {/* Enhanced Action Bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <GitBranch size={16} className="text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">{currentBranch}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  <Download size={16} />
                  Pull
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                  <Upload size={16} />
                  Push
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowCommitOptions(!showCommitOptions)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {showCommitOptions && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <RefreshCw size={14} />
                        Sync Changes
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings size={14} />
                        Repository Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Terminal size={14} />
                        Open Terminal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              {[
                { id: 'changes', label: 'Changes', icon: <FileText size={16} />, count: fileChanges.length },
                { id: 'history', label: 'History', icon: <Clock size={16} />, count: commits.length },
                { id: 'branches', label: 'Branches', icon: <GitBranch size={16} />, count: branches.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={clsx(
                      'px-2 py-0.5 text-xs rounded-full font-medium',
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            {activeTab === 'changes' && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Files</option>
                  <option value="staged">Staged</option>
                  <option value="unstaged">Unstaged</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'changes' && (
          <div className="h-full flex">
            {/* Enhanced File Changes */}
            <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Changes ({filteredFiles.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={stageAllFiles}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Stage all
                    </button>
                    <button
                      onClick={unstageAllFiles}
                      className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
                    >
                      Unstage all
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stagedFiles.length}</div>
                    <div className="text-gray-600 dark:text-gray-400">Staged</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{unstagedFiles.length}</div>
                    <div className="text-gray-600 dark:text-gray-400">Unstaged</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600 dark:text-gray-400">{fileChanges.length}</div>
                    <div className="text-gray-600 dark:text-gray-400">Total</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Staged Files */}
                {stagedFiles.length > 0 && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Staged Changes ({stagedFiles.length})
                    </h4>
                    <div className="space-y-2">
                      {stagedFiles.map((file) => (
                        <div
                          key={file.path}
                          className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg group hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          {getStatusIcon(file.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.path}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded-full ${getStatusColor(file.status)}`}>
                                {file.status}
                              </span>
                              <span className="text-green-600">+{file.additions}</span>
                              <span className="text-red-600">-{file.deletions}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleFileStaging(file.path)}
                              className="p-1 text-green-600 hover:text-green-700 transition-colors"
                              title="Unstage file"
                            >
                              <Minus size={16} />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="View diff">
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unstaged Files */}
                {unstagedFiles.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <AlertCircle size={16} className="text-yellow-500" />
                      Unstaged Changes ({unstagedFiles.length})
                    </h4>
                    <div className="space-y-2">
                      {unstagedFiles.map((file) => (
                        <div
                          key={file.path}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {getStatusIcon(file.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.path}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded-full ${getStatusColor(file.status)}`}>
                                {file.status}
                              </span>
                              <span className="text-green-600">+{file.additions}</span>
                              <span className="text-red-600">-{file.deletions}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleFileStaging(file.path)}
                              className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                              title="Stage file"
                            >
                              <Plus size={16} />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors" title="View diff">
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredFiles.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {searchQuery ? 'No matching files' : 'No changes'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {searchQuery ? 'Try adjusting your search or filter' : 'Your working directory is clean'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Commit Panel */}
            <div className="w-96 flex flex-col bg-gray-50 dark:bg-gray-800">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <GitCommit size={16} />
                  Commit Changes
                </h3>
              </div>

              <div className="flex-1 p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Commit message *
                  </label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="feat: add new feature"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use conventional commits: feat, fix, docs, style, refactor, test, chore
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={commitDescription}
                    onChange={(e) => setCommitDescription(e.target.value)}
                    placeholder="Add more details about this commit..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Commit summary:
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Files changed:</span>
                      <span className="font-medium">{stagedFiles.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Additions:</span>
                      <span className="text-green-600 font-medium">
                        +{stagedFiles.reduce((sum, file) => sum + file.additions, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Deletions:</span>
                      <span className="text-red-600 font-medium">
                        -{stagedFiles.reduce((sum, file) => sum + file.deletions, 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCommit}
                  disabled={!commitMessage.trim() || stagedFiles.length === 0}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                    commitMessage.trim() && stagedFiles.length > 0
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  )}
                >
                  <GitCommit size={16} />
                  Commit to {currentBranch}
                </button>

                {stagedFiles.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Stage some files to enable committing
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History and Branches tabs remain the same but with enhanced styling */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="space-y-4">
              {commits.map((commit) => (
                <div
                  key={commit.id}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <GitCommit size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {commit.message}
                      </h4>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded font-mono">
                        {commit.id}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{commit.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{commit.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{commit.files} files</span>
                        <span className="text-green-600">+{commit.additions}</span>
                        <span className="text-red-600">-{commit.deletions}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" title="View commit">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" title="Copy SHA">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Branches ({branches.length})
              </h3>
              <button
                onClick={() => setShowNewBranch(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <Plus size={16} />
                New Branch
              </button>
            </div>

            {showNewBranch && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Create new branch
                </h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="feature/new-feature"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={createBranch}
                    disabled={!newBranchName.trim()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewBranch(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {branches.map((branch) => (
                <div
                  key={branch.name}
                  className={clsx(
                    'flex items-center justify-between p-4 border rounded-lg transition-all',
                    branch.current
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <GitBranch 
                      size={16} 
                      className={branch.current ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'} 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {branch.name}
                        </span>
                        {branch.current && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                            current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Last commit {branch.lastCommit}</span>
                        {(branch.ahead > 0 || branch.behind > 0) && (
                          <div className="flex items-center gap-2">
                            {branch.ahead > 0 && (
                              <span className="text-green-600">↑{branch.ahead}</span>
                            )}
                            {branch.behind > 0 && (
                              <span className="text-red-600">↓{branch.behind}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!branch.current && (
                      <button
                        onClick={() => switchBranch(branch.name)}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        Switch
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {showCommitOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowCommitOptions(false)}
        />
      )}
    </div>
  );
}