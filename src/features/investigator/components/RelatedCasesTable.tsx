import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { RelatedCaseMatch } from '../../../domain/investigator.ts';
import {
  Layers,
  Link2,
  GitMerge,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  FolderSearch,
  CheckCircle2,
  Info,
  Clock,
  ArrowUpRight,
  SplitSquareVertical,
  Copy,
  Check,
  X,
} from 'lucide-react';

export const RelatedCasesTable: React.FC = () => {
  const { relatedCases, currentCaseId, isLoadingRelated, errorRelated } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';

  // Compare drawer modal state
  const [comparingCase, setComparingCase] = useState<RelatedCaseMatch | null>(null);
  const [copiedIOC, setCopiedIOC] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIOC(text);
    setTimeout(() => setCopiedIOC(null), 2000);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Open':
        return 'text-[#08B4ED] border-[#08B4ED]/40 bg-cyan-50/50 dark:bg-[#070b14]';
      case 'Evidence Pending':
        return 'text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-50 dark:bg-[#070b14]';
      case 'Ready for Report':
        return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-50 dark:bg-[#070b14]';
      case 'Closed':
      default:
        return 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#070b14]';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs font-mono select-none">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#070b14] border border-[#08B4ED]/40 text-[#08B4ED] flex items-center justify-center font-bold">
            <Layers className="w-3.5 h-3.5 text-[#08B4ED]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Related Cases / Threat Correlations</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/30 font-normal">
                Tenant-Partitioned
              </span>
            </h3>
          </div>
        </div>

        {/* AI Correlation Non-Ground-Truth Notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-[#070b14] px-2.5 py-1 rounded border border-amber-500/30">
          <Info className="w-3.5 h-3.5 shrink-0 text-amber-500 dark:text-amber-400" />
          <span>Heuristic correlation hypothesis — requires analyst verification</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto bg-white dark:bg-transparent">
        {isLoadingRelated && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <div className="w-6 h-6 rounded-full border-2 border-[#08B4ED] border-t-transparent animate-spin mx-auto mb-2" />
            <span className="text-xs font-semibold">Correlating tenant incident archives...</span>
          </div>
        )}

        {errorRelated && (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            <AlertTriangle className="w-6 h-6 mx-auto text-amber-500 mb-1" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Correlation Service Degraded</p>
            <p className="text-[11px] mt-0.5">{errorRelated}</p>
          </div>
        )}

        {!isLoadingRelated && !errorRelated && relatedCases.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
            <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No related cases found</p>
            <p className="text-[11px] mt-0.5 text-slate-500">
              No overlapping indicators or infrastructure hashes detected in tenant partition.
            </p>
          </div>
        )}

        {!isLoadingRelated && !errorRelated && relatedCases.length > 0 && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f1d] text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-4">Case ID</th>
                <th className="py-2.5 px-4">Explainable Similarity Basis</th>
                <th className="py-2.5 px-4">Similarity Score</th>
                <th className="py-2.5 px-4">Opened Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Investigator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {relatedCases.map((match) => (
                <tr
                  key={match.case_id}
                  className="hover:bg-slate-50 dark:hover:bg-[#0f172a] transition-colors"
                >
                  {/* Case ID */}
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                    <button
                      type="button"
                      onClick={() => investigatorStore.selectCase(match.case_id, tenantId)}
                      className="text-[#08B4ED] hover:underline flex items-center gap-1 cursor-pointer font-mono font-bold"
                      title="Switch active workspace to this case"
                    >
                      <span>#{match.case_id}</span>
                      <ArrowUpRight className="w-3 h-3 text-[#08B4ED]" />
                    </button>
                    <p className="text-[10px] font-sans font-normal text-slate-500 dark:text-slate-400 truncate max-w-[190px] mt-0.5">
                      {match.subject}
                    </p>
                  </td>

                  {/* Explainable Similarity Basis */}
                  <td className="py-3 px-4 max-w-md">
                    <div className="flex items-start gap-1.5">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug font-sans">
                        {match.similarity_basis}
                      </span>
                    </div>
                    {match.shared_iocs.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {match.shared_iocs.map((ioc) => (
                          <span
                            key={ioc}
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-mono text-[9.5px] bg-slate-100 dark:bg-[#070b14] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            <span>{ioc}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(ioc)}
                              className="text-slate-400 hover:text-[#08B4ED] transition-colors"
                              title="Copy IOC"
                            >
                              {copiedIOC === ioc ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Similarity Score with visual meter */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            match.similarity_score >= 80
                              ? 'bg-rose-500'
                              : match.similarity_score >= 60
                              ? 'bg-amber-500'
                              : 'bg-[#08B4ED]'
                          }`}
                          style={{ width: `${match.similarity_score}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {match.similarity_score}%
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(match.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusBadge(
                        match.status
                      )}`}
                    >
                      {match.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Pivot / Compare */}
                      <button
                        type="button"
                        onClick={() => setComparingCase(match)}
                        className="px-2 py-1 text-[11px] font-semibold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#070b14] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="Compare shared indicators side-by-side"
                      >
                        Compare
                      </button>

                      {/* Link Case Action */}
                      <button
                        type="button"
                        onClick={() => investigatorStore.openLinkModal(true)}
                        className="px-2 py-1 text-[11px] font-semibold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#070b14] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="Link Case formally into relationship graph"
                      >
                        Link
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Side-by-Side Indicator Comparison Modal Drawer */}
      {comparingCase && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-[#08B4ED]/60 rounded-xl max-w-2xl w-full p-5 shadow-2xl animate-fadeIn space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-[#08B4ED]" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Cross-Case Incident Comparison
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setComparingCase(null)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] text-[#08B4ED] font-bold uppercase">Active Case</span>
                <p className="font-bold text-slate-900 dark:text-white text-xs">#{currentCaseId}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-sans">Current specimen under active triage.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">Correlated Match</span>
                <p className="font-bold text-slate-900 dark:text-white text-xs">#{comparingCase.case_id}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-sans">{comparingCase.subject}</p>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase text-[10px]">
                Overlapping Infrastructure Indicators ({comparingCase.shared_iocs.length})
              </span>
              <div className="p-3 bg-slate-50 dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                {comparingCase.shared_iocs.map((ioc) => (
                  <div key={ioc} className="flex items-center justify-between text-slate-800 dark:text-slate-200 text-xs">
                    <span>{ioc}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ioc)}
                      className="text-slate-400 hover:text-[#08B4ED] transition-colors"
                    >
                      {copiedIOC === ioc ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setComparingCase(null)}
                className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Close Comparison
              </button>
              <button
                type="button"
                onClick={() => {
                  setComparingCase(null);
                  investigatorStore.selectCase(comparingCase.case_id, tenantId);
                }}
                className="px-3 py-1.5 rounded bg-[#08B4ED] text-slate-900 dark:text-[#0c1322] font-bold hover:bg-[#08B4ED]/90 cursor-pointer"
              >
                Switch to #{comparingCase.case_id}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
