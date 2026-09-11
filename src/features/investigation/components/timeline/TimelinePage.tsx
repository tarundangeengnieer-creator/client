import React, { useEffect } from 'react';
import { useAuth } from '../../../../stores/auth-store.ts';
import { useInvestigator, investigatorStore } from '../../../../stores/investigator-store.ts';
import { TimelineWorkspace } from './TimelineWorkspace.tsx';
import { EvidencePanel } from '../../../investigator/components/EvidencePanel.tsx';
import { EntityProfileDrawer } from '../../../investigator/components/EntityProfileDrawer.tsx';
import { EmailEntityModal } from '../../../investigator/components/EmailEntityModal.tsx';
import { Clock } from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';

  useEffect(() => {
    investigatorStore.initWorkspace(tenantId);
  }, [tenantId]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#f4f7fb] dark:bg-[#070b14] select-none text-slate-800 dark:text-slate-200 overflow-hidden transition-colors">
      {/* Toolbar */}
      <div className="flex-none px-6 py-4 bg-white dark:bg-[#0c1322] border-b border-slate-200/90 dark:border-slate-800/90 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-[#070b14] border border-[#08B4ED]/40 flex items-center justify-center">
          <Clock className="w-4 h-4 text-[#08B4ED]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Investigation Timeline</h1>
          <p className="text-xs text-slate-500 font-mono">Chronological Event Reconstruction</p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <TimelineWorkspace />
      </div>

      {/* Overlays & Drawers */}
      <EvidencePanel />
      <EntityProfileDrawer />
      <EmailEntityModal />
    </div>
  );
};
