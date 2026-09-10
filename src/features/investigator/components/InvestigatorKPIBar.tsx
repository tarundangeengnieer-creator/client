import React from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import {
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Layers,
  FileCheck,
  X,
  Target,
  ChevronRight,
  User,
  Activity,
} from 'lucide-react';

export const InvestigatorKPIBar: React.FC = () => {
  const {
    cases,
    currentCase,
    currentCaseId,
    caseEvidence,
    relatedCases,
    selectedEntity,
    graphNodes,
  } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';

  const verifiedEvidenceCount = caseEvidence.filter(
    (e) => e.verification_state === 'VERIFIED'
  ).length;

  // Determine dynamic or default investigation scope breadcrumb
  const investigationScope = React.useMemo(() => {
    const types = Array.from(new Set(graphNodes.map((n) => n.type)));
    const preferredOrder = ['Email', 'Sender', 'Attachment', 'URL', 'Source IP', 'Domain'];
    const sorted = types.filter((t) => preferredOrder.includes(t));
    if (sorted.length >= 2) {
      return sorted.slice(0, 4);
    }
    return ['Email', 'Attachment', 'URL', 'Source IP'];
  }, [graphNodes]);

  const getSeverityStyle = (sev?: string) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-rose-600 dark:text-rose-500 border-rose-500/40 bg-rose-50 dark:bg-[#0c1322]';
      case 'HIGH':
        return 'text-orange-600 dark:text-orange-400 border-orange-500/40 bg-orange-50 dark:bg-[#0c1322]';
      case 'MEDIUM':
        return 'text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-50 dark:bg-[#0c1322]';
      case 'LOW':
      case 'INFO':
        return 'text-[#08B4ED] border-[#08B4ED]/40 bg-cyan-50/50 dark:bg-[#0c1322]';
      default:
        return 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/60 bg-slate-100 dark:bg-[#0c1322]';
    }
  };

  const getVerdictStyle = (verdict?: string) => {
    switch (verdict?.toUpperCase()) {
      case 'MALICIOUS':
        return 'text-rose-600 dark:text-rose-400 border-rose-500/40 bg-rose-50/60 dark:bg-transparent';
      case 'SUSPICIOUS':
        return 'text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-50/60 dark:bg-transparent';
      case 'BENIGN':
        return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-50/60 dark:bg-transparent';
      default:
        return 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/60 bg-slate-100 dark:bg-transparent';
    }
  };

  const currentSeverity = currentCase?.severity || (currentCase?.risk_score && currentCase.risk_score >= 80 ? 'CRITICAL' : 'HIGH');
  const detectionConfidence = currentCase?.evidence_confidence || 94;
  const riskVerdict = currentCase?.verdict || 'MALICIOUS';
  const riskScore = currentCase?.risk_score || 88;

  return (
    <div className="bg-white dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 select-none transition-colors">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 max-w-[1850px] mx-auto">
        {/* Left: LEVEL 1 — Investigation Context */}
        <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
          {/* Active Case Selector */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1322] hover:border-[#08B4ED]/50 transition-colors shrink-0 shadow-xs">
            <Briefcase className="w-3.5 h-3.5 text-[#08B4ED]" />
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">CASE:</span>
            <select
              aria-label="Active Case"
              value={currentCaseId || ''}
              onChange={(e) => investigatorStore.selectCase(e.target.value, tenantId)}
              className="text-xs font-bold text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer pr-1 font-mono hover:text-[#08B4ED] transition-colors"
            >
              {cases.map((c) => (
                <option key={c.case_id} value={c.case_id} className="bg-white dark:bg-[#0c1322] text-slate-900 dark:text-slate-100">
                  {c.case_id}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Investigation Subject */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[240px] xl:max-w-[360px]" title={currentCase?.subject}>
              {currentCase?.subject || 'Forensic Threat Specimen'}
            </span>
          </div>

          <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Scope Breadcrumb */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider mr-1">Scope:</span>
            {investigationScope.map((scopeItem, idx) => (
              <React.Fragment key={scopeItem}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                <span className={idx === investigationScope.length - 1 ? 'text-[#08B4ED] font-semibold' : 'text-slate-700 dark:text-slate-300'}>
                  {scopeItem}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Persistent Selected Entity HUD Badge */}
          {selectedEntity && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#0c1322] border border-[#08B4ED]/70 shadow-[0_0_10px_rgba(8,180,237,0.18)] animate-fadeIn">
              <Target className="w-3.5 h-3.5 text-[#08B4ED] animate-pulse" />
              <span className="text-[10px] uppercase font-mono font-bold text-[#08B4ED]">
                {selectedEntity.type}:
              </span>
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 max-w-[160px] truncate" title={selectedEntity.value}>
                {selectedEntity.value}
              </span>
              <button
                type="button"
                onClick={() => investigatorStore.selectEntity(null)}
                className="p-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors ml-1 cursor-pointer"
                title="Deselect Entity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Separate Risk vs. Confidence vs. Severity vs. Evidence */}
        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
          {/* Risk Metric */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-medium">Risk:</span>
            <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded border ${getVerdictStyle(riskVerdict)}`}>
              {riskVerdict} ({riskScore}/100)
            </span>
          </div>

          {/* Detection Confidence (Separate from Risk!) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800" title="Statistical detection model confidence">
            <Activity className="w-3.5 h-3.5 text-[#08B4ED]" />
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-medium">Confidence:</span>
            <span className="text-[11px] font-mono font-bold text-[#08B4ED]">
              {detectionConfidence}%
            </span>
          </div>

          {/* Severity (Separate from Confidence & Risk!) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-medium">Severity:</span>
            <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded border ${getSeverityStyle(currentSeverity)}`}>
              {currentSeverity}
            </span>
          </div>

          {/* Evidence Ledger State */}
          <button
            type="button"
            onClick={() => investigatorStore.openEvidenceInspector(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer"
            title="Inspect Tamper-Evident Evidence Ledger"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-medium">Evidence:</span>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {verifiedEvidenceCount}/{caseEvidence.length} Verified
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
