import React, { useEffect, useState } from 'react';
import { useInvestigator, investigatorStore } from '../../stores/investigator-store.ts';
import { useAuth } from '../../stores/auth-store.ts';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { InvestigatorKPIBar } from './components/InvestigatorKPIBar.tsx';
import { EntityRelationshipGraph } from './components/EntityRelationshipGraph.tsx';
import { InvestigationTimeline } from './components/InvestigationTimeline.tsx';
import { RelatedCasesTable } from './components/RelatedCasesTable.tsx';
import { EvidencePanel } from './components/EvidencePanel.tsx';
import { EntityProfileDrawer } from './components/EntityProfileDrawer.tsx';
import { EmailEntityModal } from './components/EmailEntityModal.tsx';
import { ThreatIntelPanel } from './components/ThreatIntelPanel.tsx';
import { CaseActionBar } from './components/CaseActionBar.tsx';
import { LinkCaseModal } from './components/LinkCaseModal.tsx';
import { MergeCampaignModal } from './components/MergeCampaignModal.tsx';
import { EscalateModal } from './components/EscalateModal.tsx';
import { MLDetectionPanel } from './components/MLDetectionPanel.tsx';
import {
  Network,
  Clock,
  Archive,
  Compass,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Cpu,
} from 'lucide-react';

import { OriginIntelligenceWorkspace } from './components/OriginIntelligenceWorkspace.tsx';

export const InvestigatorWorkspace: React.FC = () => {
  const auth = useAuth();
  const ui = useUI();
  const tenantId = auth.currentTenant?.id ;
  const { currentCaseId } = useInvestigator();

  // Desktop view layout modes
  const [workspaceMode, setWorkspaceMode] = useState<'split' | 'origin' | 'graph'>('split');
  const [showSecondaryIntel, setShowSecondaryIntel] = useState(false);
  const [showMLPanel, setShowMLPanel] = useState(true);

  // Initialize workspace data on mount
  useEffect(() => {
    investigatorStore.initWorkspace(tenantId);
  }, [tenantId]);

  return (
    <div className="flex flex-col min-h-full bg-[#f4f7fb] dark:bg-[#070b14] select-none text-slate-800 dark:text-slate-200 transition-colors">
      {/* LEVEL 1 — Immediate Context KPI Bar */}
      <InvestigatorKPIBar />

      {/* SIH 26106 DEMO: ATTACK CHAIN NAVIGATOR / INVESTIGATION PHASE */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-5 pt-3">
        <div className="flex items-center justify-between overflow-x-auto custom-scrollbar pb-2 select-none border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'email', label: 'EMAIL' },
            { id: 'extract', label: 'EXTRACT' },
            { id: 'detect', label: 'DETECT' },
            { id: 'correlate', label: 'CORRELATE' },
            { id: 'intel', label: 'INTELLIGENCE' },
            { id: 'investigate', label: 'INVESTIGATE' },
            { id: 'report', label: 'REPORT' }
          ].map((phase, i, arr) => {
            // Very simple heuristic for active phase based on workspace interaction
            let isActive = false;
            let isPast = false;
            
            // Heuristic for Demo:
            // 0-2 (Email, Extract, Detect) are implicitly "Past" because the case is already generated.
            // 3 (Correlate) is the default active state.
            // 4 (Intelligence) is active if TI panel is open.
            // 5 (Investigate) is active if AI drawer is open (we don't strictly track it here, so let's default to Correlate unless Report is open).
            // For simplicity, hardcode the active phase as 3 (Correlate) unless TI is open.
            let currentIndex = 3;
            if (showSecondaryIntel) currentIndex = 4;
            if (workspaceMode === 'origin') currentIndex = 4;
            
            if (i < currentIndex) isPast = true;
            if (i === currentIndex) isActive = true;

            return (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                    isActive 
                      ? 'bg-[#08B4ED] text-white border-[#08B4ED] shadow-[0_0_8px_rgba(8,180,237,0.4)]'
                      : isPast 
                      ? 'bg-[#08B4ED]/10 text-[#08B4ED] border-[#08B4ED]/30'
                      : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    {isPast ? '✓' : isActive ? '●' : '○'}
                  </div>
                  <span className={`text-[9px] font-mono font-bold tracking-wider ${
                    isActive ? 'text-[#08B4ED]' : isPast ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'
                  }`}>
                    {phase.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`flex-1 h-px min-w-[20px] max-w-[100px] ${
                    isPast ? 'bg-[#08B4ED]/30' : 'bg-slate-200 dark:bg-slate-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Primary Workspace Body */}
      <div className="flex-1 p-3 sm:p-4 space-y-4 max-w-[1850px] w-full mx-auto">
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Evidence Ledger Toggle */}
            <button
              type="button"
              onClick={() => investigatorStore.openEvidenceInspector(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:bg-slate-50 dark:hover:bg-[#0f172a] text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              <Archive className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Inspect Evidence Ledger</span>
            </button>

            {/* Toggle ML Detection Signals */}
            <button
              type="button"
              onClick={() => setShowMLPanel((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-colors cursor-pointer shadow-xs ${
                showMLPanel
                  ? 'border-amber-500/50 bg-amber-50 dark:bg-[#181108] text-amber-600 dark:text-amber-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:bg-slate-50 dark:hover:bg-[#0f172a] text-slate-700 dark:text-slate-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>{showMLPanel ? 'Hide ML Signals' : 'ML Signals'}</span>
              {showMLPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Toggle Secondary Intelligence (Threat Intelligence Telemetry) */}
            <button
              type="button"
              onClick={() => setShowSecondaryIntel((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:bg-slate-50 dark:hover:bg-[#0f172a] text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#08B4ED]" />
              <span>{showSecondaryIntel ? 'Hide Level 4 Threat Intel' : 'View Level 4 Threat Intel'}</span>
              {showSecondaryIntel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ML Detection Telemetry (Specimen Predictions & Latencies) */}
        {showMLPanel && (
          <div className="w-full animate-fadeIn">
            <MLDetectionPanel />
          </div>
        )}

        {/* LEVEL 2 — Core Forensic Workspace: Entity Graph + Timeline */}
        {workspaceMode === 'split' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[500px]">
              {/* Left 7 cols: Entity Relationship Graph */}
              <div className="lg:col-span-7 flex flex-col min-h-[500px]">
                <EntityRelationshipGraph />
              </div>

              {/* Right 5 cols: Chronological Investigation Timeline */}
              <div className="lg:col-span-5 flex flex-col min-h-[500px]">
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
