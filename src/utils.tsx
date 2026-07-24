import React from 'react';
import SmartLink from './components/SmartLink';

/**
 * Parses raw asterisks (**text**) and markdown links ([Label](url)) safely into JSX.
 */
export function formatRichText(text: string): React.ReactNode {
  if (!text) return '';

  // Match markdown links [Text](url) or bold **text**
  const regex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Check if link [Label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const url = linkMatch[2];
      return (
        <SmartLink
          key={index}
          href={url}
          className="text-teal-600 hover:text-teal-800 font-bold underline underline-offset-2 transition-colors"
        >
          {label}
        </SmartLink>
      );
    }

    // Check if bold **text**
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {boldMatch[1]}
        </strong>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Submits a new record to the backend audit log collection.
 */
export async function logDatabaseActivity(
  action: string,
  status: 'SUCCESS' | 'ERROR',
  details: string,
  errorMessage?: string
): Promise<void> {
  try {
    await fetch('/api/audit-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, status, details, errorMessage })
    });
  } catch (err) {
    console.warn('Failed to submit audit log to server:', err);
  }
}
