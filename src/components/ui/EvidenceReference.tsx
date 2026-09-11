import React from 'react';
import { investigatorStore } from '../../stores/investigator-store.ts';
import { FileCheck, ShieldCheck, Hash, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

export interface EvidenceReferenceProps {
  evidenceId: string;
  title?: string;
  category?: string;
  hashSnippet?: string;
  verificationState?: 'VERIFIED' | 'DISPUTED' | 'UNVERIFIED';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

/**
 * EvidenceReference
 *
 * Clickable tamper-evident reference to a primary forensic record in the evidence ledger.
 * Clicking directly opens or focuses the Evidence Inspector drawer.
 */
export const EvidenceReference: React.FC<EvidenceReferenceProps> = ({
  evidenceId,
  title,
  category,
  hashSnippet,
  verificationState = 'VERIFIED',
  size = 'md',
  onClick,
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      // Find matching evidence in current store or open inspector
      const snapshot = investigatorStore.getSnapshot();
      const match = snapshot.caseEvidence.find((ev) => ev.evidence_id === evidenceId);
      if (match) {
        investigatorStore.selectEvidence(match);
      } else {
        investigatorStore.openEvidenceInspector(true);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Inspect tamper-evident forensic evidence #${evidenceId}`}
      className={cn(
        'group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] hover:bg-cyan-50/50 dark:hover:bg-[#0c1322] hover:border-[#08B4ED]/60 text-slate-800 dark:text-slate-200 font-mono text-[11px] transition-all cursor-pointer shadow-2xs text-left',
        className
      )}
    >
      <FileCheck className="w-3.5 h-3.5 text-[#08B4ED] shrink-0" />
      <span className="font-bold text-[#08B4ED] group-hover:underline">
        #{evidenceId}
      </span>
      {title && (
        <span className="text-slate-600 dark:text-slate-300 max-w-[180px] truncate font-sans">
          {title}
        </span>
      )}
      {hashSnippet && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
          [{hashSnippet.substring(0, 8)}...]
        </span>
      )}
      {verificationState === 'VERIFIED' && (
        <span className="inline-flex items-center text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded border border-emerald-500/30 shrink-0">
          <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
          VERIFIED
        </span>
      )}
      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#08B4ED] shrink-0 ml-0.5" />
    </button>
  );
};
