/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SmartLink } from './SmartLink';
import { slugify } from '../lib/navigation';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  activeTab?: string;
}

/**
 * Extracts plain text from React node children for slug generation.
 */
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
    return extractText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

/**
 * MarkdownRenderer component.
 * Renders Markdown content with automatic slugified IDs on headings (for scroll anchors)
 * and SmartLink components for internal category navigation.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = 'space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed',
  activeTab
}) => {
  if (!content) return null;

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        components={{
          // Heading 1 with anchor ID
          h1: ({ children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return (
              <h1 id={id} className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-6 mb-3 scroll-mt-24 border-b border-slate-100 pb-2" {...props}>
                {children}
              </h1>
            );
          },
          // Heading 2 with anchor ID
          h2: ({ children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return (
              <h2 id={id} className="text-lg sm:text-xl font-bold text-slate-900 font-display mt-5 mb-2.5 scroll-mt-24" {...props}>
                {children}
              </h2>
            );
          },
          // Heading 3 with anchor ID
          h3: ({ children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return (
              <h3 id={id} className="text-base font-bold text-slate-800 font-display mt-4 mb-2 scroll-mt-24" {...props}>
                {children}
              </h3>
            );
          },
          // Heading 4 with anchor ID
          h4: ({ children, ...props }) => {
            const text = extractText(children);
            const id = slugify(text);
            return (
              <h4 id={id} className="text-sm font-bold text-slate-800 mt-3 mb-1.5 scroll-mt-24" {...props}>
                {children}
              </h4>
            );
          },
          // Paragraph
          p: ({ children, ...props }) => (
            <p className="leading-relaxed my-2.5 font-sans" {...props}>
              {children}
            </p>
          ),
          // Custom Link with SmartLink
          a: ({ href, children, ...props }) => (
            <SmartLink
              href={href || ''}
              activeTab={activeTab}
              className="text-teal-600 hover:text-teal-800 font-semibold underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition-colors"
              {...props}
            >
              {children}
            </SmartLink>
          ),
          // Unordered list
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 text-slate-700" {...props}>
              {children}
            </ul>
          ),
          // Ordered list
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-slate-700 font-mono text-xs" {...props}>
              {children}
            </ol>
          ),
          // List item
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          // Blockquote
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-teal-500 bg-teal-50/50 p-3.5 my-3 rounded-r-xl text-slate-700 italic border-y border-r border-teal-100" {...props}>
              {children}
            </blockquote>
          ),
          // Strong / Bold
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-slate-900" {...props}>
              {children}
            </strong>
          ),
          // Code
          code: ({ children, ...props }) => (
            <code className="bg-slate-100 text-teal-800 font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-200" {...props}>
              {children}
            </code>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
