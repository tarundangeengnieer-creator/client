import React, { useState } from 'react';
import { useInvestigator } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { MLDetectionSignal } from '../../../domain/investigator.ts';
import { ProvenanceLabel } from '../../../components/ui/ProvenanceLabel.tsx';
import { ConfidenceIndicator } from '../../../components/ui/ConfidenceIndicator.tsx';
import { EvidenceReference } from '../../../components/ui/EvidenceReference.tsx';
import { PermissionGate } from '../../../components/ui/PermissionGate.tsx';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import {
  Cpu,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  Database,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Lock,
} from 'lucide-react';

export const MLDetectionPanel: React.FC = () => {
  const { currentCaseId, caseEvidence } = useInvestigator();
  const auth = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'signals' | 'admin'>('signals');

  // Specimen ML Detection Signals adhering strictly to Section 5
  const detectionSignals: MLDetectionSignal[] = [
    {
      model_id: 'mdl-email-phish',
      model_name: 'Email Phishing Classifier',
      model_version: 'email-classifier-v1.4.2',
      prediction: 'PHISHING',
      confidence: 96,
      inference_latency_ms: 47,
      inference_status: 'Completed (Deterministic)',
      timestamp: '2026-09-08T08:14:23Z',
      supporting_evidence_ids: ['EVD-8812-01', 'EVD-8812-03'],
      key_features_triggered: [
        'Lookalike envelope sender domain (paypal1-secure.com)',
        'Extreme urgency / financial penalty lure phrasing',
        'Direct SPF authentication hard failure',
      ],
      evaluation_metrics: {
        precision: 94.0,
        recall: 91.2,
        f1: 92.5,
        evaluation_dataset: 'AShieldER-Benchmark-50k-Specimens',
      },
    },
    {
      model_id: 'mdl-url-lightnet',
      model_name: 'LightURLNet Lexical & Token Model',
      model_version: 'lighturl-v2.1.0',
      prediction: 'MALICIOUS',
      confidence: 98,
      inference_latency_ms: 18,
      inference_status: 'Completed (Deterministic)',
      timestamp: '2026-09-08T08:14:24Z',
      supporting_evidence_ids: ['EVD-8812-04'],
      key_features_triggered: [
        'Newly registered TLD path entropy > 4.8',
        'Credential auth form target with mismatched target brand',
        'No historical root DNS reputation records',
      ],
      evaluation_metrics: {
        precision: 96.4,
        recall: 93.8,
        f1: 95.1,
        evaluation_dataset: 'URL-Threat-Corpus-2026',
      },
    },
    {
      model_id: 'mdl-att-detonation',
      model_name: 'Attachment Heuristic Detonation Model',
      model_version: 'att-sandbox-v1.0.8',
      prediction: 'SUSPICIOUS',
      confidence: 87,
      inference_latency_ms: 120,
      inference_status: 'Completed (Heuristic)',
      timestamp: '2026-09-08T08:14:25Z',
      supporting_evidence_ids: ['EVD-8812-06'],
      key_features_triggered: [
        'Obfuscated JavaScript redirect snippet inside HTML attachment',
        'Automated document execution bypass routine',
      ],
      evaluation_metrics: {
        precision: 89.5,
        recall: 86.0,
        f1: 87.7,
        evaluation_dataset: 'Dynamic-Detonation-Specimens-L2',
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs font-mono select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#070b14] border border-amber-500/40 text-amber-500 flex items-center justify-center font-bold">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>ML Detection Telemetry</span>
              <ProvenanceLabel type="ML DETECTION" size="xs" />
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher: Signals (Investigator View) vs Model Operations (Admin View) */}
          <div className="flex items-center p-0.5 rounded-md bg-slate-200/70 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-[10.5px]">
            <button
              type="button"
              onClick={() => setActiveTab('signals')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                activeTab === 'signals'
                  ? 'bg-white dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Detection Signals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'bg-white dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3 h-3 text-slate-400" />
              <span>Model Admin</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Toggle ML Detection panel"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 bg-slate-50/20 dark:bg-transparent">
          {activeTab === 'signals' && (
            <div className="space-y-3">
              {/* Detection Signals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {detectionSignals.map((signal) => (
                  <div
                    key={signal.model_id}
                    className="p-3 rounded border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b14] hover:border-amber-500/30 transition-colors"
                  >
                    {/* Primary: Model Name & Prediction */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">
                          {signal.model_name}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {signal.confidence}% Confidence
                        </span>
                      </div>
                      <SeverityBadge
                        severity={signal.prediction}
                        size="sm"
                        showDot
                      />
                    </div>

                    {/* Secondary: Extracted Trigger Features */}
                    <div className="mb-2">
                      <ul className="space-y-1 text-[11px] font-sans text-slate-600 dark:text-slate-300">
                        {signal.key_features_triggered.slice(0, 2).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-tight">
                            <span className="text-amber-500 font-bold shrink-0 opacity-70">•</span>
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                        {signal.key_features_triggered.length > 2 && (
                          <li className="text-[10px] text-slate-400 italic ml-2.5">
                            + {signal.key_features_triggered.length - 2} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Tertiary: Evidence, Version, Latency */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1">
                        {signal.supporting_evidence_ids.map((id) => (
                          <EvidenceReference key={id} evidenceId={id} size="sm" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span title="Model Version">{signal.model_version.split('-').pop()}</span>
                        <span className="flex items-center gap-0.5" title="Latency">
                          <Zap className="w-2.5 h-2.5" /> {signal.inference_latency_ms}ms
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informational Guidance Notice */}
              <div className="flex items-center gap-2 text-[10.5px] text-slate-500 dark:text-slate-400 italic p-2 rounded bg-slate-100/50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  ML detection scores represent algorithmic risk indicators evaluated on extracted features. They supplement, but do not replace, Level 3 authoritative RFC header evidence.
                </span>
              </div>
            </div>
          )}

          {/* Model Admin View Gated via PermissionGate (Strict Role Separation) */}
          {activeTab === 'admin' && (
            <PermissionGate
              permission="ml.admin.manage"
              fallbackTitle="Production Model Administration"
              fallbackMessage="You do not have permission to modify, deploy, or calibrate production ML models. Contact your Platform Admin or ML Ops Lead to request administrative access."
            >
              {/* Authorized Admin Controls (Only exposed when permission is held) */}
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-500" />
                      <span>Platform Model Administration & Drift Telemetry</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                      Production model lifecycle management, threshold tuning, and retraining triggers.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    ADMIN PRIVILEGE ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1322]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Decision Threshold</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">0.85 (High Sensitivity)</span>
                      <button type="button" className="text-[10.5px] text-[#08B4ED] hover:underline cursor-pointer">
                        Calibrate
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1322]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Concept Drift Monitor</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        0.02 (Stable)
                      </span>
                      <button type="button" className="text-[10.5px] text-[#08B4ED] hover:underline cursor-pointer">
                        Report
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1322]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Active Pipeline</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">LightURLNet v2.1.0</span>
                      <button type="button" className="text-[10.5px] text-amber-500 hover:underline cursor-pointer">
                        Rollback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </PermissionGate>
          )}
        </div>
      )}
    </div>
  );
};
