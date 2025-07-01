import React, { useState, useEffect } from 'react';
import { Search, Filter, GitBranch, GitCommit, GitMerge, Plus, Trash2, Download, Upload } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
  branches: string[];
  commits: number;
}

interface Commit {
  id: string;
  message: string;
  author: string;
  date: Date;
  hash: string;
}

export default function LocalDatabaseGitManager() {
  const [activeTab, setActiveTab] = useState<'repositories' | 'commits' | 'branches'>('repositories');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockRepos: Repository[] = [
      {
        id: '1',
        name: 'project-alpha',
        description: 'Main project repository with core functionality',
        lastModified: new Date('2024-01-15'),
        branches: ['main', 'develop', 'feature/auth'],
        commits: 42
      },
      {
        id: '2',
        name: 'docs-site',
        description: 'Documentation and user guides',
        lastModified: new Date('2024-01-10'),
        branches: ['main', 'content-update'],
        commits: 18
      },
      {
        id: '3',
        name: 'api-service',
        description: 'Backend API service and database schemas',
        lastModified: new Date('2024-01-08'),
        branches: ['main', 'v2-migration'],
        commits: 67
      }
    ];

    const mockCommits: Commit[] = [
      {
        id: '1',
        message: 'Add user authentication system',
        author: 'John Doe',
        date: new Date('2024-01-15T10:30:00'),
        hash: 'a1b2c3d'
      },
      {
        id: '2',
        message: 'Fix database connection issues',
        author: 'Jane Smith',
        date: new Date('2024-01-14T15:45:00'),
        hash: 'e4f5g6h'
      },
      {
        id: '3',
        message: 'Update documentation',
        author: 'Bob Johnson',
        date: new Date('2024-01-13T09:15:00'),
        hash: 'i7j8k9l'
      }
    ];

    setRepositories(mockRepos);
    setCommits(mockCommits);
  }, []);

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRepository = () => {
    const name = prompt('Enter repository name:');
    if (name) {
      const newRepo: Repository = {
        id: Date.now().toString(),
        name,
        description: 'New repository',
        lastModified: new Date(),
        branches: ['main'],
        commits: 0
      };
      setRepositories([...repositories, newRepo]);
    }
  };

  const handleDeleteRepository = (id: string) => {
    if (confirm('Are you sure you want to delete this repository?')) {
      setRepositories(repositories.filter(repo => repo.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Local Database Git Manager</h1>
          <p className="text-slate-600">Manage your local repositories and version control</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            {[
              { key: 'repositories', label: 'Repositories', icon: GitBranch },
              { key: 'commits', label: 'Commits', icon: GitCommit },
              { key: 'branches', label: 'Branches', icon: GitMerge }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === key
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'repositories' && (
              <div>
                {/* Search and Actions */}
                <div className="flex justify-between items-center mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateRepository}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={18} />
                      New Repository
                    </button>
                  </div>
                </div>

                {/* Repository Grid */}
                {filteredRepositories.length === 0 ? (
                  <div className="text-center py-12">
                    <GitBranch className="mx-auto text-slate-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      {searchQuery ? 'No repositories found' : 'No repositories yet'}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {searchQuery ? 'Try adjusting your search terms' : 'Create your first repository to get started'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={handleCreateRepository}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={18} />
                        Create Repository
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRepositories.map((repo) => (
                      <div
                        key={repo.id}
                        className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedRepo(repo.id)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <GitBranch className="text-slate-400" size={20} />
                            <h3 className="font-semibold text-slate-900">{repo.name}</h3>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRepository(repo.id);
                            }}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-slate-600 text-sm mb-4">{repo.description}</p>
                        <div className="flex justify-between items-center text-sm text-slate-500">
                          <span>{repo.commits} commits</span>
                          <span>{repo.branches.length} branches</span>
                        </div>
                        <div className="mt-3 text-xs text-slate-400">
                          Last modified: {repo.lastModified.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'commits' && (
              <div>
                <div className="space-y-4">
                  {commits.map((commit) => (
                    <div key={commit.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{commit.message}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span>{commit.author}</span>
                          <span>{commit.date.toLocaleDateString()}</span>
                          <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded">
                            {commit.hash}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'branches' && (
              <div>
                <div className="space-y-3">
                  {repositories.flatMap(repo => 
                    repo.branches.map(branch => (
                      <div key={`${repo.id}-${branch}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <GitBranch className="text-slate-400" size={18} />
                          <div>
                            <span className="font-medium text-slate-900">{branch}</span>
                            <span className="text-slate-600 text-sm ml-2">({repo.name})</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            Switch
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}