import React, { useState, useEffect } from 'react';
import { Save, Eye, Edit3, FileText, Upload, Download, Sparkles } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import AIMarkdownGenerator from './AIMarkdownGenerator';

interface DocumentationEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
}

export default function DocumentationEditor({ 
  initialContent = '', 
  onSave,
  readOnly = false 
}: DocumentationEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsDirty(value !== initialContent);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content);
      setIsDirty(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/markdown') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        handleContentChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAIGenerated = (generatedMarkdown: string) => {
    handleContentChange(generatedMarkdown);
    setShowAIGenerator(false);
  };

  if (readOnly) {
    return <MarkdownRenderer content={content} />;
  }

  if (showAIGenerator) {
    return (
      <div className="h-full flex flex-col">
        {/* AI Generator Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} />
            AI Markdown Generator
          </h2>
          <button
            onClick={() => setShowAIGenerator(false)}
            className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Back to Editor
          </button>
        </div>
        
        <div className="flex-1">
          <AIMarkdownGenerator onGenerated={handleAIGenerated} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isPreview
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          
          <button
            onClick={() => setShowAIGenerator(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Sparkles size={16} />
            AI Generate
          </button>
          
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all cursor-pointer">
            <Upload size={16} />
            Upload MD
            <input
              type="file"
              accept=".md,.markdown"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        {onSave && (
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isDirty
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            Save
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex">
        {!isPreview ? (
          <div className="flex-1 flex">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="# Start writing your documentation...

## Getting Started

Write your documentation in Markdown format. You can include:

- Code blocks with syntax highlighting
- Tables, lists, and links
- Images and media
- And much more!

```javascript
console.log('Hello, KaneDocs!');
```

💡 **Tip:** Use the AI Generate button to create documentation automatically!"
              className="flex-1 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed resize-none focus:outline-none border-r border-gray-200 dark:border-gray-700"
              style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace' }}
            />
            <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </div>
  );
}