import React from 'react';
import { Sparkles } from 'lucide-react';
import { useUI, uiStore } from '../../../stores/ui-store.ts';

export const AIAssistantButton: React.FC = () => {
  const ui = useUI();

  if (ui.isCopilotOpen) {
    return null; // Hide the FAB when the drawer is open
  }

  return (
    <div className="fixed bottom-5 right-6 z-40 print:hidden">
      <button
        type="button"
        onClick={() => uiStore.openCopilot(true)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#18BFFF] hover:bg-[#15aae6] ring-[6px] ring-[#18BFFF]/25 text-[#071A2B] shadow-lg transition-all cursor-pointer group"
        title="Open AI Investigation Copilot"
        aria-label="Open AI Investigation Copilot"
      >
        <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" strokeWidth={2.5} />
      </button>
    </div>
  );
};
