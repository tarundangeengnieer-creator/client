import React from 'react';
import { EvidenceList } from './EvidenceList.tsx';
import { EvidenceInspector } from './EvidenceInspector.tsx';

export const EvidenceWorkspace: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[640px] bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs animate-fadeIn">
      {/* Left: Evidence List */}
      <div className="w-[320px] lg:w-[400px] shrink-0">
        <EvidenceList />
      </div>

      {/* Right: Evidence Inspector */}
      <div className="flex-1 min-w-0">
        <EvidenceInspector />
      </div>
    </div>
  );
};
