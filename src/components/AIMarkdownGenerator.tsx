import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader, Copy, Check, Download, Wand2, FileText, Code, Book, Zap, X, ChevronRight, ChevronDown, Clipboard, ClipboardCheck, Clock } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { clsx } from 'clsx';

interface AIMarkdownGeneratorProps {
  onGenerated?: (markdown: string) => void;
}

interface PromptTemplate {
  title: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
  category: 'api' | 'guide' | 'readme' | 'tutorial';
}

const promptTemplates: PromptTemplate[] = [
  {
    title: 'API Documentation',
    icon: <Code size={16} />,
    description: 'Generate comprehensive API documentation',
    prompt: 'Create detailed API documentation for a REST API including endpoints, request/response examples, authentication, and error handling.',
    category: 'api'
  },
  {
    title: 'Getting Started Guide',
    icon: <Zap size={16} />,
    description: 'Create installation and setup instructions',
    prompt: 'Write a comprehensive getting started guide including installation, configuration, and first steps for a new software project.',
    category: 'guide'
  },
  {
    title: 'README Template',
    icon: <FileText size={16} />,
    description: 'Generate a professional README file',
    prompt: 'Create a professional README.md file with project description, features, installation, usage examples, and contribution guidelines.',
    category: 'readme'
  },
  {
    title: 'Tutorial Guide',
    icon: <Book size={16} />,
    description: 'Step-by-step tutorial documentation',
    prompt: 'Write a detailed step-by-step tutorial guide with code examples, explanations, and best practices for learning a new technology.',
    category: 'tutorial'
  },
  {
    title: 'API Reference',
    icon: <Code size={16} />,
    description: 'Detailed API method reference',
    prompt: 'Create a comprehensive API reference documentation with detailed method descriptions, parameters, return values, and examples.',
    category: 'api'
  },
  {
    title: 'User Guide',
    icon: <Book size={16} />,
    description: 'End-user focused documentation',
    prompt: 'Write a user guide that explains how to use the software from an end-user perspective, with screenshots, examples, and troubleshooting.',
    category: 'guide'
  },
  {
    title: 'Architecture Overview',
    icon: <FileText size={16} />,
    description: 'System architecture documentation',
    prompt: 'Create a technical architecture overview document explaining the system components, data flow, and design decisions.',
    category: 'readme'
  },
  {
    title: 'Code Walkthrough',
    icon: <Code size={16} />,
    description: 'Detailed code explanation',
    prompt: 'Write a detailed code walkthrough that explains the implementation details, patterns used, and reasoning behind key decisions.',
    category: 'tutorial'
  }
];

