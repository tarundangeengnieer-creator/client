import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useUI, uiStore } from '../../../stores/ui-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { investigatorRepo } from '../../../api/investigator-repository.ts';
import {
  Link2,
  GitMerge,
  CheckCircle2,
  FileDown,
  ShieldAlert,
  Archive,
  Terminal,
} from 'lucide-react';

export const CaseActionBar: React.FC = () => {
  const { currentCaseId, caseEvidence } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id ;
  const author = auth.currentUser?.name || 'Ankit Sharma (Investigator)';

  const [isExporting, setIsExporting] = useState(false);

  const handleVerifyAllPending = async () => {
    const unverified = caseEvidence.filter((e) => e.verification_state === 'UNVERIFIED');
    if (unverified.length === 0) {
      uiStore.addToast('info', 'All evidence items are already verified or disputed.');
      return;
    }

    for (const ev of unverified) {
      await investigatorStore.verifyEvidence(ev.evidence_id, 'VERIFIED', author, tenantId);
    }
    uiStore.addToast('success', `${unverified.length} pending evidence items marked VERIFIED.`);
  };

  const handleExportReport = async () => {
    if (!currentCaseId) return;
    setIsExporting(true);
    try {
      const res = await investigatorRepo.exportForensicReport(currentCaseId, tenantId);
      uiStore.addToast('success', `Forensic dossier generated: ${res.reportId}`);
      setTimeout(() => {
        uiStore.navigate('/reports');
      }, 500);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg select-none">
      {/* Left indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-[#08B4ED] animate-pulse" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">Forensic Workbench Live</span>
        <span className="text-slate-300 dark:text-slate-600">•</span>
        <span className="font-bold text-[#08B4ED]">
          Case #{currentCaseId}
        </span>
      </div>

      {/* Action Bar: Secondary, Dangerous, and Primary Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Secondary Actions in Dark Neutral Surface with Subtle Border */}
        <button
          type="button"
          onClick={() => investigatorStore.openEvidenceInspector(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1322] hover:bg-slate-100 dark:hover:bg-[#0f172a] hover:border-[#08B4ED]/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
        >
          <Archive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Evidence Ledger</span>
        </button>

        <button
          type="button"
          onClick={handleVerifyAllPending}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1322] hover:bg-slate-100 dark:hover:bg-[#0f172a] hover:border-[#08B4ED]/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#08B4ED]" />
          <span>Verify All Evidence</span>
        </button>

        <button
          type="button"
          onClick={() => investigatorStore.openLinkModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1322] hover:bg-slate-100 dark:hover:bg-[#0f172a] hover:border-[#08B4ED]/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
        >
          <Link2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Link Case</span>
        </button>

        <button
          type="button"
          onClick={() => investigatorStore.openMergeModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1322] hover:bg-slate-100 dark:hover:bg-[#0f172a] hover:border-[#08B4ED]/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
        >
          <GitMerge className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Merge Campaign</span>
        </button>

        {/* Dangerous Action in Restrained Danger Border & Text */}
        <button
          type="button"
          onClick={() => investigatorStore.openEscalateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-md bg-rose-50 dark:bg-[#0c1322] hover:bg-rose-100 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-500/40 transition-colors cursor-pointer shadow-2xs"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>Escalate to Fraud/IR</span>
        </button>

        {/* Primary Action in AShieldER Primary #08B4ED */}
        <button
          type="button"
          onClick={handleExportReport}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold rounded-md bg-[#08B4ED] hover:bg-[#08B4ED]/90 text-slate-900 dark:text-[#0c1322] shadow-[0_0_12px_rgba(8,180,237,0.22)] transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-900 dark:text-[#0c1322]" />
          <span>{isExporting ? 'Generating Dossier...' : 'Export Forensic Report'}</span>
        </button>
      </div>
    </div>
  );
};
