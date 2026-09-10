import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useUI, uiStore } from '../../../stores/ui-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import {
  X,
  ExternalLink,
  ShieldAlert,
  Clock,
  Layers,
  Search,
  Plus,
  ArrowRight,
  Hash,
  Globe,
  Mail,
  Server,
  Link2,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Copy,
  Check,
  Compass,
  FileCheck,
  Download,
  Share2,
} from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import { MitreBadge } from '../../../components/ui/MitreBadge.tsx';

export const EntityProfileDrawer: React.FC = () => {
  const {
    selectedEntity,
    isEntityProfileOpen,
    timelineEvents,
    relatedCases,
    caseEvidence,
    geographicHops,
    graphEdges,
    graphNodes,
    isExpandingNode,
  } = useInvestigator();

  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';

  const [copied, setCopied] = useState(false);

  if (!isEntityProfileOpen || !selectedEntity) return null;

  const handleCopyValue = () => {
    navigator.clipboard.writeText(selectedEntity.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find occurrences of this entity in timeline events
  const timelineMatches = timelineEvents.filter(
    (e) =>
      e.associated_entity_id === selectedEntity.id ||
      (selectedEntity.value && e.summary.toLowerCase().includes(selectedEntity.value.toLowerCase()))
  );

  // Find associated evidence items
  const evidenceMatches = caseEvidence.filter(
    (ev) =>
      (selectedEntity.value && (ev.description.includes(selectedEntity.value) || ev.immutable_raw_snippet?.includes(selectedEntity.value))) ||
      (ev.source_ref && ev.source_ref.includes(selectedEntity.value))
  );

  // Find connected neighbor nodes in graph
  const connectedNeighbors = graphEdges
    .filter((e) => e.source === selectedEntity.id || e.target === selectedEntity.id)
    .map((e) => {
      const neighborId = e.source === selectedEntity.id ? e.target : e.source;
      return {
        edgeLabel: e.label,
        node: graphNodes.find((n) => n.id === neighborId),
      };
    })
    .filter((item): item is { edgeLabel: string; node: typeof graphNodes[0] } => Boolean(item.node));

  // Find matching geographic telemetry if IP or domain
  const matchingHop = geographicHops.find(
    (h) =>
      h.ip.toLowerCase() === selectedEntity.value.toLowerCase() ||
      (h.hostname && h.hostname.toLowerCase().includes(selectedEntity.value.toLowerCase()))
  );

  const riskVerdict = selectedEntity.reputation === 'malicious' ? 'CRITICAL' : selectedEntity.reputation === 'suspicious' ? 'HIGH' : 'LOW';

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#0c1322] border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col animate-slideInRight select-none">
      {/* Drawer Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0a0f1d] shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-cyan-50 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/50">
              {selectedEntity.type}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Depth {selectedEntity.depth} Hop</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <h3 className="text-sm font-mono font-bold text-slate-900 dark:text-white break-all truncate max-w-[280px]" title={selectedEntity.value}>
              {selectedEntity.value}
            </h3>
            <button
              type="button"
              onClick={handleCopyValue}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Copy Forensic Indicator"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => investigatorStore.closeEntityProfile()}
          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close entity profile drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-slate-50/30 dark:bg-transparent">
        {/* 1. Core Investigation Metrics (Risk, Reputation, Confidence) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Risk Level
            </span>
            <span className={`text-xs font-mono font-bold mt-1 block ${riskVerdict === 'CRITICAL' ? 'text-rose-600 dark:text-rose-400' : riskVerdict === 'HIGH' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {riskVerdict}
            </span>
          </div>

          <div className="p-2.5 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Reputation
            </span>
            <div className="mt-1">
              <SeverityBadge
                severity={selectedEntity.reputation || 'Unknown'}
                size="sm"
                showDot
              />
            </div>
          </div>

          <div className="p-2.5 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Confidence
            </span>
            <span className="text-xs font-mono font-bold text-[#08B4ED] mt-1 block">
              {selectedEntity.confidence ? `${selectedEntity.confidence}%` : 'Unscored'}
            </span>
          </div>
        </div>

        {/* 2. Geolocation / Infrastructure Telemetry (if available) */}
        {matchingHop && (
          <div className="p-3 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px] shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800/80 pb-1 mb-1">
              <span>Origin Infrastructure Telemetry</span>
              <span className="text-[#08B4ED]">Hop #{matchingHop.hop_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Location:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{matchingHop.city || 'Unknown'}, {matchingHop.country}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">ASN:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{matchingHop.asn || 'AS205100'} ({matchingHop.isp || 'ColoCrossing'})</span>
            </div>
            {matchingHop.is_tor && (
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold">
                <span>Routing Node:</span>
                <span>Tor Exit Node Detected</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Observation Window */}
        <div className="p-3 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">First Observed:</span>
            <span className="text-slate-750 dark:text-slate-200">
              {selectedEntity.first_seen ? new Date(selectedEntity.first_seen).toUTCString() : 'Initial Case Specimen'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Last Resolved:</span>
            <span className="text-slate-750 dark:text-slate-200">
              {selectedEntity.last_seen ? new Date(selectedEntity.last_seen).toUTCString() : 'Current Specimen'}
            </span>
          </div>
        </div>

        {/* 4. Connected Relationships */}
        <div>
          <h4 className="font-mono font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase text-[10px] tracking-wider flex items-center justify-between">
            <span>Connected Entities in Case</span>
            <span className="text-[#08B4ED]">{connectedNeighbors.length} connected</span>
          </h4>
          {connectedNeighbors.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic p-2.5 bg-white dark:bg-[#070b14] rounded border border-slate-200 dark:border-slate-800">
              Root entity specimen or isolated node.
            </p>
          ) : (
            <div className="space-y-1.5">
              {connectedNeighbors.map(({ edgeLabel, node }) => (
                <div
                  key={node.id}
                  onClick={() => investigatorStore.selectEntity(node)}
                  className="p-2 rounded bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 hover:border-[#08B4ED]/60 flex items-center justify-between transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="min-w-0 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-[9.5px] text-slate-600 dark:text-slate-400 uppercase font-bold px-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      {node.type}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{node.value}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                    {edgeLabel} →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. First-Class Forensic Pivot Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-mono font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider">
            First-Class Investigator Pivots
          </h4>

          {/* Expand Graph (+1 Hop) */}
          <button
            type="button"
            onClick={() => investigatorStore.expandNode(selectedEntity.id, tenantId)}
            disabled={isExpandingNode}
            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-[#08B4ED]/50 transition-colors cursor-pointer text-left font-mono shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#08B4ED]" />
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{isExpandingNode ? 'Expanding Relationships...' : 'Expand Graph Depth (+1 Hop)'}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Bounded</span>
          </button>

          {/* Focus on Geolocation Map (if hop exists) */}
          {matchingHop && (
            <button
              type="button"
              onClick={() => investigatorStore.selectGeoHop(matchingHop)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-[#08B4ED]/50 transition-colors cursor-pointer text-left font-mono shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#08B4ED]" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">Pivot to Map Trajectory</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* View Associated Evidence */}
          <button
            type="button"
            onClick={() => {
              if (evidenceMatches[0]) {
                investigatorStore.selectEvidence(evidenceMatches[0]);
              } else {
                investigatorStore.openEvidenceInspector(true);
              }
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-[#08B4ED]/50 transition-colors cursor-pointer text-left font-mono shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-800 dark:text-slate-200 font-semibold">View Associated Evidence Records</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {evidenceMatches.length} Items
            </span>
          </button>

          {/* Drill down to Email Entity */}
          {selectedEntity.type === 'Email' && (
            <button
              type="button"
              onClick={() => investigatorStore.openEmailEntityModal(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-[#08B4ED]/50 transition-colors cursor-pointer text-left font-mono shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#08B4ED]" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">Drill Down to RFC 5322 Headers</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Link Entity with Related Case */}
          <button
            type="button"
            onClick={() => {
              investigatorStore.closeEntityProfile();
              investigatorStore.openLinkModal(true);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-[#08B4ED]/50 transition-colors cursor-pointer text-left font-mono shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
              <span className="text-slate-800 dark:text-slate-200 font-semibold">Link Entity to Another Case</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* 6. Timeline Correlation Matches */}
        <div>
          <h4 className="font-mono font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase text-[10px] tracking-wider flex items-center justify-between">
            <span>Timeline Correlation Matches</span>
            <span className="text-slate-500 dark:text-slate-400">{timelineMatches.length} events</span>
          </h4>
          {timelineMatches.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic p-3 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
              No timeline events directly reference this indicator.
            </p>
          ) : (
            <div className="space-y-2 font-mono">
              {timelineMatches.map((e) => (
                <div
                  key={e.event_id}
                  onClick={() => investigatorStore.selectTimelineEvent(e)}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:border-[#08B4ED]/60 transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{e.event_type}</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">
                      {new Date(e.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 font-sans">{e.summary}</p>
                  {e.mitre_technique && (
                    <div className="mt-2">
                      <MitreBadge technique={e.mitre_technique} size="sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
