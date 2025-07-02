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
  ChevronDown,
  Server,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownRight,
  Loader,
  Clipboard,
  ClipboardCheck,
  RotateCcw,
  Shield,
  Zap,
  HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { notificationManager } from './SimpleNotification';

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

interface RemoteRepository {
  name: string;
  url: string;
  isDefault: boolean;
}

export default function GitManager() {
  // State for repository data
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

  // State for UI controls
  const [commitMessage, setCommitMessage] = useState('');
  const [commitDescription, setCommitDescription] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [activeTab, setActiveTab] = useState<'changes' | 'history' | 'branches'>('changes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'staged' | 'unstaged'>('all');
  const [showCommitOptions, setShowCommitOptions] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  
  // State for Git operations
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [remotes, setRemotes] = useState<RemoteRepository[]>([
    { name: 'origin', url: 'https://github.com/yourusername/kodex.git', isDefault: true }
  ]);
  const [showRemoteForm, setShowRemoteForm] = useState(false);
  const [newRemoteName, setNewRemoteName] = useState('');
  const [newRemoteUrl, setNewRemoteUrl] = useState('');
  const [copiedCommitId, setCopiedCommitId] = useState<string | null>(null);

  // Derived state
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

  // File operations
  const toggleFileStaging = (path: string) => {
    setFileChanges(prev => 
      prev.map(file => 
        file.path === path ? { ...file, staged: !file.staged } : file
      )
    );
  };

  const stageAllFiles = () => {
    setFileChanges(prev => prev.map(file => ({ ...file, staged: true })));
    notificationManager.success(
      'Files Staged',
      'All files have been staged for commit',
      3000
    );
  };

  const unstageAllFiles = () => {
    setFileChanges(prev => prev.map(file => ({ ...file, staged: false })));
    notificationManager.info(
      'Files Unstaged',
      'All files have been unstaged',
      3000
    );
  };

  // Commit operations
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
    
    notificationManager.success(
      'Commit Created',
      `Successfully committed ${stagedFiles.length} files to ${currentBranch}`,
      3000
    );
  };

  // Branch operations
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
    
    notificationManager.success(
      'Branch Created',
      `Successfully created branch '${newBranchName}'`,
      3000
    );
  };

  const switchBranch = (branchName: string) => {
    setBranches(prev => 
      prev.map(branch => ({
        ...branch,
        current: branch.name === branchName
      }))
    );
    setCurrentBranch(branchName);
    setShowBranchMenu(false);
    
    notificationManager.info(
      'Branch Switched',
      `Switched to branch '${branchName}'`,
      3000
    );
  };

  const deleteBranch = (branchName: string) => {
    if (branchName === 'main') {
      notificationManager.error(
        'Cannot Delete Main Branch',
        'The main branch cannot be deleted',
        3000
      );
      return;
    }
    
    if (branchName === currentBranch) {
      notificationManager.error(
        'Cannot Delete Current Branch',
        'You cannot delete the branch you are currently on',
        3000
      );
      return;
    }
    
    setBranches(prev => prev.filter(branch => branch.name !== branchName));
    
    notificationManager.success(
      'Branch Deleted',
      `Successfully deleted branch '${branchName}'`,
      3000
    );
  };

  // Remote operations
  const addRemote = () => {
    if (!newRemoteName.trim() || !newRemoteUrl.trim()) return;
    
    setRemotes(prev => [...prev, {
      name: newRemoteName,
      url: newRemoteUrl,
      isDefault: false
    }]);
    
    setNewRemoteName('');
    setNewRemoteUrl('');
    setShowRemoteForm(false);
    
    notificationManager.success(
      'Remote Added',
      `Added remote '${newRemoteName}' pointing to ${newRemoteUrl}`,
      3000
    );
  };

  const removeRemote = (name: string) => {
    setRemotes(prev => prev.filter(remote => remote.name !== name));
    
    notificationManager.info(
      'Remote Removed',
      `Removed remote '${name}'`,
      3000
    );
  };

  const setDefaultRemote = (name: string) => {
    setRemotes(prev => prev.map(remote => ({
      ...remote,
      isDefault: remote.name === name
    })));
    
    notificationManager.success(
      'Default Remote Updated',
      `Set '${name}' as the default remote`,
      3000
    );
  };

  // Git operations
  const handlePull = () => {
    setIsPulling(true);
    
    // Simulate network delay
    setTimeout(() => {
      // Simulate getting new commits
      const newCommit: Commit = {
        id: Math.random().toString(36).substr(2, 7),
        message: 'feat: add new feature from remote',
        author: 'Remote Contributor',
        date: 'just now',
        files: 2,
        additions: 120,
        deletions: 5
      };
      
      setCommits(prev => [newCommit, ...prev]);
      
      // Update branch status
      setBranches(prev => 
        prev.map(branch => 
          branch.name === currentBranch 
            ? { ...branch, behind: 0 } 
            : branch
        )
      );
      
      setIsPulling(false);
      
      notificationManager.success(
        'Pull Successful',
        'Successfully pulled latest changes from remote',
        3000
      );
    }, 2000);
  };

  const handlePush = () => {
    setIsPushing(true);
    
    // Simulate network delay
    setTimeout(() => {
      // Update branch status
      setBranches(prev => 
        prev.map(branch => 
          branch.name === currentBranch 
            ? { ...branch, ahead: 0 } 
            : branch
        )
      );
      
      setIsPushing(false);
      
      notificationManager.success(
        'Push Successful',
        'Successfully pushed local commits to remote',
        3000
      );
    }, 2000);
  };

  const handleSync = () => {
    setIsSyncing(true);
    
    // Simulate network delay
    setTimeout(() => {
      // First pull
      const newCommit: Commit = {
        id: Math.random().toString(36).substr(2, 7),
        message: 'fix: resolve issue from remote',
        author: 'Remote Contributor',
        date: 'just now',
        files: 1,
        additions: 5,
        deletions: 2
      };
      
      setCommits(prev => [newCommit, ...prev]);
      
      // Then push
      setBranches(prev => 
        prev.map(branch => 
          branch.name === currentBranch 
            ? { ...branch, ahead: 0, behind: 0 } 
            : branch
        )
      );
      
      setIsSyncing(false);
      
      notificationManager.success(
        'Sync Successful',
        'Successfully synchronized with remote repository',
        3000
      );
    }, 3000);
  };

  // Terminal operations
  const executeTerminalCommand = () => {
    if (!terminalInput.trim()) return;
    
    setTerminalOutput(prev => [...prev, `$ ${terminalInput}`]);
    
    // Simulate command execution
    let output: string[] = [];
    
    if (terminalInput.startsWith('git status')) {
      output = [
        'On branch ' + currentBranch,
        'Your branch is up to date with \'origin/' + currentBranch + '\'.',
        '',
        'Changes to be committed:',
        '  (use "git restore --staged <file>..." to unstage)',
        ...stagedFiles.map(file => `\t${file.status === 'added' ? 'new file:' : file.status === 'deleted' ? 'deleted:' : 'modified:'} ${file.path}`),
        '',
        'Changes not staged for commit:',
        '  (use "git add <file>..." to update what will be committed)',
        '  (use "git restore <file>..." to discard changes in working directory)',
        ...unstagedFiles.map(file => `\t${file.status === 'added' ? 'new file:' : file.status === 'deleted' ? 'deleted:' : 'modified:'} ${file.path}`)
      ];
    } else if (terminalInput.startsWith('git branch')) {
      output = branches.map(branch => `${branch.current ? '* ' : '  '}${branch.name}`);
    } else if (terminalInput.startsWith('git log')) {
      output = commits.flatMap(commit => [
        `commit ${commit.id}`,
        `Author: ${commit.author}`,
        `Date: ${commit.date}`,
        '',
        `    ${commit.message}`,
        ''
      ]);
    } else if (terminalInput.startsWith('git remote -v')) {
      output = remotes.flatMap(remote => [
        `${remote.name}\t${remote.url} (fetch)`,
        `${remote.name}\t${remote.url} (push)`
      ]);
    } else if (terminalInput.startsWith('git add')) {
      const filePath = terminalInput.replace('git add', '').trim();
      if (filePath === '.') {
        setFileChanges(prev => prev.map(file => ({ ...file, staged: true })));
        output = ['Added all files to staging area'];
      } else {
        const fileExists = fileChanges.some(file => file.path === filePath);
        if (fileExists) {
          setFileChanges(prev => prev.map(file => 
            file.path === filePath ? { ...file, staged: true } : file
          ));
          output = [`Added ${filePath} to staging area`];
        } else {
          output = [`fatal: pathspec '${filePath}' did not match any files`];
        }
      }
    } else if (terminalInput.startsWith('git commit')) {
      if (stagedFiles.length === 0) {
        output = ['nothing to commit, working tree clean'];
      } else {
        const msgMatch = terminalInput.match(/-m "([^"]+)"/);
        const message = msgMatch ? msgMatch[1] : 'Commit via terminal';
        
        const newCommit: Commit = {
          id: Math.random().toString(36).substr(2, 7),
          message,
          author: 'You',
          date: 'just now',
          files: stagedFiles.length,
          additions: stagedFiles.reduce((sum, file) => sum + file.additions, 0),
          deletions: stagedFiles.reduce((sum, file) => sum + file.deletions, 0)
        };
        
        setCommits(prev => [newCommit, ...prev]);
        setFileChanges(prev => prev.filter(file => !file.staged));
        
        output = [
          `[${currentBranch} ${newCommit.id}] ${message}`,
          ` ${stagedFiles.length} files changed, ${newCommit.additions} insertions(+), ${newCommit.deletions} deletions(-)`,
        ];
      }
    } else if (terminalInput.startsWith('git checkout')) {
      const branchName = terminalInput.replace('git checkout', '').trim();
      const branchExists = branches.some(branch => branch.name === branchName);
      
      if (branchExists) {
        setBranches(prev => 
          prev.map(branch => ({
            ...branch,
            current: branch.name === branchName
          }))
        );
        setCurrentBranch(branchName);
        output = [`Switched to branch '${branchName}'`];
      } else if (branchName.startsWith('-b ')) {
        const newBranchName = branchName.replace('-b ', '').trim();
        const newBranch: Branch = {
          name: newBranchName,
          current: true,
          lastCommit: 'just now',
          ahead: 0,
          behind: 0
        };
        
        setBranches(prev => prev.map(branch => ({
          ...branch,
          current: false
        })));
        setBranches(prev => [...prev, newBranch]);
        setCurrentBranch(newBranchName);
        
        output = [`Switched to a new branch '${newBranchName}'`];
      } else {
        output = [`error: pathspec '${branchName}' did not match any file(s) known to git`];
      }
    } else if (terminalInput.startsWith('git pull')) {
      output = ['Simulating pull operation...'];
      handlePull();
    } else if (terminalInput.startsWith('git push')) {
      output = ['Simulating push operation...'];
      handlePush();
    } else if (terminalInput.startsWith('clear') || terminalInput.startsWith('cls')) {
      setTerminalOutput([]);
      setTerminalInput('');
      return;
    } else if (terminalInput.startsWith('help')) {
      output = [
        'Available Git commands:',
        '  git status - Show working tree status',
        '  git branch - List branches',
        '  git checkout <branch> - Switch branches',
        '  git checkout -b <branch> - Create and switch to a new branch',
        '  git add <file> - Add file to staging area',
        '  git add . - Add all files to staging area',
        '  git commit -m "message" - Commit staged changes',
        '  git log - Show commit history',
        '  git remote -v - List remotes',
        '  git pull - Pull changes from remote',
        '  git push - Push changes to remote',
        '',
        'Other commands:',
        '  clear - Clear terminal',
        '  help - Show this help message'
      ];
    } else {
      output = [`Command not found: ${terminalInput}`];
    }
    
    setTerminalOutput(prev => [...prev, ...output]);
    setTerminalInput('');
  };

  // UI helpers
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

  const copyCommitId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedCommitId(id);
    setTimeout(() => setCopiedCommitId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg">
                <GitBranch className="text-white" size={24} />
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
              {/* Branch Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowBranchMenu(!showBranchMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <GitBranch size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{currentBranch}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                
                {showBranchMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Switch branch
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {branches.map((branch) => (
                        <button
                          key={branch.name}
                          onClick={() => switchBranch(branch.name)}
                          className={clsx(
                            "w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                            branch.current ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          )}
                        >
                          <GitBranch size={14} className={branch.current ? "text-blue-600" : "text-gray-500"} />
                          <span className={clsx(
                            "flex-1 text-left truncate",
                            branch.current ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                          )}>
                            {branch.name}
                          </span>
                          {branch.current && (
                            <Check size={14} className="text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setShowBranchMenu(false);
                          setShowNewBranch(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      >
                        <Plus size={14} />
                        Create new branch
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Pull Button */}
                <button 
                  onClick={handlePull}
                  disabled={isPulling}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPulling ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Pulling...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Pull</span>
                    </>
                  )}
                </button>
                
                {/* Push Button */}
                <button
                  onClick={handlePush}
                  disabled={isPushing || branches.find(b => b.current)?.ahead === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPushing ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Pushing...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Push</span>
                    </>
                  )}
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowCommitOptions(!showCommitOptions)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {showCommitOptions && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
                      <button 
                        onClick={() => {
                          setShowCommitOptions(false);
                          handleSync();
                        }}
                        disabled={isSyncing}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSyncing ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} />
                            <span>Sync Changes</span>
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setShowCommitOptions(false);
                          setShowSettings(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Settings size={14} />
                        <span>Repository Settings</span>
                      </button>
                      <button 
                        onClick={() => {
                          setShowCommitOptions(false);
                          setShowTerminal(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Terminal size={14} />
                        <span>Open Terminal</span>
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
          <div className="h-full flex flex-col lg:flex-row">
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
                      disabled={unstagedFiles.length === 0}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Stage all
                    </button>
                    <button
                      onClick={unstageAllFiles}
                      disabled={stagedFiles.length === 0}
                      className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="w-full lg:w-96 flex flex-col bg-gray-50 dark:bg-gray-800">
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

        {/* History tab with enhanced styling */}
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
                    <button 
                      onClick={() => copyCommitId(commit.id)}
                      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" 
                      title="Copy commit ID"
                    >
                      {copiedCommitId === commit.id ? (
                        <ClipboardCheck size={16} className="text-green-500" />
                      ) : (
                        <Clipboard size={16} />
                      )}
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
                              <span className="flex items-center text-green-600">
                                <ArrowUpRight size={14} className="mr-1" />
                                {branch.ahead}
                              </span>
                            )}
                            {branch.behind > 0 && (
                              <span className="flex items-center text-red-600">
                                <ArrowDownRight size={14} className="mr-1" />
                                {branch.behind}
                              </span>
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
                    {!branch.current && branch.name !== 'main' && (
                      <button 
                        onClick={() => deleteBranch(branch.name)}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Repository Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings size={18} />
                Repository Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
              {/* Repository Info */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Repository Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      value="kodex"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Default Branch
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      {branches.map(branch => (
                        <option key={branch.name} value={branch.name}>{branch.name}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      The default branch will be used for new pull requests and merges
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="private" className="rounded text-blue-600" checked />
                      <label htmlFor="private" className="text-sm text-gray-700 dark:text-gray-300">
                        Private Repository
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="protected" className="rounded text-blue-600" checked />
                      <label htmlFor="protected" className="text-sm text-gray-700 dark:text-gray-300">
                        Protected Main Branch
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Remote Repositories */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white">Remote Repositories</h4>
                  <button
                    onClick={() => setShowRemoteForm(!showRemoteForm)}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    {showRemoteForm ? 'Cancel' : 'Add Remote'}
                  </button>
                </div>
                
                {showRemoteForm && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Remote Name
                        </label>
                        <input
                          type="text"
                          value={newRemoteName}
                          onChange={(e) => setNewRemoteName(e.target.value)}
                          placeholder="e.g., origin"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Remote URL
                        </label>
                        <input
                          type="text"
                          value={newRemoteUrl}
                          onChange={(e) => setNewRemoteUrl(e.target.value)}
                          placeholder="https://github.com/username/repo.git"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={addRemote}
                          disabled={!newRemoteName.trim() || !newRemoteUrl.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                        >
                          Add Remote
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {remotes.map((remote) => (
                    <div
                      key={remote.name}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Server size={16} className="text-gray-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {remote.name}
                            </span>
                            {remote.isDefault && (
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {remote.url}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!remote.isDefault && (
                          <button
                            onClick={() => setDefaultRemote(remote.name)}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Set as default
                          </button>
                        )}
                        <button
                          onClick={() => removeRemote(remote.name)}
                          className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                          title="Remove remote"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Branch Protection */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Branch Protection</h4>
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={18} className="text-blue-600" />
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Protect Main Branch</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Prevent force pushes and ensure code quality
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" id="toggle" className="sr-only" checked />
                        <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner"></div>
                        <div className="absolute w-5 h-5 bg-blue-600 rounded-full shadow -left-1 -top-0 transform translate-x-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 ml-7">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="require-reviews" className="rounded text-blue-600" checked />
                      <label htmlFor="require-reviews" className="text-sm text-gray-700 dark:text-gray-300">
                        Require pull request reviews before merging
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="require-status" className="rounded text-blue-600" checked />
                      <label htmlFor="require-status" className="text-sm text-gray-700 dark:text-gray-300">
                        Require status checks to pass before merging
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="require-linear" className="rounded text-blue-600" />
                      <label htmlFor="require-linear" className="text-sm text-gray-700 dark:text-gray-300">
                        Require linear history
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div>
                <h4 className="text-md font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-red-800 dark:text-red-300">Delete Repository</h5>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Once deleted, it cannot be recovered
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Modal */}
      {showTerminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
              <h3 className="text-md font-mono text-gray-200 flex items-center gap-2">
                <Terminal size={16} />
                Git Terminal
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTerminalOutput([])}
                  className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-700 transition-colors"
                  title="Clear terminal"
                >
                  <RotateCcw size={14} />
                </button>
                <button 
                  onClick={() => setShowTerminal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-4 font-mono text-sm text-gray-200 h-96 overflow-y-auto bg-gray-950">
              {/* Terminal Output */}
              {terminalOutput.length > 0 ? (
                <div className="space-y-1 mb-4">
                  {terminalOutput.map((line, index) => (
                    <div key={index} className={clsx(
                      "whitespace-pre-wrap break-all",
                      line.startsWith('$') ? "text-green-400" : "",
                      line.startsWith('error:') || line.startsWith('fatal:') ? "text-red-400" : ""
                    )}>
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 mb-4">
                  Welcome to Git Terminal. Type 'help' for available commands.
                </div>
              )}
              
              {/* Terminal Input */}
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeTerminalCommand();
                    }
                  }}
                  placeholder="Type git command..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-600"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="p-3 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 font-mono">Enter</span>
                  <span>Execute</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 font-mono">clear</span>
                  <span>Clear terminal</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 font-mono">help</span>
                  <span>Show commands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showCommitOptions || showBranchMenu) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowCommitOptions(false);
            setShowBranchMenu(false);
          }}
        />
      )}
    </div>
  );
}