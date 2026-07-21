import React from 'react';

/**
 * Parses raw asterisks (**text**) and replaces them with JSX <strong> elements safely.
 */
export function formatRichText(text: string): React.ReactNode {
  if (!text) return '';
  
  const parts = text.split('**');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-slate-800">{part}</strong>;
    }
    return part;
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
