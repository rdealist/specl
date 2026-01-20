'use client';

import React from 'react';

interface DocumentBlockProps {
  type: 'h1' | 'h2' | 'h3' | 'p' | 'list';
  content: string | string[];
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const DocumentBlock: React.FC<DocumentBlockProps> = ({
  type,
  content,
  editable = false,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const baseClasses = 'w-full bg-transparent border-none outline-none resize-none';

  switch (type) {
    case 'h1':
      return editable ? (
        <input
          type="text"
          value={content as string}
          onChange={handleChange}
          className={`${baseClasses} text-3xl font-bold tracking-tight`}
          placeholder="Untitled"
        />
      ) : (
        <h1 className="text-3xl font-bold tracking-tight mb-4">{content}</h1>
      );

    case 'h2':
      return editable ? (
        <input
          type="text"
          value={content as string}
          onChange={handleChange}
          className={`${baseClasses} text-xl font-semibold`}
          placeholder="Section title"
        />
      ) : (
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-[var(--accent)] rounded-full" />
          {content}
        </h2>
      );

    case 'h3':
      return editable ? (
        <input
          type="text"
          value={content as string}
          onChange={handleChange}
          className={`${baseClasses} text-base font-semibold`}
          placeholder="Subsection title"
        />
      ) : (
        <h3 className="text-base font-semibold mb-2">{content}</h3>
      );

    case 'p':
      return editable ? (
        <textarea
          value={content as string}
          onChange={handleChange}
          className={`${baseClasses} text-sm text-[var(--muted-foreground)] leading-relaxed min-h-[60px]`}
          placeholder="Add description..."
          rows={3}
        />
      ) : (
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
          {content}
        </p>
      );

    case 'list':
      if (Array.isArray(content)) {
        return (
          <ul className="list-disc list-inside space-y-1.5 text-sm text-[var(--foreground)]/80">
            {content.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      }
      return null;

    default:
      return null;
  }
};
