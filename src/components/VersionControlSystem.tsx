import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Clock, 
  User, 
  Calendar,
  Eye,
  Copy,
  Tag,
  FileText,
  Code,
  Folder,
  Plus,
  Minus,
  Edit3,
  Download,
  ExternalLink,
  Activity,
  Users,
  Hash,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import MarkdownRenderer from './MarkdownRenderer';
import DiffViewer from './DiffViewer';
import CommitGraph from './CommitGraph';
import ContributorInsights from './ContributorInsights';
import FileExplorer from './FileExplorer';

interface Version {
  id: string;
  sha: string;
  message: string;
  description?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  timestamp: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  tags: string[];
  branch: string;
}

interface DocumentFile {
  id: string;
  path: string;
  name: string;
  content: string;
  type: 'markdown' | 'text' | 'code';
  language?: string;
  size: number;
  lastModified: string;
  versions: Version[];
}

interface Branch {
  name: string;
  isDefault: boolean;
  lastCommit: Version;
  ahead: number;
  behind: number;
  isProtected: boolean;
}

interface Contributor {
  name: string;
  email: string;
  avatar?: string;
  commits: number;
  additions: number;
  deletions: number;
  firstCommit: string;
  lastCommit: string;
}

interface ProjectStats {
  totalCommits: number;
  totalContributors: number;
  totalFiles: number;
  totalLines: number;
  activeBranches: number;
  lastUpdate: string;
  languages: { [key: string]: number };
}

