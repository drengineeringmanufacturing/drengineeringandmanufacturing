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
  'Titanium',
  'Turbines',
  'Composites',
  'Actuators',
  'Avionics',
  'Hydraulics',
  'Precision',
  'Valves',
  'Propulsion',
  'Defense',
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
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Product Tags ({tags.length})
      </label>

      {/* Input container with chips */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 p-2.5 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all">
        <TagIcon className="h-4 w-4 text-slate-500 ml-1 shrink-0" />

        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-500/15 border border-sky-500/30 px-2.5 py-1 text-xs font-medium text-sky-300"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-sky-400/80 hover:text-white transition-colors ml-0.5"
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
          placeholder={tags.length === 0 ? 'Type tag and press Enter (e.g. Aerospace, CNC)...' : 'Add tag...'}
          className="flex-1 min-w-[140px] bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-1 py-1"
        />
      </div>

      {/* Quick suggestions */}
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-slate-400 pt-1">
          <span className="text-[11px]">Suggestions:</span>
          {unusedSuggestions.slice(0, 6).map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addTag(item)}
              className="inline-flex items-center gap-0.5 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Plus className="h-2.5 w-2.5 text-slate-400" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
