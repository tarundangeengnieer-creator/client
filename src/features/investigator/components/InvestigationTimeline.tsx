import React, { useState, useMemo } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { TimelineEvent } from '../../../domain/investigator.ts';
import {
  Clock,
  Mail,
  Share2,
  MousePointerClick,
  FileCode,
  Terminal,
  ShieldAlert,
  UserCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Hash,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Network,
  Target,
} from 'lucide-react';
import { MitreBadge } from '../../../components/ui/MitreBadge.tsx';

export const InvestigationTimeline: React.FC = () => {
  const {
    timelineEvents,
    selectedTimelineEvent,
    selectedEntity,
    isLoadingTimeline,
    errorTimeline,
    graphNodes,
    caseEvidence,
  } = useInvestigator();

  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((e) => {
      // Category filter
      if (filterCategory !== 'ALL') {
        const type = e.event_type.toLowerCase();
        if (filterCategory === 'EMAIL' && !(type.includes('email') || type.includes('received-chain'))) return false;
        if (filterCategory === 'NETWORK' && !(type.includes('url') || type.includes('dns') || type.includes('ip') || type.includes('network'))) return false;
        if (filterCategory === 'ATTACHMENT' && !(type.includes('attachment') || type.includes('execution'))) return false;
        if (filterCategory === 'THREAT_INTEL' && !type.includes('threat')) return false;
        if (filterCategory === 'ANALYST' && !type.includes('analyst')) return false;
      }

      // Severity filter
      if (filterSeverity !== 'ALL' && e.relevance.toUpperCase() !== filterSeverity) {
        return false;
      }

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSummary = e.summary.toLowerCase().includes(q);
        const matchesType = e.event_type.toLowerCase().includes(q);
        const matchesMitre = e.mitre_technique ? e.mitre_technique.toLowerCase().includes(q) : false;
        const matchesSource = e.source_ref.toLowerCase().includes(q);
        if (!matchesSummary && !matchesType && !matchesMitre && !matchesSource) return false;
      }

      return true;
    });
  }, [timelineEvents, filterCategory, filterSeverity, searchQuery]);

  const handleCopyHash = (hash: string, eventId: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(eventId);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Email received':
        return <Mail className="w-3.5 h-3.5 text-[#08B4ED]" />;
      case 'Received-chain hop':
        return <Share2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'URL click':
        return <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />;
      case 'Attachment activity':
        return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
      case 'Execution indicator':
        return <Terminal className="w-3.5 h-3.5 text-rose-400" />;
      case 'Threat-intelligence enrichment':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case 'Analyst action':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadgeStyle = (relevance: string) => {
    switch (relevance.toUpperCase()) {
      case 'CRITICAL':
        return 'text-rose-600 dark:text-rose-400 border-rose-500/40 bg-rose-50 dark:bg-[#0c1322]';
      case 'HIGH':
        return 'text-orange-600 dark:text-orange-400 border-orange-500/40 bg-orange-50 dark:bg-[#0c1322]';
      case 'MEDIUM':
        return 'text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-50 dark:bg-[#0c1322]';
      case 'LOW':
        return 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/60 bg-slate-100 dark:bg-[#0c1322]';
      case 'INFO':
      default:
        return 'text-[#08B4ED] border-[#08B4ED]/40 bg-cyan-50/50 dark:bg-[#0c1322]';
    }
  };

  // Find associated node for a timeline event
  const findAssociatedNode = (evt: TimelineEvent) => {
    if (evt.associated_entity_id) {
      const node = graphNodes.find(
        (n) => n.id === evt.associated_entity_id || n.value.toLowerCase() === evt.associated_entity_id?.toLowerCase()
      );
      if (node) return node;
    }
    return graphNodes.find(
      (n) => n.value && n.value.length > 4 && evt.summary.toLowerCase().includes(n.value.toLowerCase())
    );
  };

  // Pivot from timeline event to graph node
  const handleHighlightInGraph = (evt: TimelineEvent) => {
    const node = findAssociatedNode(evt);
    if (node) {
      investigatorStore.selectEntity(node);
    }
  };

  // Pivot from timeline event to evidence record
  const handleOpenEvidence = (evidenceId?: string) => {
    if (!evidenceId) return;
    const ev = caseEvidence.find((e) => e.evidence_id === evidenceId);
    if (ev) {
      investigatorStore.selectEvidence(ev);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      {/* Timeline Header & Filter Bar */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#0c1322] border border-[#08B4ED]/40 text-[#08B4ED] flex items-center justify-center font-bold">
            <Clock className="w-3.5 h-3.5 text-[#08B4ED]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>Investigation Timeline</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-[#0c1322] text-[#08B4ED] border border-[#08B4ED]/30 font-normal">
                {timelineEvents.length} Chronological Events
              </span>
            </h3>
          </div>
        </div>

        {/* Compact Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Category Filter */}
          <select
            aria-label="Filter timeline by category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-[11px] font-mono font-medium bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-[#08B4ED]/40 transition-colors shadow-2xs"
          >
            <option value="ALL">All Categories</option>
            <option value="EMAIL">Email & Hops</option>
            <option value="NETWORK">Network & URL</option>
            <option value="ATTACHMENT">Attachment & Execution</option>
            <option value="THREAT_INTEL">Threat Intel</option>
            <option value="ANALYST">Analyst Notes</option>
          </select>

          {/* Severity Filter */}
          <select
            aria-label="Filter timeline by severity"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-[11px] font-mono font-medium bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-[#08B4ED]/40 transition-colors shadow-2xs"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Selected Entity Link Banner */}
      {selectedEntity && (
        <div className="px-4 py-1.5 bg-cyan-50/70 dark:bg-[#070b14] border-b border-cyan-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-[#08B4ED]" />
            <span>Filtering timeline focus for active entity:</span>
            <span className="font-bold text-slate-900 dark:text-white max-w-[180px] truncate">{selectedEntity.value}</span>
          </div>
          <button
            type="button"
            onClick={() => investigatorStore.selectEntity(null)}
            className="text-[#08B4ED] hover:underline cursor-pointer text-[10px] font-semibold"
          >
            Clear Focus
          </button>
        </div>
      )}

      {/* Timeline Content */}
      <div className="relative flex-1 overflow-y-auto p-4 bg-slate-50/40 dark:bg-[#060a14]">
        {/* Loading State */}
        {isLoadingTimeline && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full border-2 border-[#08B4ED] border-t-transparent animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
              Reconstructing chronological chain-of-custody...
            </span>
          </div>
        )}

        {/* Isolated Error State */}
        {errorTimeline && (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Investigation Timeline Unavailable
            </p>
            <p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">{errorTimeline}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingTimeline && !errorTimeline && filteredEvents.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 dark:text-slate-400">
            <Clock className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-2" />
            <p className="font-bold text-xs text-slate-700 dark:text-slate-300 font-mono">
              No timeline events matching filter
            </p>
            <p className="text-[11px] mt-0.5 font-mono">
              Reset filter criteria to view all forensic execution events.
            </p>
          </div>
        )}

        {/* Chronological Event Stream */}
        {!isLoadingTimeline && !errorTimeline && filteredEvents.length > 0 && (
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredEvents.map((evt) => {
              const isSelected = selectedTimelineEvent?.event_id === evt.event_id;

              // Check if related to active selectedEntity
              const isRelatedToSelectedEntity = Boolean(
                selectedEntity &&
                ((evt.associated_entity_id && (evt.associated_entity_id === selectedEntity.id || evt.associated_entity_id.toLowerCase() === selectedEntity.value.toLowerCase())) ||
                 (selectedEntity.value && selectedEntity.value.length > 3 && evt.summary.toLowerCase().includes(selectedEntity.value.toLowerCase())))
              );

              // Dim non-related events if an entity is selected
              const isDimmed = Boolean(selectedEntity && !isRelatedToSelectedEntity && !isSelected);

              const associatedNode = findAssociatedNode(evt);

              return (
                <div
                  key={evt.event_id}
                  onClick={() => investigatorStore.selectTimelineEvent(evt)}
                  className={`relative group cursor-pointer rounded-lg p-3 transition-all border ${
                    isSelected
                      ? 'bg-cyan-50/70 dark:bg-[#0f172a] border-[#08B4ED] shadow-[0_0_12px_rgba(8,180,237,0.18)]'
                      : isRelatedToSelectedEntity
                      ? 'bg-white dark:bg-[#0c1322] border-[#08B4ED]/70 border-l-4 border-l-[#08B4ED] shadow-xs'
                      : 'bg-white dark:bg-[#0c1322] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  } ${isDimmed ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
                >
                  {/* Timeline Bullet Node */}
                  <span
                    className={`absolute -left-[23px] top-3.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-[#08B4ED] border-white ring-2 ring-[#08B4ED]/40'
                        : isRelatedToSelectedEntity
                        ? 'bg-white dark:bg-[#0c1322] border-[#08B4ED]'
                        : 'bg-white dark:bg-[#0c1322] border-slate-400 dark:border-slate-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : isRelatedToSelectedEntity ? 'bg-[#08B4ED]' : 'bg-slate-400'}`} />
                  </span>

                  {/* 1. Header: Title, Severity, UTC Timestamp */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getEventIcon(evt.event_type)}
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                        {evt.event_type}
                      </span>
                      {isRelatedToSelectedEntity && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-[#070b14] border border-[#08B4ED]/50 text-[#08B4ED]">
                          Related Entity
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${getSeverityBadgeStyle(
                          evt.relevance
                        )}`}
                      >
                        {evt.relevance}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {new Date(evt.timestamp).toUTCString().replace('GMT', 'UTC')}
                      </span>
                    </div>
                  </div>

                  {/* 2. Concise Evidence Summary */}
                  <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {evt.summary}
                  </p>

                  {/* 3. Metadata strip: MITRE ATT&CK, Source, SHA-256 Hash */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Approved MITRE Tag */}
                      {evt.mitre_technique && (
                        <MitreBadge technique={evt.mitre_technique} size="sm" />
                      )}

                      {/* Source Reference Tag */}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        <span className="text-slate-400 dark:text-slate-500">source:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{evt.source_ref}</span>
                      </span>
                    </div>

                    {/* Cryptographic SHA-256 Hash */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyHash(evt.evidence_hash, evt.event_id);
                        }}
                        className="flex items-center gap-1 font-mono text-[9.5px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={`Copy Evidence Hash: ${evt.evidence_hash}`}
                      >
                        <Hash className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>{evt.evidence_hash.substring(0, 8)}...</span>
                        {copiedHashId === evt.event_id ? (
                          <Check className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 4. First-Class Investigator Actions */}
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {associatedNode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHighlightInGraph(evt);
                          }}
                          className="text-[11px] font-mono text-[#08B4ED] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Network className="w-3 h-3" />
                          <span>Highlight in Graph</span>
                        </button>
                      )}

                      {evt.evidence_id && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEvidence(evt.evidence_id);
                          }}
                          className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Inspect Evidence</span>
                        </button>
                      )}
                    </div>

                    {associatedNode && (
                      <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
                        Node: {associatedNode.type}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
