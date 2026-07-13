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
