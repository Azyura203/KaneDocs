import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader, Copy, Check, Download, Wand2, FileText, Code, Book, Zap, X, ChevronRight, ChevronDown, Clipboard, ClipboardCheck, Clock, ArrowUp, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
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
  // ... rest of the component implementation ...
}