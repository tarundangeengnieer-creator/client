import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { ShieldAlert, AlertCircle } from 'lucide-react';

export const EscalateModal: React.FC = () => {
  const { isEscalateModalOpen, currentCaseId, isActionInProgress } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id ;

  const [urgency, setUrgency] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [rationale, setRationale] = useState(
    'Confirmed active Tor exit origin with corporate wire transfer interception lure. Immediate host containment and domain takedown requested.'
  );
  const [error, setError] = useState<string | null>(null);

  if (!isEscalateModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rationale.trim()) {
      setError('Please provide an escalation justification and required handover actions.');
      return;
    }

    setError(null);
    const res = await investigatorStore.escalateCase(rationale, urgency, tenantId);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-rose-500 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Escalate to Fraud / Incident Response (IR)
              </h3>
              <p className="text-[11px] text-slate-500">
                Formal forensic referral for Case #{currentCaseId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => investigatorStore.openEscalateModal(false)}
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
              Escalation Urgency Level:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['CRITICAL', 'HIGH', 'MEDIUM'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgency(lvl)}
                  className={`py-1.5 px-2 rounded border text-xs font-bold transition-all cursor-pointer ${
                    urgency === lvl
                      ? 'bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 border-rose-500 shadow-2xs'
                      : 'bg-slate-50 dark:bg-[#080d1a] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Investigative Handover Rationale & Evidence Summary:
            </label>
            <textarea
              rows={4}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Outline high-confidence indicators, affected targets, and required quarantine or legal measures..."
              className="w-full p-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => investigatorStore.openEscalateModal(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isActionInProgress}
              className="px-4 py-1.5 rounded text-xs font-semibold bg-[#0c1322] border border-rose-500/60 hover:bg-rose-950/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isActionInProgress ? 'Escalating...' : 'Submit Forensic Referral'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
