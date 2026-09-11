import React from 'react';

export interface AISuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export const AISuggestedPrompts: React.FC<AISuggestedPromptsProps> = ({ prompts, onSelect }) => {
  if (!prompts.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 px-1">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(prompt)}
          className="text-left text-[11px] px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-[#08B4ED]/10 hover:text-[#08B4ED] hover:border-[#08B4ED]/30 transition-colors shadow-xs"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