export default function VersionControlSystem() {
  const [currentFile, setCurrentFile] = useState<DocumentFile | null>(null);
  const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
  const [currentBranch, setBranch] = useState('main');
  const [activeTab, setActiveTab] = useState<'files' | 'history' | 'insights' | 'branches'>('files');
  const [showDiff, setShowDiff] = useState(false);
  const [compareVersion, setCompareVersion] = useState<Version | null>(null);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize sample data
  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const sampleVersions: Version[] = [
      {
        id: '1',
        sha: 'a1b2c3d4e5f6',
        message: 'feat: add comprehensive API documentation',
        description: 'Added detailed API documentation with examples, authentication guide, and error handling.',
        author: {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        timestamp: '2024-01-15T10:30:00Z',
        filesChanged: 3,
        additions: 245,
        deletions: 12,
        tags: ['v2.1.0'],
        branch: 'main'
      },
      {
        id: '2',
        sha: 'b2c3d4e5f6g7',
        message: 'docs: update installation guide',
        author: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        timestamp: '2024-01-14T15:45:00Z',
        filesChanged: 1,
        additions: 34,
        deletions: 8,
        tags: [],
        branch: 'main'
      },
      {
        id: '3',
        sha: 'c3d4e5f6g7h8',
        message: 'fix: resolve broken links in documentation',
        author: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        },
        timestamp: '2024-01-13T09:20:00Z',
        filesChanged: 5,
        additions: 15,
        deletions: 23,
        tags: [],
        branch: 'main'
      }
    ];

    const sampleFiles: DocumentFile[] = [
      {
        id: '1',
        path: 'docs/README.md',
        name: 'README.md',
        content: `# KaneDocs - Advanced Documentation Platform

Welcome to KaneDocs, a powerful documentation platform with integrated version control features.

## Features

- 📜 **Version Control**: Complete Git-like versioning for documentation
- 🧠 **Smart Diffs**: Visual diff viewer with syntax highlighting
- ⚙️ **Commit System**: Track changes with detailed commit history
- 🌿 **Branch Management**: Multiple documentation branches
- 🔍 **Contributor Insights**: Detailed contributor analytics
- 📊 **Project Statistics**: Comprehensive project metrics

## Getting Started

1. **Create Documentation**: Write your docs in Markdown
2. **Commit Changes**: Save versions with meaningful commit messages
3. **Branch Management**: Create branches for different versions
4. **Collaborate**: Track contributors and their contributions

## API Documentation

Our comprehensive API documentation includes:

- Authentication methods
- Endpoint references
- Request/response examples
- Error handling guides
- Rate limiting information

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

This project is licensed under the MIT License.`,
        type: 'markdown',
        size: 1024,
        lastModified: '2024-01-15T10:30:00Z',
        versions: sampleVersions
      },
      {
        id: '2',
        path: 'docs/api/authentication.md',
        name: 'authentication.md',
        content: `# Authentication

KaneDocs uses JWT tokens for authentication.

## Getting Started

To authenticate with the API, you'll need to obtain a JWT token.

### Request Token

\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
\`\`\`

### Response

\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
\`\`\`

## Using the Token

Include the token in the Authorization header:

\`\`\`http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## Token Refresh

Tokens expire after 1 hour. Use the refresh endpoint to get a new token:

\`\`\`http
POST /api/auth/refresh
Authorization: Bearer your-current-token
\`\`\``,
        type: 'markdown',
        size: 756,
        lastModified: '2024-01-15T10:30:00Z',
        versions: sampleVersions.slice(0, 2)
      },
      {
        id: '3',
        path: 'docs/guides/installation.md',
        name: 'installation.md',
        content: `# Installation Guide

Follow these steps to install and set up KaneDocs.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git (for version control features)

## Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/kanedocs.git

# Navigate to the project directory
cd kanedocs

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

## Configuration

Create a \`.env\` file in the root directory:

\`\`\`env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=KaneDocs
VITE_ENABLE_ANALYTICS=true
\`\`\`

## Production Deployment

### Using Docker

\`\`\`bash
# Build the Docker image
docker build -t kanedocs .

# Run the container
docker run -p 3000:3000 kanedocs
\`\`\`

### Using Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: \`npm run build\`
3. Set publish directory: \`dist\`
4. Deploy!

## Troubleshooting

### Common Issues

**Port already in use**
- Change the port in your configuration
- Kill the process using the port

**Dependencies not installing**
- Clear npm cache: \`npm cache clean --force\`
- Delete \`node_modules\` and reinstall

**Build failures**
- Check Node.js version compatibility
- Ensure all environment variables are set`,
        type: 'markdown',
        size: 1200,
        lastModified: '2024-01-14T15:45:00Z',
        versions: sampleVersions.slice(1)
      }
    ];

    const sampleBranches: Branch[] = [
      {
        name: 'main',
        isDefault: true,
        lastCommit: sampleVersions[0],
        ahead: 0,
        behind: 0,
        isProtected: true
      },
      {
        name: 'v2.0-docs',
        isDefault: false,
        lastCommit: sampleVersions[1],
        ahead: 2,
        behind: 1,
        isProtected: false
      },
      {
        name: 'feature/api-v3',
        isDefault: false,
        lastCommit: sampleVersions[2],
        ahead: 5,
        behind: 3,
        isProtected: false
      }
    ];

    const sampleContributors: Contributor[] = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        commits: 45,
        additions: 2340,
        deletions: 567,
        firstCommit: '2023-12-01T10:00:00Z',
        lastCommit: '2024-01-15T10:30:00Z'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        commits: 32,
        additions: 1890,
        deletions: 234,
        firstCommit: '2023-12-15T14:20:00Z',
        lastCommit: '2024-01-14T15:45:00Z'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        commits: 18,
        additions: 756,
        deletions: 123,
        firstCommit: '2024-01-05T09:15:00Z',
        lastCommit: '2024-01-13T09:20:00Z'
      }
    ];

    const sampleStats: ProjectStats = {
      totalCommits: 95,
      totalContributors: 3,
      totalFiles: 24,
      totalLines: 4567,
      activeBranches: 3,
      lastUpdate: '2024-01-15T10:30:00Z',
      languages: {
        'Markdown': 85,
        'TypeScript': 10,
        'JSON': 3,
        'YAML': 2
      }
    };

    setFiles(sampleFiles);
    setBranches(sampleBranches);
    setContributors(sampleContributors);
    setProjectStats(sampleStats);
    setCurrentFile(sampleFiles[0]);
    setCurrentVersion(sampleFiles[0].versions[0]);
    setLoading(false);
  };

  const handleFileSelect = (file: DocumentFile) => {
    setCurrentFile(file);
    setCurrentVersion(file.versions[0]);
    setShowDiff(false);
  };

  const handleVersionSelect = (version: Version) => {
    setCurrentVersion(version);
    setShowDiff(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Clean Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <GitBranch className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  Version Control
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track changes and manage documentation versions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Branch Selector */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <GitBranch size={14} className="text-gray-500" />
                <select
                  value={currentBranch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                >
                  {branches.map((branch) => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">
                <Edit3 size={14} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </div>
          </div>

          {/* Clean Tab Navigation */}
          <div className="flex mt-4 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'files', label: 'Files', icon: <Folder size={16} /> },
              { id: 'history', label: 'History', icon: <Clock size={16} /> },
              { id: 'insights', label: 'Insights', icon: <Activity size={16} /> },
              { id: 'branches', label: 'Branches', icon: <GitBranch size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
          {activeTab === 'files' && (
            <FileExplorer
              files={files}
              currentFile={currentFile}
              onFileSelect={handleFileSelect}
            />
          )}

          {activeTab === 'history' && currentFile && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                History ({currentFile.versions.length})
              </h3>
              <div className="space-y-3">
                {currentFile.versions.map((version) => (
                  <div
                    key={version.id}
                    className={clsx(
                      'p-3 rounded-lg border cursor-pointer transition-all',
                      currentVersion?.id === version.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    )}
                    onClick={() => handleVersionSelect(version)}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={version.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(version.author.name)}&size=32`}
                        alt={version.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {version.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{version.author.name}</span>
                          <span>•</span>
                          <span>{formatDate(version.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="font-mono">{version.sha.substring(0, 7)}</span>
                          <span className="text-green-600">+{version.additions}</span>
                          <span className="text-red-600">-{version.deletions}</span>
                        </div>
                        {version.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {version.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <ContributorInsights contributors={contributors} stats={projectStats} />
          )}

          {activeTab === 'branches' && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Branches ({branches.length})
              </h3>
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div
                    key={branch.name}
                    className={clsx(
                      'p-3 rounded-lg border',
                      currentBranch === branch.name
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GitBranch size={16} className={currentBranch === branch.name ? 'text-green-600' : 'text-gray-500'} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {branch.name}
                        </span>
                        {branch.isDefault && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Updated {formatDate(branch.lastCommit.timestamp)}</p>
                      {(branch.ahead > 0 || branch.behind > 0) && (
                        <div className="flex items-center gap-2 mt-1">
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentFile && currentVersion && (
            <>
              {/* File Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-primary-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {currentFile.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentFile.path}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {currentVersion.message}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentVersion.author.name} • {formatDate(currentVersion.timestamp)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDiff(!showDiff)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                        {showDiff ? 'View' : 'Diff'}
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(currentVersion.sha)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                      >
                        <Copy size={14} />
                        <span className="hidden sm:inline">Copy SHA</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {showDiff ? (
                  <DiffViewer
                    oldContent="Previous version content..."
                    newContent={currentFile.content}
                    fileName={currentFile.name}
                  />
                ) : (
                  <div className="p-4 lg:p-6">
                    <MarkdownRenderer content={currentFile.content} />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'insights' && (
            <div className="flex-1 p-4 lg:p-6">
              <CommitGraph commits={files.flatMap(f => f.versions)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}