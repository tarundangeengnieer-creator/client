import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../../stores/investigator-store.ts';
import { useAuth } from '../../../../stores/auth-store.ts';
import { EvidenceTypeCategory } from '../../../../domain/investigator.ts';
import { 
  FileCheck, Sparkles, Radio, User, Hash, Copy, Check, Lock, 
  MessageSquarePlus, CheckCircle2, XCircle, AlertCircle, Network, Clock
} from 'lucide-react';
import { MitreBadge } from '../../../../components/ui/MitreBadge.tsx';

export const EvidenceInspector: React.FC = () => {
  const { selectedEvidence, errorEvidence } = useInvestigator();
  const auth = useAuth();
  
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [annotatingEvidenceId, setAnnotatingEvidenceId] = useState<string | null>(null);
  const [annotationText, setAnnotationText] = useState('');

  if (errorEvidence) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-[#070b14]">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Evidence Vault Offline</p>
        <p className="text-xs mt-1">{errorEvidence}</p>
      </div>
    );
  }

  if (!selectedEvidence) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-[#070b14]">
        <FileCheck className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wide">No Evidence Selected</p>
        <p className="text-xs mt-1">Select a record from the ledger to inspect forensic details.</p>
      </div>
    );
  }

  const ev = selectedEvidence;

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleVerify = async (state: 'VERIFIED' | 'DISPUTED') => {
    await investigatorStore.verifyEvidence(ev.evidence_id, state, auth.currentUser?.name || 'Investigator', auth.currentTenant?.id || '');
  };

  const handleAddAnnotation = async () => {
    if (!annotationText.trim()) return;
    await investigatorStore.annotateEvidence(ev.evidence_id, annotationText.trim(), auth.currentUser?.name || 'Investigator', auth.currentTenant?.id || '');
    setAnnotationText('');
    setAnnotatingEvidenceId(null);
  };

  const getProvenanceLabel = (type: EvidenceTypeCategory) => {
    switch (type) {
      case 'RAW EVIDENCE': return 'OBSERVED EVIDENCE';
      case 'AI FINDING': return 'AI INTERPRETATION';
      case 'THREAT INTELLIGENCE': return 'THREAT INTEL';
      case 'ANALYST ANNOTATION': return 'ANALYST NOTE';
      default: return type;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0c1322] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0a0f1d] flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#070b14] text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {getProvenanceLabel(ev.type)}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              #{ev.evidence_id}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{ev.title}</h2>
        </div>

        {/* Verification Status */}
        <div>
          {ev.verification_state === 'VERIFIED' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-emerald-50 dark:bg-[#070b14] text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> VERIFIED
            </span>
          ) : ev.verification_state === 'DISPUTED' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-rose-50 dark:bg-[#070b14] text-rose-600 dark:text-rose-400 border border-rose-500/40">
              <XCircle className="w-4 h-4" /> DISPUTED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-[#070b14] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              UNVERIFIED
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Description & Provenance Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {ev.description}
              </p>
            </div>

            {/* Raw Artifact Data */}
            {ev.immutable_raw_snippet && (
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Raw Extracted Artifact
                </h3>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 overflow-x-auto whitespace-pre font-mono shadow-inner">
                  {ev.immutable_raw_snippet}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 bg-slate-50 dark:bg-[#0a0f1d] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Source</h3>
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{ev.source_ref}</div>
            </div>
            
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cryptographic Hash</h3>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[120px]">{ev.hash}</span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(ev.hash, ev.evidence_id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {copiedHashId === ev.evidence_id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observation Time</h3>
              <div className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {new Date(ev.collected_at).toUTCString()}
              </div>
            </div>
          </div>
        </div>

        {/* Annotations */}
        {ev.annotations.length > 0 && (
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Analyst Annotations</h3>
            <div className="space-y-3 pl-4 border-l-2 border-emerald-500/50">
              {ev.annotations.map((ann) => (
                <div key={ann.id} className="bg-emerald-50/40 dark:bg-[#070b14]/50 p-3 rounded-r border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{ann.author}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(ann.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{ann.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline Annotation Input */}
        {annotatingEvidenceId === ev.evidence_id && (
          <div className="p-4 bg-white dark:bg-[#070b14] rounded-lg border border-[#08B4ED]/50 shadow-sm">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">New Annotation:</label>
            <textarea
              rows={3}
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              placeholder="Record forensic observation..."
              className="w-full text-sm p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1627] outline-none focus:border-[#08B4ED]"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAnnotatingEvidenceId(null)}
                className="px-3 py-1.5 text-xs rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAnnotation}
                className="px-4 py-1.5 text-xs font-bold rounded bg-[#08B4ED] text-white hover:bg-sky-400"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Actions / Cross-Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleVerify('VERIFIED')}
              className="px-4 py-2 text-xs font-bold rounded bg-emerald-50 dark:bg-[#070b14] text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              Verify Evidence
            </button>
            <button
              onClick={() => handleVerify('DISPUTED')}
              className="px-4 py-2 text-xs font-bold rounded bg-rose-50 dark:bg-[#070b14] text-rose-600 dark:text-rose-400 border border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              Dispute
            </button>
            <button
              onClick={() => setAnnotatingEvidenceId(ev.evidence_id)}
              className="px-4 py-2 text-xs font-bold rounded bg-slate-100 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/40 hover:bg-cyan-50 dark:hover:bg-[#0f172a] transition-colors flex items-center gap-1.5"
            >
              <MessageSquarePlus className="w-4 h-4" /> Annotate
            </button>

            <div className="flex-1" />

            {/* Cross Navigation */}
            <button className="px-4 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-[#070b14] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
              <Network className="w-4 h-4" /> Find in Graph
            </button>
            <button className="px-4 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-[#070b14] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> View in Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
