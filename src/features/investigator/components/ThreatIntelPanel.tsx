import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { ShieldAlert, AlertTriangle, Globe, Radio, Power, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import { MitreBadge } from '../../../components/ui/MitreBadge.tsx';

export const ThreatIntelPanel: React.FC = () => {
  const { threatIntel, isThreatIntelOffline, isLoadingTI, errorTI } = useInvestigator();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs font-mono select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#070b14] border border-[#08B4ED]/40 text-[#08B4ED] flex items-center justify-center font-bold">
            <Radio className="w-3.5 h-3.5 text-[#08B4ED]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Threat Intelligence Telemetry & Enrichment</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/30 font-normal">
                Level 4 Enrichment
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Resilience Simulation: Toggle TI Online/Offline */}
          <button
            type="button"
            onClick={() => investigatorStore.toggleThreatIntelOffline()}
            className={`px-2 py-1 rounded text-[10.5px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isThreatIntelOffline
                ? 'bg-rose-50 dark:bg-[#070b14] border-rose-500/40 text-rose-600 dark:text-rose-400'
                : 'bg-emerald-50 dark:bg-[#070b14] border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
            }`}
            title="Toggle simulated Threat Intel feed outage to verify workspace resilience"
          >
            <Power className="w-3 h-3" />
            <span>{isThreatIntelOffline ? 'Feed Offline (Simulated)' : 'Feed Online'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Toggle Threat Intel panel"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-transparent">
          {isLoadingTI && (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs">
              <div className="w-5 h-5 rounded-full border-2 border-[#08B4ED] border-t-transparent animate-spin mx-auto mb-1" />
              <span>Querying global IOC reputation telemetry...</span>
            </div>
          )}

          {/* Graceful Fallback when Threat Intelligence is Offline */}
          {(isThreatIntelOffline || errorTI) && (
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  External Threat Intelligence Telemetry Offline
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed font-sans">
                  Third-party IOC reputation service is currently unavailable.
                  <span className="font-semibold text-slate-600 dark:text-slate-300 ml-1">
                    Timeline, Graph, Forensic Evidence Ledger, and Case Actions remain fully operational.
                  </span>
                </p>
              </div>
            </div>
          )}

          {!isLoadingTI && !isThreatIntelOffline && !errorTI && threatIntel && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Primary Indicator</span>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-0.5 break-all">
                    {threatIntel.indicator}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Reputation Verdict</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <SeverityBadge
                      severity={threatIntel.reputation}
                      showDot
                      pulse={threatIntel.reputation === 'MALICIOUS'}
                      size="sm"
                    />
                    <span className="text-[11px] text-[#08B4ED] font-semibold">
                      ({threatIntel.confidence}% Confidence)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Threat Feed Provider</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                    {threatIntel.source}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Enrichment Summary:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans text-[11.5px]">
                  {threatIntel.summary}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                  {threatIntel.tags.map((tag) => (
                    tag.match(/^T\d{4}/i) ? (
                      <MitreBadge key={tag} technique={tag} size="sm" />
                    ) : (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-[#0c1322] text-[#08B4ED] border border-[#08B4ED]/30 text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    )
                  ))}
                </div>

                {/* SIH DEMO 26106: Threat Intelligence Pivots */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const snap = investigatorStore.getSnapshot();
                      const node = snap.graphNodes.find(n => n.value.toLowerCase() === threatIntel.indicator.toLowerCase());
                      if (node) {
                        investigatorStore.selectEntity(node);
                        uiStore.navigate('/investigator');
                      }
                    }}
                    className="px-3 py-1.5 text-[10px] font-bold rounded bg-slate-50 dark:bg-[#0a0f1d] text-slate-700 dark:text-slate-300 hover:border-[#08B4ED]/50 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Open in Graph
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                       const snap = investigatorStore.getSnapshot();
                       const ev = snap.timelineEvents.find(e => e.summary.toLowerCase().includes(threatIntel.indicator.toLowerCase()));
                       if (ev) {
                          investigatorStore.selectTimelineEvent(ev);
                          uiStore.navigate('/investigator');
                       }
                    }}
                    className="px-3 py-1.5 text-[10px] font-bold rounded bg-slate-50 dark:bg-[#0a0f1d] text-slate-700 dark:text-slate-300 hover:border-purple-500/50 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Open Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                       const snap = investigatorStore.getSnapshot();
                       const ev = snap.caseEvidence.find(e => e.title.toLowerCase().includes(threatIntel.indicator.toLowerCase()) || e.description.toLowerCase().includes(threatIntel.indicator.toLowerCase()));
                       if (ev) {
                         investigatorStore.selectEvidence(ev);
                       } else {
                         investigatorStore.openEvidenceInspector(true);
                       }
                    }}
                    className="px-3 py-1.5 text-[10px] font-bold rounded bg-slate-50 dark:bg-[#0a0f1d] text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    View Evidence
                  </button>
                  <button
                    type="button"
                    onClick={() => uiStore.navigate('/reports')}
                    className="px-3 py-1.5 text-[10px] font-bold rounded bg-slate-50 dark:bg-[#0a0f1d] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Add to Report
                  </button>
                </div>
              </div>

              {/* Provenance Disclaimer */}
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                <Info className="w-3.5 h-3.5 text-[#08B4ED]" />
                <span>
                  Threat intelligence is Level 4 supplementary enrichment. Observed forensic evidence (Level 3) remains the primary basis for disposition.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DEDICATED GRAPH PAGE COMPONENTS (GraphToolbar, RelationshipInspector, EntityInspectorPanel, GraphInvestigationPage)
