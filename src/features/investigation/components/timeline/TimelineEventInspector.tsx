import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../../stores/investigator-store.ts';
import { 
  Clock, Hash, Copy, Check, Network, ShieldCheck, Target, ExternalLink
} from 'lucide-react';
import { MitreBadge } from '../../../../components/ui/MitreBadge.tsx';

export const TimelineEventInspector: React.FC = () => {
  const { selectedTimelineEvent, graphNodes } = useInvestigator();
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  if (!selectedTimelineEvent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-[#070b14] h-full">
        <Clock className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wide">No Event Selected</p>
        <p className="text-xs mt-1">Select an event from the timeline to view details.</p>
      </div>
    );
  }

  const evt = selectedTimelineEvent;

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const getSeverityBadgeStyle = (relevance: string) => {
    switch (relevance.toUpperCase()) {
      case 'CRITICAL': return 'text-rose-600 dark:text-rose-400 border-rose-500/40 bg-rose-50 dark:bg-[#070b14]';
      case 'HIGH': return 'text-orange-600 dark:text-orange-400 border-orange-500/40 bg-orange-50 dark:bg-[#070b14]';
      case 'MEDIUM': return 'text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-50 dark:bg-[#070b14]';
      case 'LOW': return 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#070b14]';
      default: return 'text-[#08B4ED] border-[#08B4ED]/40 bg-cyan-50/50 dark:bg-[#070b14]';
    }
  };

  // Find associated node
  const associatedNode = (() => {
    if (evt.associated_entity_id) {
      const node = graphNodes.find((n) => n.id === evt.associated_entity_id || n.value.toLowerCase() === evt.associated_entity_id?.toLowerCase());
      if (node) return node;
    }
    return graphNodes.find((n) => n.value && n.value.length > 4 && evt.summary.toLowerCase().includes(n.value.toLowerCase()));
  })();

  const handleHighlightInGraph = () => {
    if (associatedNode) {
      investigatorStore.selectEntity(associatedNode);
    }
  };

  const handleOpenEvidence = () => {
    if (evt.evidence_id) {
      const ev = investigatorStore.getSnapshot().caseEvidence.find((e) => e.evidence_id === evt.evidence_id);
      if (ev) {
        investigatorStore.selectEvidence(ev);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0c1322] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0a0f1d]">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadgeStyle(evt.relevance)}`}>
            {evt.relevance} SEVERITY
          </span>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 font-mono">
            {new Date(evt.timestamp).toUTCString().replace('GMT', 'UTC')}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{evt.event_type}</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Event Summary</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#070b14] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            {evt.summary}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#0a0f1d] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Forensic Source</h3>
            <div className="font-mono text-sm text-slate-800 dark:text-slate-200 font-semibold">{evt.source_ref}</div>
          </div>
          
          <div className="bg-white dark:bg-[#0a0f1d] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Threat Tactic</h3>
            {evt.mitre_technique ? (
              <MitreBadge technique={evt.mitre_technique} />
            ) : (
              <span className="text-xs text-slate-500 italic">No MITRE ATT&CK technique mapped</span>
            )}
          </div>
        </div>

        {/* Evidence Link */}
        <div className="bg-slate-50 dark:bg-[#0a0f1d] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Cryptographic Proof</span>
            {evt.evidence_id && (
              <button 
                onClick={handleOpenEvidence}
                className="text-[10px] text-[#08B4ED] hover:underline flex items-center gap-1 font-bold"
              >
                Inspect Original Evidence <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </h3>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-700 dark:text-slate-300">
            <Hash className="w-4 h-4 text-slate-400" />
            <span className="break-all">{evt.evidence_hash}</span>
            <button
              type="button"
              onClick={() => handleCopyHash(evt.evidence_hash, evt.event_id)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white ml-auto shrink-0"
            >
              {copiedHashId === evt.event_id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
          {associatedNode && (
            <button 
              onClick={handleHighlightInGraph}
              className="px-4 py-2 text-xs font-bold rounded bg-slate-100 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/40 hover:bg-cyan-50 dark:hover:bg-[#0f172a] transition-colors flex items-center gap-1.5"
            >
              <Network className="w-4 h-4" /> Pivot to Graph Entity
            </button>
          )}
          
          {evt.evidence_id && (
            <button 
              onClick={handleOpenEvidence}
              className="px-4 py-2 text-xs font-bold rounded bg-slate-100 dark:bg-[#070b14] text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Verify Evidence Record
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
