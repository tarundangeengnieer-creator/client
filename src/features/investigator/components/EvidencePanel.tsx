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

import { EvidenceInspector } from '../../investigation/components/evidence/EvidenceInspector.tsx';

export const EvidencePanel: React.FC = () => {
  const { isEvidenceInspectorOpen } = useInvestigator();

  if (!isEvidenceInspectorOpen) return null;

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

      <div className="flex-1 overflow-hidden relative">
        <EvidenceInspector />
      </div>
    </div>
  );
};
