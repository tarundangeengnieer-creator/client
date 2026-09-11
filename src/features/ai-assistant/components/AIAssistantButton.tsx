import React from 'react';
import { Sparkles } from 'lucide-react';
import { useUI, uiStore } from '../../../stores/ui-store.ts';

export const AIAssistantButton: React.FC = () => {
  const ui = useUI();

  if (ui.isCopilotOpen) {
    return null; // Hide the FAB when the drawer is open
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden">
      <button
        type="button"
        onClick={() => uiStore.openCopilot(true)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#08B4ED] text-white shadow-lg hover:bg-sky-400 hover:scale-105 hover:shadow-cyan-500/30 transition-all cursor-pointer ring-4 ring-[#08B4ED]/20 focus:outline-none"
        title="Open AI Investigation Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    </div>
  );
};
