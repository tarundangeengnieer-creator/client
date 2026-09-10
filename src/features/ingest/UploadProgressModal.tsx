/**
 * ASHIELDER Ingest & Investigation Progress Modal
 * Displays real-time multi-stage pipeline telemetry, stage execution logs, and SLA timer.
 */

import React, { useEffect, useState } from 'react';
import { InvestigationResult, Verdict } from '../../contracts/backend.ts';
import { Badge, getVerdictBadgeVariant } from '../../components/ui/Badge.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { formatLatency, formatScore } from '../../lib/formatters.ts';
import {
  CheckCircle2,
  Clock,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ExternalLink,
  Mail,
  Terminal,
} from 'lucide-react';

export interface PipelineStage {
  id: string;
  name: string;
  level: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  durationMs?: number;
}

interface UploadProgressModalProps {
  isOpen: boolean;
  fileHash?: string;
  fileName: string;
  currentStageIndex: number;
  stages: PipelineStage[];
  elapsedMs: number;
  result: InvestigationResult | null;
  error: string | null;
  onOpenWorkspace: (caseId: string) => void;
  onReturnInbox: () => void;
  onRetry: () => void;
}

export const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  fileHash,
  fileName,
  currentStageIndex,
  stages,
  elapsedMs,
  result,
  error,
  onOpenWorkspace,
  onReturnInbox,
  onRetry,
}) => {
  if (!isOpen) return null;

  const isCompleted = Boolean(result && !error);
  const isFailed = Boolean(error);
  const slaTargetMs = 4000;
  const isWithinSla = elapsedMs <= slaTargetMs;

  return (
    <div
      id="upload-progress-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="upload-progress-card"
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-100 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-sky-950/80 text-sky-400 border border-sky-800">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                {isCompleted
                  ? 'FORENSIC INVESTIGATION COMPLETE'
                  : isFailed
                  ? 'ANALYSIS PIPELINE DEGRADED'
                  : 'PROCESSING RFC 822 ARTIFACT'}
              </h2>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">
                Specimen: {fileName}
              </p>
            </div>
          </div>

          {/* Real-time SLA Stopwatch */}
          <div className="text-right">
            <div
              className={`text-sm font-bold ${
                isWithinSla ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {formatLatency(elapsedMs)}
            </div>
            <div className="text-[10px] text-slate-400">
              SLA: &lt;4,000ms {isWithinSla ? '(PASS)' : '(BREACH)'}
            </div>
          </div>
        </div>

        {/* SHA-256 Integrity Bar */}
        {fileHash && (
          <div className="px-6 py-2 bg-slate-950/50 border-b border-slate-800/80 text-[11px] flex items-center justify-between text-slate-400">
            <span>SHA-256 Hash:</span>
            <span className="text-sky-300 font-mono select-all">
              {fileHash.substring(0, 16)}...{fileHash.substring(fileHash.length - 16)}
            </span>
          </div>
        )}

        {/* Modal Body: Pipeline Stages Stepper */}
        <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
          {!isCompleted && !isFailed ? (
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const isCurrent = idx === currentStageIndex;
                const isPast = idx < currentStageIndex;
                return (
                  <div
                    key={stage.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'bg-sky-950/40 border-sky-700/80 shadow-inner'
                        : isPast
                        ? 'bg-slate-950/40 border-slate-800 opacity-90'
                        : 'bg-slate-950/20 border-slate-800/40 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {isPast ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-500">
                            {idx + 1}
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-200">
                          {stage.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {stage.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-6">
                      {stage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : isCompleted && result ? (
            /* Completed Result Summary */
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400">FINAL VERDICT</span>
                    <div>
                      <Badge variant={getVerdictBadgeVariant(result.verdict)} size="lg">
                        {result.verdict}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-[10px] text-slate-400">ASSIGNED CASE ID</span>
                    <div className="text-base font-bold text-sky-400">
                      #{result.investigation_id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400">THREAT RISK</span>
                    <div className="text-lg font-bold text-rose-400">
                      {formatScore(result.risk_score)}/100
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400">CONFIDENCE</span>
                    <div className="text-lg font-bold text-sky-400">
                      {((result.confidence ?? 0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {result.risk_reasons && result.risk_reasons.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      PRIMARY FORENSIC SIGNALS
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-rose-400">
                      {result.risk_reasons.slice(0, 3).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Error Card */
            <div className="p-4 rounded-lg bg-slate-900 border border-rose-500/30 space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>INVESTIGATION PIPELINE ERROR</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {!isCompleted && !isFailed ? (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>Executing forensic analysis layers...</span>
            </div>
          ) : isCompleted && result ? (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={onReturnInbox}
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Return to Triage Inbox
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenWorkspace(result.investigation_id)}
                leftIcon={<ExternalLink className="w-4 h-4" />}
              >
                Enter Full Case Workspace
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="md" onClick={onReturnInbox}>
                Cancel & Return
              </Button>
              <Button variant="primary" size="md" onClick={onRetry}>
                Retry Analysis
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
