import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight.js error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
});

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const html = await marked.parse(content);
        setHtmlContent(html);
      } catch (err) {
        console.error('Markdown parsing error:', err);
        setHtmlContent(`<p>Error parsing markdown content</p>`);
      }
    };

    parseMarkdown();
  }, [content]);

  useEffect(() => {
    // Add copy buttons to code blocks after HTML is rendered
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const pre = block.parentElement;
      if (pre && !pre.querySelector('.copy-button')) {
        pre.style.position = 'relative';
        pre.classList.add('group');
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button absolute top-3 right-3 p-2 rounded-lg bg-gray-800 dark:bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100';
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
        `;
        
        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(block.textContent || '');
            copyButton.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            `;
            setTimeout(() => {
              copyButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
              `;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
        
        pre.appendChild(copyButton);
      }
    });
  }, [htmlContent]);

  return (
    <div
      className={`prose prose-gray dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        '--tw-prose-body': 'rgb(55 65 81)',
        '--tw-prose-headings': 'rgb(17 24 39)',
        '--tw-prose-lead': 'rgb(75 85 99)',
        '--tw-prose-links': 'rgb(59 130 246)',
        '--tw-prose-bold': 'rgb(17 24 39)',
        '--tw-prose-counters': 'rgb(107 114 128)',
        '--tw-prose-bullets': 'rgb(209 213 219)',
        '--tw-prose-hr': 'rgb(229 231 235)',
        '--tw-prose-quotes': 'rgb(17 24 39)',
        '--tw-prose-quote-borders': 'rgb(229 231 235)',
        '--tw-prose-captions': 'rgb(107 114 128)',
        '--tw-prose-code': 'rgb(17 24 39)',
        '--tw-prose-pre-code': 'rgb(229 231 235)',
        '--tw-prose-pre-bg': 'rgb(17 24 39)',
        '--tw-prose-th-borders': 'rgb(209 213 219)',
        '--tw-prose-td-borders': 'rgb(229 231 235)',
        '--tw-prose-invert-body': 'rgb(209 213 219)',
        '--tw-prose-invert-headings': 'rgb(255 255 255)',
        '--tw-prose-invert-lead': 'rgb(156 163 175)',
        '--tw-prose-invert-links': 'rgb(96 165 250)',
        '--tw-prose-invert-bold': 'rgb(255 255 255)',
        '--tw-prose-invert-counters': 'rgb(156 163 175)',
        '--tw-prose-invert-bullets': 'rgb(75 85 99)',
        '--tw-prose-invert-hr': 'rgb(55 65 81)',
        '--tw-prose-invert-quotes': 'rgb(245 245 245)',
        '--tw-prose-invert-quote-borders': 'rgb(55 65 81)',
        '--tw-prose-invert-captions': 'rgb(156 163 175)',
        '--tw-prose-invert-code': 'rgb(255 255 255)',
        '--tw-prose-invert-pre-code': 'rgb(209 213 219)',
        '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.5)',
        '--tw-prose-invert-th-borders': 'rgb(75 85 99)',
        '--tw-prose-invert-td-borders': 'rgb(55 65 81)',
      } as React.CSSProperties}
    />
  );
}