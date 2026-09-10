import React, { useEffect, useState } from 'react';
import { useInvestigator, investigatorStore } from '../../stores/investigator-store.ts';
import { useAuth } from '../../stores/auth-store.ts';
import { InvestigatorKPIBar } from './components/InvestigatorKPIBar.tsx';
import { EntityRelationshipGraph } from './components/EntityRelationshipGraph.tsx';
import { InvestigationTimeline } from './components/InvestigationTimeline.tsx';
import { RelatedCasesTable } from './components/RelatedCasesTable.tsx';
import { EvidencePanel } from './components/EvidencePanel.tsx';
import { EntityProfileDrawer } from './components/EntityProfileDrawer.tsx';
import { EmailEntityModal, ActiveEntityHud } from './components/EmailEntityModal.tsx';
import { ThreatIntelPanel } from './components/ThreatIntelPanel.tsx';
import { CaseActionBar } from './components/CaseActionBar.tsx';
import { LinkCaseModal } from './components/LinkCaseModal.tsx';
import { MergeCampaignModal } from './components/MergeCampaignModal.tsx';
import { EscalateModal } from './components/EscalateModal.tsx';
import {
  Network,
  Clock,
  Archive,
  Compass,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { OriginIntelligenceWorkspace } from './components/OriginIntelligenceWorkspace.tsx';

export const InvestigatorWorkspace: React.FC = () => {
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';
  const { currentCaseId } = useInvestigator();

  // Desktop view layout modes: 'split' | 'origin' | 'graph' | 'timeline'
  const [workspaceMode, setWorkspaceMode] = useState<'split' | 'origin' | 'graph' | 'timeline'>('split');
  const [showSecondaryIntel, setShowSecondaryIntel] = useState(false);

  // Initialize workspace data on mount
  useEffect(() => {
    investigatorStore.initWorkspace(tenantId);
  }, [tenantId]);

  return (
    <div className="flex flex-col min-h-full bg-[#f4f7fb] dark:bg-[#070b14] select-none text-slate-800 dark:text-slate-200 transition-colors">
      {/* LEVEL 1 — Immediate Context KPI Bar */}
      <InvestigatorKPIBar />

      {/* Primary Workspace Body */}
      <div className="flex-1 p-4 sm:p-5 space-y-5 max-w-[1850px] w-full mx-auto">
        {/* Workspace Mode Selector & Secondary Intelligence Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-200/70 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold">
            <button
              type="button"
              onClick={() => setWorkspaceMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                workspaceMode === 'split'
                  ? 'bg-white dark:bg-[#070b14] border border-[#08B4ED]/40 dark:border-[#08B4ED]/50 text-[#08B4ED] font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span>Forensic Split (Graph + Timeline)</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                workspaceMode === 'graph'
                  ? 'bg-white dark:bg-[#070b14] border border-[#08B4ED]/40 dark:border-[#08B4ED]/50 text-[#08B4ED] font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graph Focus</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                workspaceMode === 'timeline'
                  ? 'bg-white dark:bg-[#070b14] border border-[#08B4ED]/40 dark:border-[#08B4ED]/50 text-[#08B4ED] font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline Focus</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('origin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                workspaceMode === 'origin'
                  ? 'bg-white dark:bg-[#070b14] border border-[#08B4ED]/40 dark:border-[#08B4ED]/50 text-[#08B4ED] font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Origin Map Focus</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Evidence Ledger Toggle */}
            <button
              type="button"
              onClick={() => investigatorStore.openEvidenceInspector(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:bg-slate-50 dark:hover:bg-[#0f172a] text-xs font-mono font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              <Archive className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Inspect Evidence Ledger</span>
            </button>

            {/* Toggle Secondary Intelligence (Threat Intelligence Telemetry) */}
            <button
              type="button"
              onClick={() => setShowSecondaryIntel((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:bg-slate-50 dark:hover:bg-[#0f172a] text-xs font-mono font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#08B4ED]" />
              <span>{showSecondaryIntel ? 'Hide Level 4 Threat Intel' : 'View Level 4 Threat Intel'}</span>
              {showSecondaryIntel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Active Entity Investigation HUD Banner */}
        <ActiveEntityHud />

        {/* LEVEL 2 — Core Forensic Workspace: Entity Graph + Timeline */}
        {workspaceMode === 'split' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch lg:h-[560px]">
              {/* Left 7 cols: Entity Relationship Graph */}
              <div className="lg:col-span-7 flex flex-col h-[480px] lg:h-full">
                <EntityRelationshipGraph />
              </div>

              {/* Right 5 cols: Chronological Investigation Timeline */}
              <div className="lg:col-span-5 flex flex-col h-[480px] lg:h-full">
                <InvestigationTimeline />
              </div>
            </div>

            {/* Forensic Origin Intelligence & Geolocation Workspace */}
            <div className="w-full">
              <OriginIntelligenceWorkspace />
            </div>
          </div>
        )}

        {/* Focus Mode: Origin Intelligence */}
        {workspaceMode === 'origin' && (
          <div className="w-full animate-fadeIn">
            <OriginIntelligenceWorkspace />
          </div>
        )}

        {/* Focus Mode: Graph */}
        {workspaceMode === 'graph' && (
          <div className="min-h-[640px] flex flex-col animate-fadeIn">
            <EntityRelationshipGraph />
          </div>
        )}

        {/* Focus Mode: Timeline */}
        {workspaceMode === 'timeline' && (
          <div className="min-h-[640px] flex flex-col animate-fadeIn">
            <InvestigationTimeline />
          </div>
        )}

        {/* LEVEL 3 — Correlation: Related Cases / Similar Investigations */}
        <div className="w-full">
          <RelatedCasesTable />
        </div>

        {/* LEVEL 4 — Collapsible Threat Intelligence Telemetry */}
        {showSecondaryIntel && (
          <div className="w-full animate-fadeIn">
            <ThreatIntelPanel />
          </div>
        )}
      </div>

      {/* Primary Actions Sticky Footer */}
      <div className="sticky bottom-0 z-30">
        <CaseActionBar />
      </div>

      {/* Drawers and Modals */}
      <EvidencePanel />
      <EntityProfileDrawer />
      <EmailEntityModal />
      <LinkCaseModal />
      <MergeCampaignModal />
      <EscalateModal />
    </div>
  );
};
