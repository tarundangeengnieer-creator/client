import React from 'react';
import { useUI, uiStore } from '../../../stores/ui-store.ts';
import { AIChat } from './AIChat.tsx';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils.ts';

export const AIAssistantDrawer: React.FC = () => {
  const ui = useUI();

  return (
    <>
      {/* Backdrop for mobile (optional, usually copilot sits next to content, but for global we can use it or just let it overlay) */}
      {ui.isCopilotOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/50 z-40 lg:hidden transition-opacity print:hidden"
          onClick={() => uiStore.openCopilot(false)}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-[#0b1329] border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out print:hidden',
          ui.isCopilotOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#08B4ED]/10 text-[#08B4ED]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                Investigation Assistant
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Evidence-Grounded AI Copilot
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => uiStore.openCopilot(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <AIChat />
        </div>
      </div>
    </>
  );
};
