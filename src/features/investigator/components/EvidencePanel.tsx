import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { InvestigatorEvidence, EvidenceTypeCategory } from '../../../domain/investigator.ts';
import {
  Archive,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Copy,
  Check,
  Lock,
  MessageSquarePlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Search,
  Filter,
  ExternalLink,
  X,
  FileCheck,
  Sparkles,
  Radio,
  Layers,
} from 'lucide-react';

export const EvidencePanel: React.FC = () => {
  const { caseEvidence, selectedEvidence, isEvidenceInspectorOpen, isLoadingEvidence, errorEvidence } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';
  const author = auth.currentUser?.name || 'Ankit Sharma (Investigator)';

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  // Annotation dialog state
  const [annotatingEvidenceId, setAnnotatingEvidenceId] = useState<string | null>(null);
  const [annotationText, setAnnotationText] = useState('');

  if (!isEvidenceInspectorOpen) return null;

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleAddAnnotation = async (evidenceId: string) => {
    if (!annotationText.trim()) return;
    await investigatorStore.annotateEvidence(evidenceId, annotationText.trim(), author, tenantId);
    setAnnotationText('');
    setAnnotatingEvidenceId(null);
  };

  const handleVerify = async (evidenceId: string, state: 'VERIFIED' | 'DISPUTED') => {
    await investigatorStore.verifyEvidence(evidenceId, state, author, tenantId);
  };

  const filteredEvidence = caseEvidence.filter((e) => {
    if (filterCategory === 'ALL') return true;
    return e.type === filterCategory;
  });

  const getProvenanceBadge = (type: EvidenceTypeCategory) => {
    switch (type) {
      case 'RAW EVIDENCE':
        return {
          label: 'OBSERVED EVIDENCE',
          icon: <FileCheck className="w-3 h-3 text-[#08B4ED]" />,
          classes: 'bg-cyan-50/70 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/50',
          desc: 'Direct observed forensic artifact from network, headers, or MIME parser.',
        };
      case 'AI FINDING':
        return {
          label: 'AI INTERPRETATION',
          icon: <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />,
          classes: 'bg-amber-50 dark:bg-[#070b14] text-amber-600 dark:text-amber-400 border border-amber-500/40',
          desc: 'Machine-learning model inference / heuristic anomaly scoring.',
        };
      case 'THREAT INTELLIGENCE':
        return {
          label: 'THREAT INTEL ENRICHMENT',
          icon: <Radio className="w-3 h-3 text-purple-500 dark:text-purple-400" />,
          classes: 'bg-purple-50 dark:bg-[#070b14] text-purple-600 dark:text-purple-400 border border-purple-500/40',
          desc: 'External reputation, ASN registry, or advisory feed intelligence.',
        };
      case 'ANALYST ANNOTATION':
        return {
          label: 'ANALYST ANNOTATION',
          icon: <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
          classes: 'bg-emerald-50 dark:bg-[#070b14] text-emerald-600 dark:text-emerald-400 border border-emerald-500/40',
          desc: 'Human SOC investigator observation and forensic hypothesis.',
        };
      case 'CORRELATION RESULT':
        return {
          label: 'CORRELATION RESULT',
          icon: <Layers className="w-3 h-3 text-teal-600 dark:text-teal-400" />,
          classes: 'bg-teal-50 dark:bg-[#070b14] text-teal-600 dark:text-teal-400 border border-teal-500/40',
          desc: 'Multi-case historical telemetry correlation across tenants.',
        };
      default:
        return {
          label: type,
          icon: <Archive className="w-3 h-3 text-slate-500 dark:text-slate-400" />,
          classes: 'bg-slate-100 dark:bg-[#070b14] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700',
          desc: 'Forensic ledger item.',
        };
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-[540px] bg-white dark:bg-[#0c1322] border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col animate-slideInRight select-none font-mono">
      {/* Evidence Vault Header */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-[#070b14] border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Archive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Forensic Evidence Ledger</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-[#070b14] text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 hidden sm:flex font-semibold">
                <Lock className="w-2.5 h-2.5" />
                <span>Tamper-Evident</span>
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => investigatorStore.closeEvidenceInspector()}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close evidence ledger"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Provenance Filter Bar */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] shrink-0">
        <select
          aria-label="Filter evidence by classification"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full text-[11px] font-medium bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-[#08B4ED]/40 transition-colors shadow-2xs"
        >
          <option value="ALL">All Forensic Classifications ({caseEvidence.length})</option>
          <option value="RAW EVIDENCE">OBSERVED EVIDENCE (Raw artifacts)</option>
          <option value="AI FINDING">AI INTERPRETATION (Model predictions)</option>
          <option value="THREAT INTELLIGENCE">THREAT INTEL (External feeds)</option>
          <option value="ANALYST ANNOTATION">ANALYST ANNOTATIONS (Human notes)</option>
          <option value="CORRELATION RESULT">CORRELATION RESULTS (Multi-case links)</option>
        </select>
      </div>

      {/* Ledger Items List */}
      <div className="p-4 space-y-3.5 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-transparent">
        {isLoadingEvidence && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-2" />
            <span className="text-xs font-semibold">Verifying cryptographic hash chain...</span>
          </div>
        )}

        {errorEvidence && (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400 bg-rose-50 dark:bg-[#070b14] rounded-lg border border-rose-500/30">
            <AlertCircle className="w-6 h-6 mx-auto text-rose-500 mb-1" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Evidence Vault Offline</p>
            <p className="text-[11px] mt-0.5">{errorEvidence}</p>
          </div>
        )}

        {!isLoadingEvidence && !errorEvidence && filteredEvidence.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Archive className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No evidence items matching filter</p>
          </div>
        )}

        {!isLoadingEvidence &&
          !errorEvidence &&
          filteredEvidence.map((ev) => {
            const isSelected = selectedEvidence?.evidence_id === ev.evidence_id;
            const prov = getProvenanceBadge(ev.type);

            return (
              <div
                key={ev.evidence_id}
                onClick={() => investigatorStore.selectEvidence(ev)}
                className={`rounded-lg border p-3.5 transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-cyan-50/70 dark:bg-[#0f172a] border-[#08B4ED] shadow-[0_0_12px_rgba(8,180,237,0.18)]'
                    : 'bg-white dark:bg-[#0c1322] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* 1. Provenance Classification Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider ${prov.classes}`}
                    >
                      {prov.icon}
                      <span>{prov.label}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      #{ev.evidence_id}
                    </span>
                  </div>

                  {/* Verification State Badge */}
                  <div className="flex items-center gap-1.5">
                    {ev.verification_state === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-50 dark:bg-[#070b14] text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>VERIFIED</span>
                      </span>
                    ) : ev.verification_state === 'DISPUTED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-bold bg-rose-50 dark:bg-[#070b14] text-rose-600 dark:text-rose-400 border border-rose-500/40">
                        <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                        <span>DISPUTED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-medium bg-slate-100 dark:bg-[#070b14] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                        <span>UNVERIFIED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence Title */}
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {ev.title}
                </h4>

                {/* Evidence Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-2">
                  {ev.description}
                </p>

                {/* Immutable Raw Snippet Preview */}
                {ev.immutable_raw_snippet && (
                  <div className="my-2 p-2.5 rounded bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-[10.5px] text-slate-800 dark:text-slate-300 overflow-x-auto whitespace-pre font-mono">
                    {ev.immutable_raw_snippet}
                  </div>
                )}

                {/* Provenance & Cryptographic SHA-256 Hash */}
                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <span className="text-slate-400 dark:text-slate-500">Source:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">{ev.source_ref}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Hash className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>SHA-256:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">{ev.hash.substring(0, 10)}...</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyHash(ev.hash, ev.evidence_id);
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      title="Copy SHA-256 Cryptographic Hash"
                    >
                      {copiedHashId === ev.evidence_id ? (
                        <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Ingestion Audit Trail */}
                <div className="mt-1 flex items-center justify-between text-[9.5px] text-slate-400 dark:text-slate-500">
                  <span>Collected: {new Date(ev.collected_at).toUTCString().replace('GMT', 'UTC')}</span>
                  <span>By: <span className="text-slate-600 dark:text-slate-300 font-semibold">{ev.collected_by}</span></span>
                </div>

                {/* Existing Analyst Annotations List */}
                {ev.annotations.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-emerald-500/50 bg-emerald-50/40 dark:bg-[#070b14]/50 p-2 rounded">
                    {ev.annotations.map((ann) => (
                      <div key={ann.id} className="text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{ann.author}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1.5">
                          ({new Date(ann.timestamp).toLocaleTimeString()})
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 mt-0.5 font-sans">{ann.note}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Investigator Controls */}
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                    Tamper-evident record
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(ev.evidence_id, 'VERIFIED');
                      }}
                      className="px-2 py-0.5 text-[10.5px] font-semibold rounded bg-slate-100 dark:bg-[#070b14] hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                    >
                      Verify
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(ev.evidence_id, 'DISPUTED');
                      }}
                      className="px-2 py-0.5 text-[10.5px] font-semibold rounded bg-slate-100 dark:bg-[#070b14] hover:bg-slate-200 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-500/40 transition-colors cursor-pointer"
                    >
                      Dispute
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnnotatingEvidenceId(ev.evidence_id);
                      }}
                      className="px-2 py-0.5 text-[10.5px] font-semibold rounded bg-slate-100 dark:bg-[#070b14] hover:bg-slate-200 dark:hover:bg-slate-800 text-[#08B4ED] border border-[#08B4ED]/40 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageSquarePlus className="w-3 h-3 text-[#08B4ED]" />
                      <span>Annotate</span>
                    </button>
                  </div>
                </div>

                {/* Inline Annotation Entry Input */}
                {annotatingEvidenceId === ev.evidence_id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 p-3 bg-white dark:bg-[#070b14] rounded-lg border border-[#08B4ED]/50 shadow-sm animate-fadeIn"
                  >
                    <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Add Analyst Annotation for #{ev.evidence_id}:
                    </label>
                    <textarea
                      rows={2}
                      value={annotationText}
                      onChange={(e) => setAnnotationText(e.target.value)}
                      placeholder="Record investigative observation or chain-of-custody verification note..."
                      className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1627] text-slate-800 dark:text-slate-200 outline-none focus:border-[#08B4ED]"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAnnotatingEvidenceId(null);
                          setAnnotationText('');
                        }}
                        className="px-2.5 py-1 text-xs rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddAnnotation(ev.evidence_id)}
                        className="px-3 py-1 text-xs font-bold rounded bg-[#08B4ED] hover:bg-[#08B4ED]/90 text-slate-900 dark:text-[#0c1322] cursor-pointer"
                      >
                        Save Immutable Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
