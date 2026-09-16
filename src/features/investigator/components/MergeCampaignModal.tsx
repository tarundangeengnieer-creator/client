import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { GitMerge, AlertTriangle } from 'lucide-react';

export const MergeCampaignModal: React.FC = () => {
  const { isMergeModalOpen, currentCaseId, relatedCases, isActionInProgress } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id ;

  const [targetCaseId, setTargetCaseId] = useState(relatedCases[0]?.case_id || '');
  const [campaignName, setCampaignName] = useState('Operation PayPal Phish Cluster (Q3-2026)');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isMergeModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setError('Please acknowledge the campaign merge confirmation.');
      return;
    }

    setError(null);
    const res = await investigatorStore.mergeCases(targetCaseId, campaignName, tenantId);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-purple-500 flex items-center justify-center font-bold">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Merge into Threat Campaign
              </h3>
              <p className="text-[11px] text-slate-500">
                Consolidate multi-specimen investigations under unified cluster
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => investigatorStore.openMergeModal(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Merge Active Specimen #{currentCaseId} with:
            </label>
            <select
              value={targetCaseId}
              onChange={(e) => setTargetCaseId(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 font-mono outline-none focus:border-purple-500"
            >
              {relatedCases.map((rc) => (
                <option key={rc.case_id} value={rc.case_id}>
                  #{rc.case_id} — {rc.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Designate Attack Campaign Label:
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-amber-500/30 rounded-lg flex items-start gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Campaign merge aggregates forensic indicators and correlates future incoming lures automatically across tenant boundaries. Both cases retain their immutable evidence ledgers.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="confirm-merge"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded text-purple-600 cursor-pointer"
            />
            <label htmlFor="confirm-merge" className="text-slate-700 dark:text-slate-300 cursor-pointer text-[11px]">
              I verify that both incident specimens exhibit shared threat actor attribution.
            </label>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => investigatorStore.openMergeModal(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isActionInProgress || !confirmed}
              className="px-4 py-1.5 rounded text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isActionInProgress ? 'Merging...' : 'Execute Campaign Merge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
