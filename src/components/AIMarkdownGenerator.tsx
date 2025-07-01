import React, { useState } from 'react';
import { Sparkles, Send, Loader, Copy, Check, Download, Wand2, FileText, Code, Book, Zap } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface AIMarkdownGeneratorProps {
  onGenerated?: (markdown: string) => void;
}

interface PromptTemplate {
  title: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    title: 'API Documentation',
    icon: <Code size={16} />,
    description: 'Generate comprehensive API documentation',
    prompt: 'Create detailed API documentation for a REST API including endpoints, request/response examples, authentication, and error handling.'
  },
  {
    title: 'Getting Started Guide',
    icon: <Zap size={16} />,
    description: 'Create installation and setup instructions',
    prompt: 'Write a comprehensive getting started guide including installation, configuration, and first steps for a new software project.'
  },
  {
    title: 'README Template',
    icon: <FileText size={16} />,
    description: 'Generate a professional README file',
    prompt: 'Create a professional README.md file with project description, features, installation, usage examples, and contribution guidelines.'
  },
  {
    title: 'Tutorial Guide',
    icon: <Book size={16} />,
    description: 'Step-by-step tutorial documentation',
    prompt: 'Write a detailed step-by-step tutorial guide with code examples, explanations, and best practices for learning a new technology.'
  }
];

export default function AIMarkdownGenerator({ onGenerated }: AIMarkdownGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateMarkdown = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Simulate AI generation with a realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate comprehensive markdown based on the prompt
      const markdown = generateMockMarkdown(prompt);
      setGeneratedMarkdown(markdown);
      
      if (onGenerated) {
        onGenerated(markdown);
      }
    } catch (error) {
      console.error('Error generating markdown:', error);
    } finally {
      setIsGenerating(false);
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
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                AI Markdown Generator
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                Generate professional documentation with AI assistance
              </p>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {promptTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => useTemplate(template)}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 text-left group hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-primary-500 group-hover:text-primary-600 transition-colors">
                    {template.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {template.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {template.description}
                </p>
              </button>
            ))}
          </div>

          {/* Enhanced Input Area */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-primary-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Describe your documentation needs
                </h3>
              </div>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tell me what kind of documentation you want to generate...

Examples:
• 'Create comprehensive API documentation for a user management system with authentication'
• 'Write a detailed getting started guide for a React component library with examples'
• 'Generate a professional README for a machine learning project with installation steps'
• 'Create step-by-step tutorial documentation for building a REST API with Node.js'

Be as specific as possible - the more details you provide, the better the generated documentation will be!"
                className="w-full h-40 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base leading-relaxed"
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  💡 <strong>Pro tip:</strong> Include specific technologies, features, or use cases for better results
                </div>
                
                <button
                  onClick={generateMarkdown}
                  disabled={!prompt.trim() || isGenerating}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3 text-lg ${
                    !prompt.trim() || isGenerating
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Generate Documentation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {generatedMarkdown ? (
          <>
            {/* Generated Markdown Display */}
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <FileText size={20} />
                  Generated Documentation
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <MarkdownRenderer content={generatedMarkdown} />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Generate Amazing Documentation
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Describe what kind of documentation you need, and our AI will generate professional, 
                comprehensive markdown content tailored to your requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Use quick templates above</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                  <span>Write custom prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Get instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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