// ============================================================================

import {
  Search,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Hash,
  Copy,
  Check,
  Plus,
  ArrowRight,
  SplitSquareVertical,
  Clock,
  Compass,
  FileCode,
  Briefcase,
  Terminal,
  Filter,
  Eye,
  EyeOff,
  Sparkles,
  Network,
  X,
} from 'lucide-react';
import { useAuth } from '../../../stores/auth-store.ts';
import { useUI, uiStore } from '../../../stores/ui-store.ts';
import { GraphNode, GraphEdge } from '../../../domain/investigator.ts';
import { EntityRelationshipGraph } from './EntityRelationshipGraph.tsx';
import { EvidencePanel } from './EvidencePanel.tsx';
import { EntityProfileDrawer } from './EntityProfileDrawer.tsx';
import { LinkCaseModal } from './LinkCaseModal.tsx';
import { MergeCampaignModal } from './MergeCampaignModal.tsx';
import { EscalateModal } from './EscalateModal.tsx';
import { EmailEntityModal } from './EmailEntityModal.tsx';

/**
 * 1. GRAPH INVESTIGATION TOOLBAR
 */
export const GraphToolbar: React.FC<{
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSelect: (nodeId: string) => void;
}> = ({ searchQuery, setSearchQuery, onSearchSelect }) => {
  const {
    currentCase,
    currentCaseId,
    graphNodes,
    graphEdges,
    graphFilterType,
    graphDepth,
    isolatedNodeId,
    selectedEntity,
  } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id ;

  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchMatches = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return graphNodes.filter(
      (n) =>
        n.value.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        (n.attributes && Object.values(n.attributes).some((v) => String(v).toLowerCase().includes(q)))
    );
  }, [graphNodes, searchQuery]);

  return (
    <div className="bg-white dark:bg-[#0c1322] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none font-mono text-xs">
      {/* Left: Investigation Context & Search */}
      <div className="flex flex-wrap items-center gap-2.5 min-w-0 flex-1">
        {/* Compact Case Badge */}
        <button
          type="button"
          onClick={() => uiStore.navigate('/investigator')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] hover:border-[#08B4ED]/60 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer shadow-xs"
          title="Return to Primary Investigator Workspace"
        >
          <Briefcase className="w-3.5 h-3.5 text-[#08B4ED]" />
          <span>Case #{currentCaseId}</span>
        </button>

        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

        {/* Security Artifact Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 focus-within:border-[#08B4ED]/70 transition-colors shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search IP, Domain, URL, Hash, MITRE..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && searchMatches.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-[#08B4ED]/50 rounded-lg shadow-2xl max-h-60 overflow-y-auto p-1 font-mono">
              <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100 dark:border-slate-800">
                Matching Entities ({searchMatches.length})
              </div>
              {searchMatches.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    onSearchSelect(node.id);
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-cyan-50 dark:hover:bg-[#070b14] flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {node.value}
                  </span>
                  <span className="text-[10px] text-[#08B4ED] font-semibold shrink-0">
                    {node.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entity Type Filter */}
        <select
          aria-label="Filter graph by entity type"
          value={graphFilterType || 'ALL'}
          onChange={(e) => investigatorStore.setGraphFilterType(e.target.value === 'ALL' ? null : e.target.value)}
          className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs outline-none cursor-pointer hover:border-[#08B4ED]/50 transition-colors shadow-2xs"
        >
          <option value="ALL">All Entity Types</option>
          <option value="Email">Email Specimen</option>
          <option value="Sender">Sender</option>
          <option value="Recipient">Recipient</option>
          <option value="Domain">Domain</option>
          <option value="URL">URL</option>
          <option value="Source IP">Source IP</option>
          <option value="Attachment">Attachment</option>
          <option value="Threat Intelligence Indicator">Threat Intel</option>
          <option value="Related Case">Related Case</option>
        </select>
      </div>

      {/* Right: Depth & Focus Controls */}
      <div className="flex items-center gap-2">
        {/* Hop Depth Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#070b14] p-0.5 rounded-md border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5">Depth:</span>
          {[1, 2, 3].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => investigatorStore.setGraphDepth(d, tenantId)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-all cursor-pointer ${
                graphDepth === d
                  ? 'bg-white dark:bg-[#0c1322] text-[#08B4ED] border border-[#08B4ED]/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {d} Hop{d > 1 ? 's' : ''}
            </button>
          ))}
        </div>

        {/* Isolate / Focus Selected Entity Mode Toggle */}
        <button
          type="button"
          disabled={!selectedEntity}
          onClick={() => {
            if (!selectedEntity) return;
            investigatorStore.setIsolatedNode(isolatedNodeId === selectedEntity.id ? null : selectedEntity.id);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
            isolatedNodeId
              ? 'bg-[#08B4ED]/15 border-[#08B4ED] text-[#08B4ED] font-bold shadow-xs'
              : selectedEntity
              ? 'bg-white dark:bg-[#070b14] border-slate-200 dark:border-slate-800 hover:border-[#08B4ED]/50 text-slate-700 dark:text-slate-300'
              : 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-[#070b14] border-slate-200 dark:border-slate-800 text-slate-400'
          }`}
          title="Isolate selected entity and its direct connections"
        >
          {isolatedNodeId ? <EyeOff className="w-3.5 h-3.5 text-[#08B4ED]" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isolatedNodeId ? 'Isolated' : 'Isolate Focus'}</span>
        </button>

        {/* Reset Selection */}
        {(selectedEntity || isolatedNodeId || graphFilterType) && (
          <button
            type="button"
            onClick={() => {
              investigatorStore.selectEntity(null);
              investigatorStore.selectEdge(null);
              investigatorStore.setIsolatedNode(null);
              investigatorStore.setGraphFilterType(null);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Reset Filters and Selections"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * 2. RELATIONSHIP INSPECTOR PANEL (Docked bottom)
 * Answers: "Why does AShieldER believe these two entities are connected?"
 */
export const RelationshipInspector: React.FC = () => {
  const { selectedEdge, graphNodes, caseEvidence, timelineEvents } = useInvestigator();
  const [copiedRecord, setCopiedRecord] = useState(false);

  if (!selectedEdge) return null;

  const sourceNode = graphNodes.find((n) => n.id === selectedEdge.source);
  const targetNode = graphNodes.find((n) => n.id === selectedEdge.target);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(true);
    setTimeout(() => setCopiedRecord(false), 2000);
  };

  const getProvenanceBadge = (prov?: string) => {
    switch (prov) {
      case 'OBSERVED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
            <ShieldCheck className="w-3 h-3" />
            <span>Observed Forensic Evidence</span>
          </span>
        );
      case 'ENRICHED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-50 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/40">
            <Sparkles className="w-3 h-3" />
            <span>Enriched Telemetry</span>
          </span>
        );
      case 'INFERRED':
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" />
            <span>Inferred AI Correlation</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c1322] border-t-2 border-[#08B4ED] px-4 py-3 select-none font-mono text-xs shadow-lg animate-slideInUp">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 max-w-[1850px] mx-auto">
        {/* Left: Source -> Relationship -> Target Chain */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 font-bold">Source:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
              {sourceNode?.value || selectedEdge.source}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#08B4ED] font-bold">
            <ArrowRight className="w-4 h-4" />
            <span className="px-2 py-0.5 rounded bg-cyan-50/70 dark:bg-[#070b14] border border-[#08B4ED]/40 text-[#08B4ED] text-[11px]">
              {selectedEdge.label}
            </span>
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 font-bold">Target:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
              {targetNode?.value || selectedEdge.target}
            </span>
          </div>

          {getProvenanceBadge(selectedEdge.provenance)}
        </div>

        {/* Center: Provenance Metadata & Evidence Source */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          {selectedEdge.evidence_source && (
            <span>
              Source: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{selectedEdge.evidence_source}</strong>
            </span>
          )}
          <span>•</span>
          <span>
            Confidence: <strong className="text-[#08B4ED] font-semibold">{Math.round((selectedEdge.confidence || 0.95) * 100)}%</strong>
          </span>
          {selectedEdge.observed_at && (
            <>
              <span>•</span>
              <span>Observed: {new Date(selectedEdge.observed_at).toUTCString().replace('GMT', 'UTC')}</span>
            </>
          )}
        </div>

        {/* Right: Forensic Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {selectedEdge.evidence_id && (
            <button
              type="button"
              onClick={() => {
                const ev = caseEvidence.find((e) => e.evidence_id === selectedEdge.evidence_id);
                if (ev) investigatorStore.selectEvidence(ev);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-500/40 bg-emerald-50/50 dark:bg-[#070b14] hover:bg-emerald-100/60 text-emerald-600 dark:text-emerald-400 font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inspect Supporting Evidence</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              // Highlight path in timeline
              const evt = timelineEvents.find(
                (e) =>
                  e.associated_entity_id === selectedEdge.source ||
                  e.associated_entity_id === selectedEdge.target ||
                  (sourceNode && e.summary.toLowerCase().includes(sourceNode.value.toLowerCase()))
              );
              if (evt) {
                investigatorStore.selectTimelineEvent(evt);
                uiStore.navigate('/investigator');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:bg-slate-50 dark:hover:bg-[#0f172a] text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            <span>Open in Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => investigatorStore.selectEdge(null)}
            className="p-1 rounded-md border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Close Relationship Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. DEDICATED RIGHT-SIDE ENTITY INSPECTOR PANEL
 */
export const EntityInspectorPanel: React.FC = () => {
  const {
    selectedEntity,
    timelineEvents,
    geographicHops,
    caseEvidence,
    graphEdges,
    graphNodes,
    isExpandingNode,
  } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id ;

  const [copiedValue, setCopiedValue] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(true);
    setTimeout(() => setCopiedValue(false), 2000);
  };

  // When no entity is selected
  if (!selectedEntity) {
    return (
      <div className="h-full bg-white dark:bg-[#0c1322] border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center select-none font-mono">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <Network className="w-6 h-6 text-[#08B4ED]" />
        </div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
          Select an Entity
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs font-sans leading-relaxed">
          Choose an entity node or relationship edge from the relationship graph canvas to inspect connections, evidence provenance, and intelligence pivots.
        </p>
      </div>
    );
  }

  // Connected 1-hop neighbor count and nodes
  const connectedEdges = graphEdges.filter(
    (e) => e.source === selectedEntity.id || e.target === selectedEntity.id
  );
  const neighborNodes = connectedEdges
    .map((e) => {
      const neighborId = e.source === selectedEntity.id ? e.target : e.source;
      return graphNodes.find((n) => n.id === neighborId);
    })
    .filter((n): n is GraphNode => Boolean(n));

  // Matching geographic hop if IP/hostname
  const matchingHop = geographicHops.find(
    (h) =>
      h.ip.toLowerCase() === selectedEntity.value.toLowerCase() ||
      (h.hostname && h.hostname.toLowerCase().includes(selectedEntity.value.toLowerCase()))
  );

  // Matching timeline events
  const matchingTimelineEvents = timelineEvents.filter(
    (e) =>
      e.associated_entity_id === selectedEntity.id ||
      (selectedEntity.value && e.summary.toLowerCase().includes(selectedEntity.value.toLowerCase()))
  );

  return (
    <div className="h-full bg-white dark:bg-[#0c1322] border-l border-slate-200 dark:border-slate-800 flex flex-col select-none font-mono overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f1d] shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-50 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/40">
            {selectedEntity.type}
          </span>
          <button
            type="button"
            onClick={() => investigatorStore.selectEntity(null)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
            title="Deselect Entity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 break-all">
            {selectedEntity.value}
          </h3>
          <button
            type="button"
            onClick={() => handleCopy(selectedEntity.value)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 shrink-0"
            title="Copy Indicator"
          >
            {copiedValue ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Risk</span>
            <span
              className={`text-xs font-extrabold mt-0.5 block ${
                selectedEntity.reputation === 'malicious'
                  ? 'text-rose-600 dark:text-rose-400'
                  : selectedEntity.reputation === 'suspicious'
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
            >
              {selectedEntity.reputation?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Confidence</span>
            <span className="text-xs font-extrabold text-[#08B4ED] mt-0.5 block">
              {selectedEntity.confidence || 94}%
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Depth</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">
              {selectedEntity.depth || 1} Hop
            </span>
          </div>
        </div>

        {/* Infrastructure & Telemetry Details */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-200 dark:border-slate-800 pb-1">
            Infrastructure Telemetry
          </span>
          {matchingHop && (
            <>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{matchingHop.city ? `${matchingHop.city}, ` : ''}{matchingHop.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ASN:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{matchingHop.asn || 'AS205100'}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">First Seen:</span>
            <span className="text-slate-700 dark:text-slate-300">08 Sep 2026 08:14 UTC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Last Seen:</span>
            <span className="text-slate-700 dark:text-slate-300">08 Sep 2026 08:14 UTC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Connected Entities:</span>
            <span className="font-bold text-[#08B4ED]">{connectedEdges.length} nodes</span>
          </div>
        </div>

        {/* 1-Click Forensic Pivot Menu */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Investigation Pivots
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {/* Expand 1-Hop Neighbors */}
            <button
              type="button"
              disabled={isExpandingNode}
              onClick={() => investigatorStore.expandNode(selectedEntity.id, tenantId)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:border-[#08B4ED]/50 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-[#08B4ED]" />
                <span className="font-semibold">Expand +1 Hop Relations</span>
              </div>
              <span className="text-[10px] text-slate-400">Discover</span>
            </button>

            {/* Pivot to Origin Map */}
            {matchingHop && (
              <button
                type="button"
                onClick={() => {
                  investigatorStore.selectGeoHop(matchingHop);
                  uiStore.navigate('/investigator');
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:border-[#08B4ED]/50 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-sky-500" />
                  <span className="font-semibold">Locate on Origin Map</span>
                </div>
                <span className="text-[10px] text-slate-400">{matchingHop.country}</span>
              </button>
            )}

            {/* Pivot to Timeline */}
            {matchingTimelineEvents.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  investigatorStore.selectTimelineEvent(matchingTimelineEvents[0]);
                  uiStore.navigate('/investigator');
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:border-[#08B4ED]/50 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span className="font-semibold">View in Timeline</span>
                </div>
                <span className="text-[10px] text-purple-400 font-bold">
                  {matchingTimelineEvents.length} Events
                </span>
              </button>
            )}

            {/* Inspect Dossier */}
            <button
              type="button"
              onClick={() => investigatorStore.selectEntity(selectedEntity)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-[#08B4ED]/40 bg-cyan-50/50 dark:bg-[#070b14] hover:bg-cyan-100/60 dark:hover:bg-[#0f172a] text-[#08B4ED] font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Forensic Dossier</span>
              </div>
              <span className="text-[10px]">Inspect →</span>
            </button>
          </div>
        </div>

        {/* Connected Neighbors List */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Direct 1-Hop Neighbors ({neighborNodes.length})
          </span>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {neighborNodes.map((neighbor) => (
              <button
                key={neighbor.id}
                type="button"
                onClick={() => investigatorStore.selectEntity(neighbor)}
                className="w-full text-left px-2 py-1 rounded bg-slate-50 dark:bg-[#070b14] hover:bg-slate-100 dark:hover:bg-[#0f172a] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1.5 text-[11px] transition-colors cursor-pointer"
              >
                <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                  {neighbor.value}
                </span>
                <span className="text-[9.5px] text-[#08B4ED] font-semibold shrink-0">
                  {neighbor.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. DEDICATED GRAPH INVESTIGATION PAGE (/investigator/graph)
 */
export const GraphInvestigationPage: React.FC = () => {
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id ;
  const { currentCaseId, selectedEdge } = useInvestigator();

  const [searchQuery, setSearchQuery] = useState('');

  // Initialize workspace data on mount if needed
  React.useEffect(() => {
    investigatorStore.initWorkspace(tenantId);
  }, [tenantId]);

  const handleSearchSelect = (nodeId: string) => {
    const node = investigatorStore.getSnapshot().graphNodes.find((n) => n.id === nodeId);
    if (node) {
      investigatorStore.selectEntity(node);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#f4f7fb] dark:bg-[#070b14] select-none text-slate-800 dark:text-slate-200 overflow-hidden transition-colors">
      {/* 1. Investigation / Graph Toolbar */}
      <GraphToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSelect={handleSearchSelect}
      />

      {/* 2. Main Work Area: Canvas (Left 72%) + Entity Inspector (Right 28%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden items-stretch">
        {/* Left Canvas */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full overflow-hidden relative">
          <EntityRelationshipGraph />
        </div>

        {/* Right Entity Inspector */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-full overflow-hidden">
          <EntityInspectorPanel />
        </div>
      </div>

      {/* 3. Docked Relationship & Evidence Inspector (When an edge is selected) */}
      {selectedEdge && <RelationshipInspector />}

      {/* Overlays & Drawers */}
      <EvidencePanel />
      <EntityProfileDrawer />
      <EmailEntityModal />
      <LinkCaseModal />
      <MergeCampaignModal />
      <EscalateModal />
    </div>
  );
};