export default function AIMarkdownGenerator({ onGenerated }: AIMarkdownGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [showRecentPrompts, setShowRecentPrompts] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  // Load recent prompts from localStorage
  useEffect(() => {
    const savedPrompts = localStorage.getItem('kodex-recent-prompts');
    if (savedPrompts) {
      try {
        setRecentPrompts(JSON.parse(savedPrompts).slice(0, 5));
      } catch (e) {
        console.error('Failed to parse recent prompts:', e);
      }
    }
  }, []);

  // Save recent prompts to localStorage
  const saveRecentPrompt = (newPrompt: string) => {
    if (!newPrompt.trim()) return;
    
    const updatedPrompts = [
      newPrompt,
      ...recentPrompts.filter(p => p !== newPrompt)
    ].slice(0, 5);
    
    setRecentPrompts(updatedPrompts);
    localStorage.setItem('kodex-recent-prompts', JSON.stringify(updatedPrompts));
  };

  // Scroll to output when generated
  useEffect(() => {
    if (generatedMarkdown && outputContainerRef.current) {
      // Scroll to the output container with smooth behavior
      outputContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [generatedMarkdown]);

  const generateMarkdown = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    saveRecentPrompt(prompt);
    
    try {
      // Simulate AI generation with a realistic delay and progress
      const startTime = Date.now();
      const totalTime = Math.random() * 1000 + 1500; // 1.5-2.5 seconds
      
      // Update progress every 100ms
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalTime, 0.95); // Cap at 95% until complete
        setGenerationProgress(progress);
      }, 100);
      
      // Wait for the total time
      await new Promise(resolve => setTimeout(resolve, totalTime));
      
      // Generate comprehensive markdown based on the prompt
      const markdown = generateMockMarkdown(prompt);
      setGeneratedMarkdown(markdown);
      setGenerationProgress(1); // 100%
      
      if (onGenerated) {
        onGenerated(markdown);
      }
    } catch (error) {
      console.error('Error generating markdown:', error);
    } finally {
      setIsGenerating(false);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  const generateMockMarkdown = (userPrompt: string): string => {
    // This would be replaced with actual AI API call
    const templates = {
      api: `# API Documentation

## Overview

This API provides comprehensive endpoints for managing your application data with RESTful principles and modern authentication.

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

All API requests require authentication using Bearer tokens:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/v1/users
\`\`\`

## Endpoints

### Users

#### Get All Users

\`\`\`http
GET /users
\`\`\`

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 10
  }
}
\`\`\`

#### Create User

\`\`\`http
POST /users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secure_password"
}
\`\`\`

**Response:**

\`\`\`json
{
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2024-01-15T11:00:00Z"
  }
}
\`\`\`

## Error Handling

The API uses conventional HTTP response codes:

- \`200\` - Success
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`404\` - Not Found
- \`500\` - Internal Server Error

**Error Response Format:**

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field is required.",
    "details": {
      "field": "email",
      "rule": "required"
    }
  }
}
\`\`\`

## Rate Limiting

API requests are limited to 1000 requests per hour per API key.

## SDKs

- [JavaScript SDK](https://github.com/example/js-sdk)
- [Python SDK](https://github.com/example/python-sdk)
- [PHP SDK](https://github.com/example/php-sdk)`,

      readme: `# Project Name

> A modern, powerful solution for [brief description of what your project does]

[![Build Status](https://img.shields.io/github/workflow/status/username/repo/CI)](https://github.com/username/repo/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/package-name.svg)](https://www.npmjs.com/package/package-name)

## ✨ Features

- 🚀 **Fast & Lightweight** - Optimized for performance
- 🎨 **Modern UI** - Beautiful, responsive design
- 🔧 **Easy Setup** - Get started in minutes
- 📱 **Mobile Ready** - Works perfectly on all devices
- 🌙 **Dark Mode** - Built-in theme switching
- 🔒 **Secure** - Industry-standard security practices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project-name.git

# Navigate to project directory
cd project-name

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Usage

\`\`\`javascript
import { ProjectName } from 'project-name';

const app = new ProjectName({
  apiKey: 'your-api-key',
  environment: 'development'
});

// Initialize the application
await app.initialize();

// Use the features
const result = await app.doSomething();
console.log(result);
\`\`\`

## 📖 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [API Reference](docs/api-reference.md)
- [Examples](docs/examples.md)
- [FAQ](docs/faq.md)

## 🛠️ Development

\`\`\`bash
# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by [similar projects]
- Built with [technologies used]

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/username/repo/issues)`,

      tutorial: `# Complete Tutorial Guide

## Introduction

Welcome to this comprehensive tutorial! By the end of this guide, you'll have a solid understanding of the concepts and practical skills to implement them in your own projects.

## What You'll Learn

- Core concepts and fundamentals
- Practical implementation techniques
- Best practices and common patterns
- Real-world examples and use cases
- Troubleshooting and debugging tips

## Prerequisites

Before starting this tutorial, make sure you have:

- Basic programming knowledge
- Development environment set up
- Required tools installed

## Step 1: Setting Up Your Environment

First, let's prepare your development environment:

\`\`\`bash
# Create a new project directory
mkdir tutorial-project
cd tutorial-project

# Initialize the project
npm init -y

# Install required dependencies
npm install express cors dotenv
npm install -D nodemon typescript @types/node
\`\`\`

## Step 2: Creating Your First Component

Let's create a basic component to understand the fundamentals:

\`\`\`javascript
// src/components/HelloWorld.js
class HelloWorld {
  constructor(message = 'Hello, World!') {
    this.message = message;
  }

  render() {
    return \`<div class="hello-world">\${this.message}</div>\`;
  }

  setMessage(newMessage) {
    this.message = newMessage;
    return this;
  }
}

export default HelloWorld;
\`\`\`

## Step 3: Adding Functionality

Now let's add more advanced features:

\`\`\`javascript
// src/app.js
import HelloWorld from './components/HelloWorld.js';

const app = {
  components: [],
  
  init() {
    this.setupEventListeners();
    this.renderComponents();
  },
  
  addComponent(component) {
    this.components.push(component);
    return this;
  },
  
  renderComponents() {
    const container = document.getElementById('app');
    this.components.forEach(component => {
      container.innerHTML += component.render();
    });
  },
  
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
};

// Usage
const hello = new HelloWorld('Welcome to the Tutorial!');
app.addComponent(hello);
\`\`\`

## Step 4: Best Practices

### Code Organization

- Keep components small and focused
- Use meaningful names for variables and functions
- Separate concerns (logic, presentation, data)

### Error Handling

\`\`\`javascript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}
\`\`\`

### Testing

\`\`\`javascript
// tests/HelloWorld.test.js
import HelloWorld from '../src/components/HelloWorld.js';

describe('HelloWorld Component', () => {
  test('should render with default message', () => {
    const component = new HelloWorld();
    expect(component.render()).toContain('Hello, World!');
  });

  test('should update message', () => {
    const component = new HelloWorld();
    component.setMessage('Custom Message');
    expect(component.render()).toContain('Custom Message');
  });
});
\`\`\`

## Common Issues and Solutions

### Issue 1: Module Not Found

**Problem:** Getting "Module not found" errors

**Solution:** Check your import paths and ensure files exist:

\`\`\`javascript
// Correct
import Component from './components/Component.js';

// Incorrect
import Component from './components/Component'; // Missing .js extension
\`\`\`

### Issue 2: Async/Await Errors

**Problem:** Promises not resolving correctly

**Solution:** Always handle async operations properly:

\`\`\`javascript
// Good
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
}
\`\`\`

## Next Steps

Congratulations! You've completed the tutorial. Here's what you can do next:

1. **Practice:** Build a small project using what you've learned
2. **Explore:** Check out advanced topics in the documentation
3. **Contribute:** Join the community and help others learn
4. **Share:** Write about your experience and help others

## Additional Resources

- [Official Documentation](https://docs.example.com)
- [Community Forum](https://forum.example.com)
- [Video Tutorials](https://youtube.com/example)
- [GitHub Examples](https://github.com/example/tutorials)

Happy coding! 🚀`,

      getting_started: `# Getting Started Guide

Welcome! This guide will help you get up and running quickly with our platform.

## Overview

Our platform provides a comprehensive solution for [describe main purpose]. Whether you're a beginner or an experienced developer, this guide will walk you through everything you need to know.

## System Requirements

Before you begin, ensure your system meets these requirements:

- **Operating System:** Windows 10+, macOS 10.15+, or Linux
- **Memory:** 4GB RAM minimum (8GB recommended)
- **Storage:** 2GB free space
- **Network:** Internet connection for downloads and updates

## Installation

### Option 1: Quick Install (Recommended)

\`\`\`bash
# Using npm
npm install -g our-platform

# Using yarn
yarn global add our-platform

# Verify installation
our-platform --version
\`\`\`

### Option 2: Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/example/releases)
2. Extract the archive to your preferred directory
3. Add the binary to your PATH

\`\`\`bash
# Linux/macOS
export PATH=$PATH:/path/to/our-platform/bin

# Windows (PowerShell)
$env:PATH += ";C:\\path\\to\\our-platform\\bin"
\`\`\`

## Initial Configuration

### 1. Create Your First Project

\`\`\`bash
# Create a new project
our-platform create my-first-project

# Navigate to project directory
cd my-first-project

# Initialize the project
our-platform init
\`\`\`

### 2. Configure Settings

Create a configuration file:

\`\`\`yaml
# config.yml
project:
  name: "My First Project"
  version: "1.0.0"
  
settings:
  environment: "development"
  debug: true
  
features:
  - authentication
  - database
  - api
\`\`\`

### 3. Set Up Environment Variables

\`\`\`bash
# .env file
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=your-api-key-here
SECRET_KEY=your-secret-key-here
DEBUG=true
\`\`\`

## Your First Application

Let's create a simple "Hello World" application:

\`\`\`javascript
// app.js
const { Platform } = require('our-platform');

const app = new Platform({
  port: 3000,
  environment: 'development'
});

// Define a simple route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello, World!',
    timestamp: new Date().toISOString(),
    version: app.version
  });
});

// Start the server
app.listen(() => {
  console.log('🚀 Server running on http://localhost:3000');
});
\`\`\`

Run your application:

\`\`\`bash
node app.js
\`\`\`

## Key Concepts

### 1. Projects and Workspaces

- **Project:** A single application or service
- **Workspace:** A collection of related projects
- **Environment:** Development, staging, or production settings

### 2. Configuration Management

Our platform uses a hierarchical configuration system:

1. Default settings
2. Environment-specific settings
3. Local overrides

### 3. Plugin System

Extend functionality with plugins:

\`\`\`bash
# Install a plugin
our-platform plugin install @our-platform/auth

# List installed plugins
our-platform plugin list

# Configure plugin
our-platform plugin configure auth
\`\`\`

## Common Commands

\`\`\`bash
# Project management
our-platform create <name>          # Create new project
our-platform build                  # Build project
our-platform deploy                 # Deploy to production
our-platform status                 # Check project status

# Development
our-platform dev                    # Start development server
our-platform test                   # Run tests
our-platform lint                   # Check code quality

# Utilities
our-platform logs                   # View application logs
our-platform config                 # Manage configuration
our-platform help                   # Show help information
\`\`\`

## Troubleshooting

### Common Issues

**Issue:** Installation fails with permission errors

**Solution:** Use sudo (Linux/macOS) or run as administrator (Windows)

\`\`\`bash
# Linux/macOS
sudo npm install -g our-platform

# Windows (as administrator)
npm install -g our-platform
\`\`\`

**Issue:** Port already in use

**Solution:** Change the port in your configuration

\`\`\`javascript
const app = new Platform({
  port: process.env.PORT || 3001  // Use different port
});
\`\`\`

**Issue:** Database connection fails

**Solution:** Verify your database URL and credentials

\`\`\`bash
# Test database connection
our-platform db:test

# Reset database
our-platform db:reset
\`\`\`

## Next Steps

Now that you have the basics working:

1. **Explore Features:** Check out our [feature documentation](./features.md)
2. **Build Something:** Try our [tutorial projects](./tutorials.md)
3. **Join Community:** Connect with other developers on [Discord](https://discord.gg/example)
4. **Get Help:** Visit our [support center](./support.md)

## Additional Resources

- 📚 [Complete Documentation](https://docs.example.com)
- 🎥 [Video Tutorials](https://youtube.com/example)
- 💬 [Community Forum](https://forum.example.com)
- 🐛 [Report Issues](https://github.com/example/issues)

Welcome to the community! We're excited to see what you'll build. 🎉`
    };

    // Simple keyword matching to determine which template to use
    const lowerPrompt = userPrompt.toLowerCase();
    
    if (lowerPrompt.includes('api') || lowerPrompt.includes('endpoint') || lowerPrompt.includes('rest')) {
      return templates.api;
    } else if (lowerPrompt.includes('readme') || lowerPrompt.includes('project description')) {
      return templates.readme;
    } else if (lowerPrompt.includes('tutorial') || lowerPrompt.includes('guide') || lowerPrompt.includes('learn')) {
      return templates.tutorial;
    } else if (lowerPrompt.includes('getting started') || lowerPrompt.includes('installation') || lowerPrompt.includes('setup')) {
      return templates.getting_started;
    } else {
      // Default to a custom response based on the prompt
      return `# ${userPrompt}

## Overview

This documentation was generated based on your request: "${userPrompt}"

## Key Features

- ✨ **Feature 1** - Comprehensive functionality
- 🚀 **Feature 2** - High performance
- 🔧 **Feature 3** - Easy configuration
- 📱 **Feature 4** - Mobile responsive

## Installation

\`\`\`bash
npm install your-package
\`\`\`

## Quick Start

\`\`\`javascript
import { YourPackage } from 'your-package';

const instance = new YourPackage({
  apiKey: 'your-api-key'
});

// Use the package
const result = await instance.doSomething();
console.log(result);
\`\`\`

## Configuration

\`\`\`javascript
const config = {
  environment: 'production',
  debug: false,
  timeout: 5000
};
\`\`\`

## Examples

### Basic Usage

\`\`\`javascript
// Example implementation
const example = new YourPackage();
example.configure(config);
\`\`\`

## API Reference

### Methods

#### \`doSomething(options)\`

Performs the main functionality.

**Parameters:**
- \`options\` (Object) - Configuration options

**Returns:**
- Promise<Result> - The operation result

## Support

For questions and support, please visit our [documentation](https://docs.example.com) or open an issue on GitHub.`;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-generated-docs.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const useTemplate = (template: PromptTemplate) => {
    setPrompt(template.prompt);
    setSelectedTemplate(template);
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  const clearPrompt = () => {
    setPrompt('');
    setSelectedTemplate(null);
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  const filteredTemplates = activeCategory 
    ? promptTemplates.filter(t => t.category === activeCategory)
    : promptTemplates;

  const categories = [
    { id: 'api', label: 'API Docs', icon: <Code size={14} /> },
    { id: 'guide', label: 'Guides', icon: <Book size={14} /> },
    { id: 'readme', label: 'READMEs', icon: <FileText size={14} /> },
    { id: 'tutorial', label: 'Tutorials', icon: <Zap size={14} /> }
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && prompt.trim()) {
        e.preventDefault();
        generateMarkdown();
      }
      
      // Escape to clear
      if (e.key === 'Escape' && !isGenerating) {
        e.preventDefault();
        if (generatedMarkdown) {
          setGeneratedMarkdown('');
        } else {
          clearPrompt();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [prompt, isGenerating, generatedMarkdown]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 ai-generator-container">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-display">
                AI Markdown Generator
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                Generate professional documentation with AI assistance
              </p>
            </div>
          </div>

          {/* Template Categories */}
          {showTemplates && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <Wand2 size={18} className="text-purple-600" />
                  Quick Templates
                </h2>
                <button 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center gap-1"
                >
                  {showTemplates ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  {showTemplates ? 'Hide' : 'Show'} Templates
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={clsx(
                    "px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium",
                    activeCategory === null
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                  )}
                >
                  All
                </button>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={clsx(
                      "px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium flex items-center gap-1.5",
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-md"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                    )}
                  >
                    {category.icon}
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => useTemplate(template)}
                    className={clsx(
                      "p-4 bg-white dark:bg-slate-800 border rounded-xl transition-all duration-200 text-left group hover:shadow-lg hover:-translate-y-1",
                      selectedTemplate?.title === template.title
                        ? "border-blue-400 dark:border-blue-500 shadow-md bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={clsx(
                        "p-2 rounded-lg transition-colors",
                        template.category === 'api' && "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
                        template.category === 'guide' && "bg-green-100 dark:bg-green-900/30 text-green-600",
                        template.category === 'readme' && "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
                        template.category === 'tutorial' && "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                      )}>
                        {template.icon}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {template.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input Area */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-blue-600" size={18} />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-display">
                    {selectedTemplate ? `Customize: ${selectedTemplate.title}` : "Describe your documentation needs"}
                  </h3>
                </div>
                
                {selectedTemplate && (
                  <button
                    onClick={clearPrompt}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Clear template"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="relative">
                <textarea
                  ref={promptInputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Tell me what kind of documentation you want to generate...

Examples:
• 'Create comprehensive API documentation for a user management system with authentication'
• 'Write a detailed getting started guide for a React component library with examples'
• 'Generate a professional README for a machine learning project with installation steps'
• 'Create step-by-step tutorial documentation for building a REST API with Node.js'

Be as specific as possible - the more details you provide, the better the generated documentation will be!"
                  className="w-full h-32 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base leading-relaxed scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
                />
                
                {/* Recent prompts dropdown */}
                {showRecentPrompts && recentPrompts.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {recentPrompts.map((recentPrompt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPrompt(recentPrompt);
                          setShowRecentPrompts(false);
                        }}
                        className="w-full text-left p-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-slate-700 last:border-0"
                      >
                        <p className="text-sm text-slate-900 dark:text-white line-clamp-2">{recentPrompt}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {recentPrompts.length > 0 && (
                    <button
                      onClick={() => setShowRecentPrompts(!showRecentPrompts)}
                      className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Clock size={14} />
                      Recent
                      {showRecentPrompts ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  )}
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400 font-mono">Ctrl</kbd>
                    <span className="mx-1">+</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400 font-mono">Enter</kbd>
                    <span className="ml-1">to generate</span>
                  </div>
                </div>
                
                <button
                  onClick={generateMarkdown}
                  disabled={!prompt.trim() || isGenerating}
                  className={clsx(
                    "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2",
                    !prompt.trim() || isGenerating
                      ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      Generate
                    </>
                  )}
                </button>
              </div>
              
              {/* Generation Progress Bar */}
              {isGenerating && (
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>Generating documentation...</span>
                    <span>{Math.round(generationProgress * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {generatedMarkdown ? (
          <>
            {/* Generated Markdown Display */}
            <div className="flex-1 flex flex-col" ref={outputContainerRef}>
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3 font-display">
                  <FileText size={20} />
                  Generated Documentation
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium"
                  >
                    {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors font-medium shadow-md"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>

              {/* Preview with smooth scrolling */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                  <MarkdownRenderer content={generatedMarkdown} />
                </div>
              </div>
              
              {/* Bottom Actions */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 sticky bottom-0 z-10">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setGeneratedMarkdown('')}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <X size={14} />
                    Clear & Start Over
                  </button>
                  
                  <button
                    onClick={() => {
                      if (onGenerated) {
                        onGenerated(generatedMarkdown);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors font-medium shadow-md"
                  >
                    <Check size={18} />
                    Use This Document
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">
                Ready to Generate Amazing Documentation
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Describe what kind of documentation you need, and our AI will generate professional, 
                comprehensive markdown content tailored to your requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <span>Use quick templates above</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span>Write custom prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span>Get instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  <span>Copy or download output</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}