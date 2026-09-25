'use client';

import { useState, KeyboardEvent } from 'react';
import { Tag as TagIcon, X, Plus } from 'lucide-react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  'Aerospace',
  'CNC',
  '3D Printing',
  'Prototypes',
  'PET-CF',
  'ASA',
  'PETG',
  'PLA',
  'Tooling',
  'Jigs',
  'Custom',
];

export default function TagInput({ tags, onChange, suggestions = DEFAULT_SUGGESTIONS }: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (text: string) => {
    const trimmed = text.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;
    if (!tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  const unusedSuggestions = suggestions.filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">
        Product Tags ({tags.length})
      </label>

      {/* Input container with chips */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <TagIcon className="h-4 w-4 text-gray-400 ml-1 shrink-0" />

        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-blue-500 hover:text-blue-800 transition-colors ml-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(inputValue)}
          placeholder={tags.length === 0 ? 'Type tag and press Enter...' : 'Add tag...'}
          className="flex-1 min-w-[140px] bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-none px-1 py-1"
        />
      </div>

      {/* Quick suggestions */}
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-gray-500 pt-1">
          <span className="text-[11px]">Suggestions:</span>
          {unusedSuggestions.slice(0, 6).map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addTag(item)}
              className="inline-flex items-center gap-0.5 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-2.5 w-2.5 text-gray-400" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
