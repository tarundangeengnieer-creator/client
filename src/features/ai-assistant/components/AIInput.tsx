import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils.ts';

export interface AIInputProps {
  onSend: (message: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
}

export const AIInput: React.FC<AIInputProps> = ({
  onSend,
  isProcessing = false,
  placeholder = 'Ask the investigation assistant...',
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !isProcessing) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  useEffect(() => {
    if (!isProcessing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isProcessing]);

  return (
    <div className="relative flex items-end w-full bg-white dark:bg-[#070b14] border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-[#08B4ED] focus-within:border-[#08B4ED] transition-all p-1">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isProcessing}
        className="w-full max-h-[150px] min-h-[40px] py-2.5 px-3 bg-transparent border-none focus:outline-none resize-none text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50"
        rows={1}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!input.trim() || isProcessing}
        className={cn(
          'shrink-0 w-8 h-8 flex items-center justify-center rounded-lg mb-0.5 mr-0.5 transition-colors',
          input.trim() && !isProcessing
            ? 'bg-[#08B4ED] text-white hover:bg-sky-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
        )}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4 ml-0.5" />
        )}
      </button>
    </div>
  );
};
