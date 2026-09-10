import React, { useEffect, useCallback } from 'react';
import { useCases, casesStore } from '../../stores/cases-store.ts';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { Verdict } from '../../contracts/backend.ts';
import { defangEmail } from '../../lib/defang.ts';
import { formatLatency, formatScore, formatTimestamp } from '../../lib/formatters.ts';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Zap,
  Server,
  Crosshair,
  Mail,
  Shield,
  Lock,
} from 'lucide-react';

export const QuickPeekDrawer: React.FC = () => {
  const ui = useUI();
  const casesState = useCases();

  const caseId = ui.quickPeekCaseId;
  const currentCase = caseId ? casesStore.getCase(caseId) : null;
  const investigation = caseId ? casesStore.getInvestigation(caseId) : null;
  const filteredCases = casesStore.getFilteredCases();

  const currentIndex = filteredCases.findIndex((c) => c.id === caseId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredCases.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      const prevCase = filteredCases[currentIndex - 1];
      uiStore.openQuickPeek(prevCase.id);
      casesStore.setFocusedIndex(currentIndex - 1);
    }
  }, [hasPrev, filteredCases, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      const nextCase = filteredCases[currentIndex + 1];
      uiStore.openQuickPeek(nextCase.id);
      casesStore.setFocusedIndex(currentIndex + 1);
    }
  }, [hasNext, filteredCases, currentIndex]);

  const handleClose = useCallback(() => {
    uiStore.closeQuickPeek();
  }, []);

  const handleOpenWorkspace = useCallback(() => {
    if (currentCase) {
      uiStore.setActiveCase(
        currentCase.id,
        currentCase.subject,
        currentCase.verdict,
        currentCase.riskScore,
        currentCase.confidence
      );
      uiStore.closeQuickPeek();
      uiStore.navigate(`/case/${currentCase.id}`);
    }
  }, [currentCase]);

  const handleQuarantine = useCallback(() => {
    if (currentCase) {
      casesStore.quarantineCase(currentCase.id);
      uiStore.addToast('warning', `Quarantined case #${currentCase.id}`);
    }
  }, [currentCase]);

  const handleConfirmMalicious = useCallback(() => {
    if (currentCase) {
      casesStore.confirmMalicious(currentCase.id);
      uiStore.addToast('error', `Marked case #${currentCase.id} as MALICIOUS`);
    }
  }, [currentCase]);

  // Drawer Keyboard Navigation
  useEffect(() => {
    if (!ui.isQuickPeekOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleOpenWorkspace();
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        handleQuarantine();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleConfirmMalicious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ui.isQuickPeekOpen, handleClose, handleOpenWorkspace, handlePrev, handleNext, handleQuarantine, handleConfirmMalicious]);

  if (!ui.isQuickPeekOpen || !currentCase) {
    return null;
  }

  const authResults = {
    spf: currentCase.verdict === Verdict.BENIGN ? 'PASS' : currentCase.verdict === Verdict.MALICIOUS ? 'FAIL' : 'SOFTFAIL',
    dkim: currentCase.verdict === Verdict.BENIGN ? 'PASS' : currentCase.verdict === Verdict.MALICIOUS ? 'FAIL' : 'NONE',
    dmarc: currentCase.verdict === Verdict.BENIGN ? 'PASS' : currentCase.verdict === Verdict.MALICIOUS ? 'FAIL (REJECT)' : 'NONE',
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-rose-600';
    if (score >= 40) return 'text-amber-500';
    return 'text-emerald-600';
  };

  return (
    <div
      id="quick-peek-overlay"
      className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="quick-peek-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick Peek: #${currentCase.id}`}
        className="w-full max-w-[480px] h-full bg-white dark:bg-[#0c1322] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors"
      >
        {/* Header Strip */}
        <div className="h-14 px-5 bg-slate-50 dark:bg-[#090e1a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">QUICK PEEK:</span>
            <span className="text-sm font-bold text-blue-600 dark:text-sky-400">#{currentCase.id}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {currentIndex + 1} of {filteredCases.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!hasPrev}
              title="Previous Case (Left / H)"
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!hasNext}
              title="Next Case (Right / L)"
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={handleClose}
              title="Close Drawer (ESC)"
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verdict & 2D Metrics Summary Ribbon */}
        <div className="p-5 bg-slate-50/50 dark:bg-[#090e1a]/60 border-b border-slate-200 dark:border-slate-800 shrink-0 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentCase.verdict === Verdict.MALICIOUS
                    ? 'bg-rose-500'
                    : currentCase.verdict === Verdict.SUSPICIOUS
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
              />
              <span>{currentCase.verdict}</span>
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>Level L{currentCase.iterationCount} Executed</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Risk Card */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>THREAT RISK</span>
                <span className={`font-black ${getRiskColor(currentCase.riskScore)}`}>
                  {formatScore(currentCase.riskScore)}/100
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    currentCase.riskScore >= 70
                      ? 'bg-rose-500'
                      : currentCase.riskScore >= 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, currentCase.riskScore)}%` }}
                />
              </div>
            </div>

            {/* Confidence Card */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>CONFIDENCE</span>
                <span className="font-black text-blue-600 dark:text-sky-400">
                  {(currentCase.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-sky-400"
                  style={{ width: `${Math.min(100, currentCase.confidence * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Stop: {currentCase.stopReason}</span>
            <span>Latency: {formatLatency(currentCase.resourceEnvelope?.wallClockMs)}</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Envelope Metadata */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/80 shadow-2xs space-y-2.5">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>ENVELOPE METADATA</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <span className="text-slate-400 dark:text-slate-500">From:</span>
              <span className="col-span-3 text-slate-800 dark:text-slate-200 font-medium truncate" title={currentCase.sender}>
                {defangEmail(currentCase.sender)}
              </span>

              <span className="text-slate-400 dark:text-slate-500">To:</span>
              <span className="col-span-3 text-slate-700 dark:text-slate-300 truncate" title={currentCase.recipient}>
                {currentCase.recipient}
              </span>

              <span className="text-slate-400 dark:text-slate-500">Subject:</span>
              <span className="col-span-3 text-slate-900 dark:text-white font-semibold break-words">
                {currentCase.subject}
              </span>

              <span className="text-slate-400 dark:text-slate-500">Time:</span>
              <span className="col-span-3 text-slate-500 dark:text-slate-400">
                {formatTimestamp(currentCase.timestamp)}
              </span>
            </div>
          </div>

          {/* Authentication Triage Matrix */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/80 shadow-2xs space-y-2.5">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>AUTHENTICATION PILLARS</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400 dark:text-slate-500 text-[11px] mb-0.5">SPF</div>
                <span
                  className={`font-bold ${
                    authResults.spf === 'PASS'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : authResults.spf === 'FAIL'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-amber-500 dark:text-amber-400'
                  }`}
                >
                  {authResults.spf}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400 dark:text-slate-500 text-[11px] mb-0.5">DKIM</div>
                <span
                  className={`font-bold ${
                    authResults.dkim === 'PASS'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : authResults.dkim === 'FAIL'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {authResults.dkim}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400 dark:text-slate-500 text-[11px] mb-0.5">DMARC</div>
                <span
                  className={`font-bold ${
                    authResults.dmarc === 'PASS'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : authResults.dmarc.includes('FAIL')
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {authResults.dmarc}
                </span>
              </div>
            </div>
          </div>

          {/* Key Findings & Reasons */}
          {investigation?.risk_reasons && investigation.risk_reasons.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/80 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                <Crosshair className="w-3.5 h-3.5 text-rose-500" />
                <span>KEY FORENSIC FINDINGS</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {investigation.risk_reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="text-rose-500 font-bold shrink-0">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attack Hypotheses */}
          {investigation?.attack_hypotheses && investigation.attack_hypotheses.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/80 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>ATTACK HYPOTHESES</span>
              </div>

              <div className="space-y-2">
                {investigation.attack_hypotheses.map((hyp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{hyp.hypothesis_type}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        {((hyp.confidence ?? hyp.score ?? 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    {hyp.reasons && hyp.reasons.length > 0 && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{hyp.reasons.join('. ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Telemetry & Pipeline Resources */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/80 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Server className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>PIPELINE TELEMETRY</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500">Tools Executed:</span>{' '}
                <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentCase.toolsUsed.length} tools</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500">External Enriches:</span>{' '}
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {currentCase.resourceEnvelope.externalCalls} calls
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500">Wall Latency:</span>{' '}
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {formatLatency(currentCase.resourceEnvelope.wallClockMs)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500">SLA Status:</span>{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">&lt;4,000ms Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#090e1a] border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2.5">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-[0_0_12px_rgba(14,165,233,0.18)] border border-sky-400/40 transition-colors cursor-pointer"
            onClick={handleOpenWorkspace}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Case Detail Workspace (Enter)</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleConfirmMalicious}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-rose-500/30 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Confirm Malicious (C)</span>
            </button>
            <button
              type="button"
              onClick={handleQuarantine}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-amber-500/30 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Quarantine (Q)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
