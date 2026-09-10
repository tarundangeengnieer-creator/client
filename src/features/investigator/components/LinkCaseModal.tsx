import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { X, Link2, AlertCircle } from 'lucide-react';

export const LinkCaseModal: React.FC = () => {
  const { isLinkModalOpen, currentCaseId, relatedCases, isActionInProgress } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';

  const [targetCaseId, setTargetCaseId] = useState(relatedCases[0]?.case_id || '');
  const [justification, setJustification] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isLinkModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCaseId.trim() || !justification.trim()) {
      setError('Please select a target investigation and provide an investigative justification.');
      return;
    }

    setError(null);
    const res = await investigatorStore.linkCase(targetCaseId, justification, tenantId);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-sky-500 flex items-center justify-center font-bold">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Link Incident Investigation
              </h3>
              <p className="text-[11px] text-slate-500">
                Establish forensic linkage for #{currentCaseId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => investigatorStore.openLinkModal(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Investigation to Link:
            </label>
            <select
              value={targetCaseId}
              onChange={(e) => setTargetCaseId(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 font-mono outline-none focus:border-blue-500"
            >
              {relatedCases.map((rc) => (
                <option key={rc.case_id} value={rc.case_id}>
                  #{rc.case_id} — {rc.subject} ({rc.similarity_score}% match)
                </option>
              ))}
              <option value="CASE-2026-8744">#CASE-2026-8744 (Manual Input Reference)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Forensic Justification / Overlap Evidence:
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Detail shared IOCs, lookalike domain registrar overlap, or Tor exit infrastructure correlation..."
              className="w-full p-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => investigatorStore.openLinkModal(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isActionInProgress}
              className="px-4 py-1.5 rounded text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isActionInProgress ? 'Linking...' : 'Confirm Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
