import React from 'react';
import { useUI, uiStore } from '../../../stores/ui-store.ts';
import { AIChat } from './AIChat.tsx';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils.ts';

export const AIAssistantDrawer: React.FC = () => {
  const ui = useUI();

  return (
    <>
      {/* Backdrop */}
      {ui.isCopilotOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/50 z-40 transition-opacity print:hidden"
          onClick={() => uiStore.openCopilot(false)}
          aria-hidden="true"
        />
      )}

      {/* Assistant Side-Rail: Floating overlay drawer on regular desktop, integrated rail on ultra-wide 2xl screens */}
      <aside
        className={cn(
          'transition-transform duration-300 ease-in-out print:hidden flex flex-col bg-white dark:bg-[#0b1329] border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50',
          'fixed top-0 right-0 h-full',
          ui.isCopilotOpen
            ? 'w-full sm:w-[380px] md:w-[400px] translate-x-0 opacity-100'
            : 'w-full sm:w-[380px] md:w-[400px] translate-x-full opacity-0 pointer-events-none'
        )}
        aria-label="Investigation Assistant Side Rail"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#08B4ED]/10 text-[#08B4ED] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Investigation Assistant
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                Evidence-Grounded AI Copilot
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => uiStore.openCopilot(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer shrink-0"
            title="Close Assistant"
            aria-label="Close Investigation Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden min-h-0">
          <AIChat />
        </div>
      </aside>
    </>
  );
};
