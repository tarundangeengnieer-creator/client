import React from 'react';
import { Sparkles, User, ShieldAlert } from 'lucide-react';
import { cn } from '../../../lib/utils.ts';

export interface AIMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: React.ReactNode;
  timestamp: string;
}

export const AIMessage: React.FC<AIMessageProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <div className={cn('flex flex-col mb-6', isUser ? 'items-end' : 'items-start')}>
      <div className={cn('flex items-center gap-2 mb-1.5', isUser ? 'flex-row-reverse' : 'flex-row')}>
        <div
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded-md shrink-0 shadow-sm border',
            isUser
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : isSystem
              ? 'bg-rose-950/50 text-rose-400 border-rose-900/50'
              : 'bg-[#08B4ED]/10 text-[#08B4ED] border-[#08B4ED]/30'
          )}
        >
          {isUser ? <User className="w-3.5 h-3.5" /> : isSystem ? <ShieldAlert className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-wider">
          {isUser ? 'Investigator' : isSystem ? 'System Protocol' : 'AI Assessment'}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono ml-2">
          {timestamp}
        </span>
      </div>

      <div
        className={cn(
          'text-[13px] leading-relaxed p-3.5 rounded-xl border shadow-sm max-w-[95%]',
          isUser
            ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-tr-sm'
            : isSystem
            ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-300 rounded-tl-sm'
            : 'bg-white dark:bg-[#0b1329] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
        )}
      >
        {content}
      </div>
    </div>
  );
};
