import React from 'react';
import { Sparkles } from 'lucide-react';
import { useUI, uiStore } from '../../../stores/ui-store.ts';

export const AIAssistantButton: React.FC = () => {
  const ui = useUI();

  if (ui.isCopilotOpen) {
    return null; // Hide the FAB when the drawer is open
  }

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 print:hidden">
      <button
        type="button"
        onClick={() => uiStore.openCopilot(true)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#18BFFF] hover:bg-[#15aae6] ring-4 ring-[#18BFFF]/25 text-[#071A2B] shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group"
        title="Open AI Investigation Copilot"
        aria-label="Open AI Investigation Copilot"
      >
        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 shrink-0" strokeWidth={2.5} />
        <span className="text-xs font-bold tracking-wide whitespace-nowrap">AI Copilot</span>
      </button>
    </div>
  );
};
