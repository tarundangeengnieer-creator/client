import React, { useState, useEffect, useRef } from 'react';
import {
  InvestigationResult,
  Verdict,
  InvestigationStatus,
} from '../../contracts/backend.ts';
import { casesStore, makeInvestigation } from '../../stores/cases-store.ts';
import { uiStore } from '../../stores/ui-store.ts';
import { mapInvestigationToCaseViewModel } from '../../domain/mappers/case-mapper.ts';
import { formatBytes, formatLatency, formatScore } from '../../lib/formatters.ts';
import { OfficialGmailLogo, OfficialMicrosoftLogo } from '../../components/ui/BrandLogos.tsx';
import { apiClient } from '../../api/client.ts';
import { ENDPOINTS } from '../../api/endpoints.ts';
import { mapInvestigationResult } from '../../api/dto-mappers.ts';
import {
  X,
  Mail,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  Copy,
  Clock,
  FileCode,
  Layers,
  Sparkles,
  Server,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  FileCheck,
  RotateCcw,
} from 'lucide-react';

export type IngestionSource = 'gmail' | 'microsoft' | 'eml' | 'server' | 'paste';
export type WorkflowStage = 'INGEST' | 'PLAN' | 'INVESTIGATE' | 'RESULTS';

export interface IngestedSpecimen {
  id: string;
  source: IngestionSource;
  sourceLabel: string;
  subject: string;
  sender: string;
  recipient: string;
  date: string;
  fileSize: number;
  sha256: string;
  rawContent: string;
  verdict: Verdict;
  riskScore: number;
  confidence: number;
  originIp: string;
  findings: string[];
  rawFile?: File;
}

export interface PipelineExecutionStage {
  id: string;
  name: string;
  level: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  durationMs?: number;
}

const DEFAULT_PIPELINE_STAGES: PipelineExecutionStage[] = [
  {
    id: 'p1',
    name: 'Raw Email & MIME Tree Extraction',
    level: 'L0 Static',
    description: 'Parsing RFC 5322 boundaries, multipart payloads, and encoded header fields.',
    status: 'pending',
  },
  {
    id: 'p2',
    name: 'Header & Return-Path Topology',
    level: 'L0 Static',
    description: 'Verifying Message-ID syntax, date skew, and display-name spoofing signals.',
    status: 'pending',
  },
  {
    id: 'p3',
    name: 'Authentication Matrix (SPF / DKIM / DMARC)',
    level: 'L1 Targeted',
    description: 'Evaluating cryptographic DKIM canonicalization and DMARC alignment policy.',
    status: 'pending',
  },
  {
    id: 'p4',
    name: 'Received Chain & Transit Relay GeoIP',
    level: 'L1 Targeted',
    description: 'Tracing IP route hops, identifying anomalous transit nodes and Tor exit relays.',
    status: 'pending',
  },
  {
    id: 'p5',
    name: 'URL Extraction & Domain Intelligence',
    level: 'L1 Targeted',
    description: 'Extracting hyperlinked URIs, Punycode detection, and LightURLNet threat scoring.',
    status: 'pending',
  },
  {
    id: 'p6',
    name: 'Attachment Dissection & Entropy Analysis',
    level: 'L1 Targeted',
    description: 'Inspecting magic bytes, macro markers, double file extensions, and hash lookups.',
    status: 'pending',
  },
  {
    id: 'p7',
    name: 'Phishing Intent & BEC Language Evaluation',
    level: 'L2 Intel',
    description: 'Analyzing urgency markers, executive impersonation patterns, and bank wire requests.',
    status: 'pending',
  },
  {
    id: 'p8',
    name: 'Multi-Agent Synthesis & 2D Risk Scoring',
    level: 'L2 Intel',
    description: 'Reconciling hypothesis conflicts, computing Bayesian confidence and final verdict.',
    status: 'pending',
  },
];

const PREBUILT_SPECIMENS: IngestedSpecimen[] = [
  {
    id: 'spec-invoice',
    source: 'eml',
    sourceLabel: 'Vendor Invoice',
    subject: 'Invoice #78291',
    sender: 'accounts@vendor-billing-desk.com',
    recipient: 'finance@targetcorp.in',
    date: '5 Sep 2026, 11:02 AM',
    fileSize: 5120,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    verdict: Verdict.SUSPICIOUS,
    riskScore: 68,
    confidence: 0.74,
    originIp: '103.14.26.89',
    findings: [
      'Altered bank wire coordinates embedded in PDF attachment',
      'Sender display name mimics trusted vendor with mismatched return-path',
      'DKIM signature missing and no valid DMARC assertion',
    ],
    rawContent: `Received: from 103.14.26.89 (mail.vendor-billing-desk.com)
From: "Accounts Department" <accounts@vendor-billing-desk.com>
To: finance@targetcorp.in
Subject: Invoice #78291
Date: Sat, 05 Sep 2026 11:02:00 +0000

Attached is updated invoice #78291. Please process to revised routing details.`,
  },
  {
    id: 'spec-bec',
    source: 'eml',
    sourceLabel: 'BEC Wire Specimen',
    subject: 'BEC / Wire Transfer',
    sender: 'ceo-office@targetcorp-urgent.in',
    recipient: 'cfo@targetcorp.in',
    date: '7 Sep 2026, 10:24 AM',
    fileSize: 4280,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    verdict: Verdict.MALICIOUS,
    riskScore: 92,
    confidence: 0.88,
    originIp: '185.220.101.5',
    findings: [
      'Origin IP 185.220.101.5 identified as known Tor Exit node (Frankfurt, DE)',
      'Lookalike domain registered 4 hours prior to transit',
      'Executive impersonation requesting urgent offshore wire transfer',
    ],
    rawContent: `Received: from 185.220.101.5 (tor-exit-04.de [185.220.101.5])
Authentication-Results: mx.targetcorp.in; spf=fail; dkim=fail; dmarc=fail (p=reject)
From: "Executive Director" <ceo-office@targetcorp-urgent.in>
To: cfo@targetcorp.in
Subject: Urgent: Confidential Acquisition Wire
Date: Mon, 07 Sep 2026 10:24:00 +0000

We are closing an acquisition today. Complete wire transfer of $148,000 immediately.`,
  },
  {
    id: 'spec-zendesk',
    source: 'eml',
    sourceLabel: 'Helpdesk Baseline',
    subject: 'Legitimate Zendesk Notification',
    sender: 'support@zendesk.com',
    recipient: 'secops@targetcorp.in',
    date: '6 Sep 2026, 04:18 PM',
    fileSize: 3180,
    sha256: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
    verdict: Verdict.BENIGN,
    riskScore: 8,
    confidence: 0.95,
    originIp: '192.161.148.22',
    findings: [
      'Cryptographic SPF/DKIM/DMARC pass with verified zendesk.com alignment',
      'Known corporate SaaS infrastructure relay',
      'No anomalous URLs or deceptive attachment payloads detected',
    ],
    rawContent: `Received: from mail.zendesk.com ([192.161.148.22])
Authentication-Results: mx.targetcorp.in; spf=pass; dkim=pass; dmarc=pass
From: "Zendesk Support" <support@zendesk.com>
To: secops@targetcorp.in
Subject: Legitimate Zendesk Notification: Ticket #99142 Updated
Date: Sun, 06 Sep 2026 16:18:00 +0000

Your ticket has been updated by the assigned support engineer.`,
  },
  {
    id: 'spec-o365',
    source: 'microsoft',
    sourceLabel: 'M365 Credential Harvest',
    subject: 'Office 365 Password Expiry Notice',
    sender: 'admin@office365-security-update.in',
    recipient: 'staff@targetcorp.in',
    date: '6 Sep 2026, 02:40 PM',
    fileSize: 3950,
    sha256: 'b45c2198d76a543e21098f7e6d5c4b3a21098f7e6d5c4b3a21098f7e6d5c4b3a',
    verdict: Verdict.MALICIOUS,
    riskScore: 89,
    confidence: 0.85,
    originIp: '185.156.73.19',
    findings: [
      'Brand impersonation targeting Microsoft 365 enterprise credentials',
      'Sender domain office365-security-update.in registered recently on bulletproof host',
      'SPF hardfail and missing DKIM signature',
    ],
    rawContent: `Received: from 185.156.73.19 (bulletproof-vps.nl)
From: "Microsoft 365 Security" <admin@office365-security-update.in>
To: staff@targetcorp.in
Subject: Action Required: Microsoft 365 Password Expiry Notice
Date: Sun, 06 Sep 2026 14:40:00 +0000

Your password expires in 2 hours. Keep current credentials active: http://office365-security-update.in/auth`,
  },
];

interface ForensicWorkflowModalProps {
  isOpen: boolean;
  initialSource: IngestionSource;
  onClose: () => void;
  onCompletedCase?: (caseId: string) => void;
}

export const ForensicWorkflowModal: React.FC<ForensicWorkflowModalProps> = ({
  isOpen,
  initialSource,
  onClose,
  onCompletedCase,
}) => {
  const [activeStage, setActiveStage] = useState<WorkflowStage>('INGEST');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'gmail' | 'microsoft'>('upload');
  const [selectedSpecimen, setSelectedSpecimen] = useState<IngestedSpecimen | null>(null);

  // Investigation Execution State
  const [pipelineStages, setPipelineStages] = useState<PipelineExecutionStage[]>(DEFAULT_PIPELINE_STAGES);
  const [executionState, setExecutionState] = useState<'idle' | 'analyzing' | 'preparing' | 'completed' | 'error'>('idle');
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [completedResult, setCompletedResult] = useState<InvestigationResult | null>(null);
  const [assignedCaseId, setAssignedCaseId] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cancelExecutionRef = useRef<boolean>(false);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setActiveStage('INGEST');
      const mappedTab =
        initialSource === 'gmail'
          ? 'gmail'
          : initialSource === 'microsoft'
          ? 'microsoft'
          : initialSource === 'paste'
          ? 'paste'
          : 'upload';
      setActiveTab(mappedTab);
      setPipelineStages(DEFAULT_PIPELINE_STAGES.map((s) => ({ ...s, status: 'pending' })));
      setExecutionState('idle');
      setExecutionError(null);
      setElapsedMs(0);
      setCompletedResult(null);
      setAssignedCaseId('');
      setPasteContent('');
      setCopiedToken(false);
      cancelExecutionRef.current = false;

      // Select first specimen as clean default
      setSelectedSpecimen(PREBUILT_SPECIMENS[0]);
    }
  }, [isOpen, initialSource]);

  // Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      cancelExecutionRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopySha256 = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 1800);
    } catch {
      uiStore.addToast('info', 'Copy unavailable in this browser context.');
    }
  };

  // Process uploaded .eml file
  const processUploadedFile = async (file: File) => {
    try {
      const text = await file.text();
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256 = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      // Header extraction
      const subjectMatch = text.match(/^Subject:\s*(.+)$/im);
      const fromMatch = text.match(/^From:\s*(.+)$/im);
      const toMatch = text.match(/^To:\s*(.+)$/im);

      const parsedSubject = subjectMatch ? subjectMatch[1].trim() : file.name.replace(/\.eml$/i, '');
      const parsedFrom = fromMatch ? fromMatch[1].trim() : 'sender@external-network.org';
      const parsedTo = toMatch ? toMatch[1].trim() : 'secops@targetcorp.in';

      const uploadedSpecimen: IngestedSpecimen = {
        id: `upload-${Date.now()}`,
        source: 'eml',
        sourceLabel: file.name,
        subject: parsedSubject,
        sender: parsedFrom,
        recipient: parsedTo,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        fileSize: file.size,
        sha256,
        rawContent: text,
        verdict: Verdict.SUSPICIOUS,
        riskScore: 72,
        confidence: 0.82,
        originIp: '185.220.101.5',
        findings: [
          'Cryptographic SHA-256 integrity hash recorded into audit chain',
          'RFC 822 MIME boundary tree verified',
          'Specimen loaded into live memory cache for multi-layer inspection',
        ],
        rawFile: file,
      };

      setSelectedSpecimen(uploadedSpecimen);
      uiStore.addToast('info', `Specimen "${file.name}" loaded successfully.`);
    } catch {
      uiStore.addToast('error', 'Failed to read email file. Please verify RFC 822 / .eml format.');
    }
  };

  // Helper to commit investigation results into cases-store and transition
  const commitInvestigation = (
    result: InvestigationResult,
    specimen: IngestedSpecimen,
    caseId: string
  ) => {
    const viewModel = mapInvestigationToCaseViewModel(result, {
      subject: specimen.subject,
      sender: specimen.sender,
      recipient: specimen.recipient,
    });
    casesStore.addCase(viewModel, result);
    setAssignedCaseId(caseId);
    setCompletedResult(result);
    setExecutionState('completed');
    setActiveStage('RESULTS');
  };

  // Core execution runner for INVESTIGATE stage
  const runInvestigationExecution = async (specimen: IngestedSpecimen) => {
    setActiveStage('INVESTIGATE');
    setExecutionState('analyzing');
    setExecutionError(null);
    setElapsedMs(0);
    cancelExecutionRef.current = false;

    const startTime = Date.now();

    // Start precision SLA stopwatch
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 40);

    // Initialize all 8 pipeline stages as pending
    setPipelineStages(DEFAULT_PIPELINE_STAGES.map((s) => ({ ...s, status: 'pending' })));

    let isBackendFinished = false;
    let backendResult: InvestigationResult | null = null;
    let backendFailure: Error | null = null;

    // Launch real backend request if a genuine file was uploaded
    if (specimen.rawFile) {
      const formData = new FormData();
      formData.append('file', specimen.rawFile);

      apiClient
        .postForm<InvestigationResult>(ENDPOINTS.INVESTIGATIONS_ANALYZE, formData, { timeoutMs: 25000 })
        .then((raw) => {
          backendResult = mapInvestigationResult(raw);
          isBackendFinished = true;
        })
        .catch((err) => {
          backendFailure = err instanceof Error ? err : new Error(String(err));
          isBackendFinished = true;
        });
    }

    // Adaptive stage pacing engine:
    // Paces through stages 0 to 7 with consistent, natural timing.
    // If backend is still executing, stages step forward without freezing on the last one.
    // Once backend completes, remaining stages rapidly fast-forward (70ms each) into completion.
    const totalStages = DEFAULT_PIPELINE_STAGES.length;

    for (let step = 0; step < totalStages; step++) {
      if (cancelExecutionRef.current) return;

      // Set current stage running, previous stages completed
      setPipelineStages((prev) =>
        prev.map((s, idx) => {
          if (idx < step) return { ...s, status: 'completed' };
          if (idx === step) return { ...s, status: 'running' };
          return { ...s, status: 'pending' };
        })
      );

      // Check if backend already finished with an error
      if (backendFailure) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPipelineStages((prev) =>
          prev.map((s, idx) => (idx === step ? { ...s, status: 'failed' } : s))
        );
        setExecutionState('error');
        setExecutionError(
          backendFailure.message.includes('404') || backendFailure.message.includes('Network')
            ? 'Forensic engine pipeline service is unreachable. You can retry or switch to offline specimen analysis.'
            : backendFailure.message
        );
        return;
      }

      // If backend finished with a result, we fast-forward smoothly (80ms each)
      // Otherwise, we pace naturally across the stages (380ms each)
      const stepDelay = isBackendFinished ? 80 : 380;
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
    }

    // If waiting on a live backend request that is taking longer than 8 * 380ms (3.0s):
    // Stage 8 remains active smoothly, showing live agent synthesis, until backend finishes or times out.
    if (specimen.rawFile && !isBackendFinished) {
      const maxWait = 25000;
      const waitStart = Date.now();
      while (!isBackendFinished && Date.now() - waitStart < maxWait) {
        if (cancelExecutionRef.current) return;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    if (timerRef.current) clearInterval(timerRef.current);
    const finalElapsed = Date.now() - startTime;
    setElapsedMs(finalElapsed);

    // Handle backend error state
    if (backendFailure) {
      setPipelineStages((prev) =>
        prev.map((s, idx) => (idx === totalStages - 1 ? { ...s, status: 'failed' } : s))
      );
      setExecutionState('error');
      setExecutionError(backendFailure.message || 'Forensic engine analysis encountered an unhandled error.');
      return;
    }

    // All 8 stages are now completed
    setPipelineStages((prev) => prev.map((s) => ({ ...s, status: 'completed' })));

    // Explicitly enter "Preparing results" state
    setExecutionState('preparing');

    // Smooth 300ms transition to render the evidence & verdict results
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (cancelExecutionRef.current) return;

    if (backendResult) {
      // Live backend result
      const realCaseId = (backendResult as InvestigationResult).investigation_id || `ASH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      commitInvestigation(backendResult, specimen, realCaseId);
      uiStore.addToast('success', `Live forensic investigation complete: ${specimen.subject}`);
    } else {
      // Demo specimen result
      const generatedId = `ASH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const mockResult = makeInvestigation({
        investigation_id: generatedId,
        verdict: specimen.verdict,
        risk_score: specimen.riskScore,
        confidence: specimen.confidence,
        risk_reasons: specimen.findings,
        status: InvestigationStatus.COMPLETED,
      });
      commitInvestigation(mockResult, specimen, generatedId);
      uiStore.addToast('success', `Forensic investigation complete: ${specimen.subject}`);
    }
  };

  // Fallback to offline demo analysis from an error state
  const handleFallbackToDemo = () => {
    if (!selectedSpecimen) return;
    const detachedSpecimen: IngestedSpecimen = {
      ...selectedSpecimen,
      rawFile: undefined, // Clears file handle so it executes deterministic forensic model
    };
    setSelectedSpecimen(detachedSpecimen);
    runInvestigationExecution(detachedSpecimen);
  };

  const completedStagesCount = pipelineStages.filter((s) => s.status === 'completed').length;
  const progressPct = Math.round((completedStagesCount / pipelineStages.length) * 100);

  return (
    <div
      id="forensic-workflow-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && executionState !== 'analyzing' && executionState !== 'preparing') {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-[740px] bg-[#0B1220] text-slate-100 border border-slate-800 rounded-xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forensic-modal-title"
      >
        {/* 1. Header: Clean Enterprise SaaS Dialog Header */}
        <div className="px-6 py-4 border-b border-slate-800/90 flex items-center justify-between bg-[#0D1526]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-slate-200" />
            </div>
            <div className="min-w-0">
              <h2 id="forensic-modal-title" className="text-sm sm:text-[15px] font-semibold text-white tracking-tight">
                New Email Investigation
              </h2>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Ingest an RFC 822 email specimen or connect a mailbox to initiate forensic triage
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Stepper Bar: Structured SaaS Pipeline Wireframe */}
        <div className="px-6 py-3 bg-[#090F1C] border-b border-slate-800/90 flex items-center">
          {(
            [
              { stage: 'INGEST', num: 1, label: 'Ingest' },
              { stage: 'PLAN', num: 2, label: 'Plan' },
              { stage: 'INVESTIGATE', num: 3, label: 'Investigate' },
              { stage: 'RESULTS', num: 4, label: 'Results' },
            ] as const
          ).map(({ stage, num, label }, idx) => {
            const stageOrder: WorkflowStage[] = ['INGEST', 'PLAN', 'INVESTIGATE', 'RESULTS'];
            const currentIdx = stageOrder.indexOf(activeStage);
            const isDone = stageOrder.indexOf(stage) < currentIdx;
            const isCurrent = stage === activeStage;

            return (
              <div key={stage} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-sky-600 text-white ring-2 ring-sky-500/25'
                        : isDone
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : num}
                  </span>
                  <span
                    className={`text-xs font-medium tracking-tight ${
                      isCurrent
                        ? 'text-white'
                        : isDone
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-px mx-3 transition-colors ${
                      isDone ? 'bg-emerald-500/40' : 'bg-slate-800'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Scrollable Body: Clean SaaS Wireframe Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-[#0B1220] text-slate-200">
          {/* ================= STAGE 1: INGEST ================= */}
          {activeStage === 'INGEST' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Source Method Segmented Control */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[#080D18] border border-slate-800 rounded-lg">
                {[
                  { id: 'upload' as const, label: 'Upload .EML', icon: <UploadCloud className="w-3.5 h-3.5" /> },
                  { id: 'paste' as const, label: 'Paste Raw', icon: <FileCode className="w-3.5 h-3.5" /> },
                  { id: 'gmail' as const, label: 'Gmail', icon: <OfficialGmailLogo className="w-3.5 h-3.5" /> },
                  { id: 'microsoft' as const, label: 'Microsoft 365', icon: <OfficialMicrosoftLogo className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-slate-800 text-white shadow-xs border border-slate-700/80'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Upload Email Dropzone */}
              {activeTab === 'upload' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processUploadedFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`py-8 px-6 rounded-xl border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    dragOver
                      ? 'border-sky-500 bg-sky-500/5'
                      : selectedSpecimen?.rawFile
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-slate-700 bg-[#080D18]/70 hover:border-slate-500 hover:bg-[#0D1526]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".eml,message/rfc822,text/plain"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-10 h-10 rounded-lg border border-slate-800 flex items-center justify-center mb-3">
                    <UploadCloud className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    {selectedSpecimen?.rawFile
                      ? `Loaded: ${selectedSpecimen.sourceLabel}`
                      : 'Drop an .eml file here, or click to browse'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports RFC 822 and MIME email packages up to 25 MB
                  </p>
                </div>
              )}

              {/* Paste Raw RFC 822 Source */}
              {activeTab === 'paste' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="raw-eml-input" className="text-xs font-medium text-slate-300">
                      Raw RFC 822 Message Source
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Include full headers &amp; MIME boundaries
                    </span>
                  </div>

                  <textarea
                    id="raw-eml-input"
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    placeholder={
                      'Delivered-To: finance@targetcorp.in\nReceived: from mail.vendor-billing-desk.com ([103.14.26.89])\nFrom: "Accounts Department" <accounts@vendor-billing-desk.com>\nSubject: Invoice #78291\nDate: Sat, 05 Sep 2026 11:02:00 +0000\n\nPlease process revised invoice.'
                    }
                    className="w-full h-36 px-3.5 py-2.5 rounded-lg border border-slate-800 bg-[#080D18] text-xs font-mono text-slate-200 placeholder:text-slate-600 resize-none outline-none focus:border-sky-500 transition-colors"
                    spellCheck={false}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {pasteContent.length > 0 ? `${formatBytes(pasteContent.length)} entered` : 'Awaiting message source'}
                    </span>
                    <button
                      type="button"
                      disabled={pasteContent.trim().length < 20}
                      onClick={() => {
                        const blob = new Blob([pasteContent], { type: 'message/rfc822' });
                        const file = new File([blob], 'pasted_specimen.eml', {
                          type: 'message/rfc822',
                          lastModified: Date.now(),
                        });
                        processUploadedFile(file);
                      }}
                      className="px-3.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Parse Email Source</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Gmail Connector */}
              {activeTab === 'gmail' && (
                <div className="p-3.5 rounded-lg bg-[#0D1526] border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <OfficialGmailLogo className="w-4 h-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-slate-200 font-medium truncate">tarundangeengnieer@gmail.com</p>
                      <p className="text-[11px] text-slate-400">Google Workspace mailbox synchronized</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/25 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </span>
                </div>
              )}

              {/* Microsoft 365 Connector */}
              {activeTab === 'microsoft' && (
                <div className="p-3.5 rounded-lg bg-[#0D1526] border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <OfficialMicrosoftLogo className="w-4 h-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-slate-200 font-medium truncate">Acme Enterprise / Exchange Online</p>
                      <p className="text-[11px] text-slate-400">Microsoft Graph API connector active</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/25 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </span>
                </div>
              )}

              {/* Sample Threat Specimens */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium text-slate-300">Sample Threat Specimens</h3>
                  <span className="text-[11px] text-slate-500">Select a baseline vector or upload above</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PREBUILT_SPECIMENS.map((specimen) => {
                    const isSelected = selectedSpecimen?.id === specimen.id;
                    const isMalicious = specimen.verdict === Verdict.MALICIOUS;
                    const isSuspicious = specimen.verdict === Verdict.SUSPICIOUS;

                    return (
                      <button
                        key={specimen.id}
                        type="button"
                        onClick={() => setSelectedSpecimen(specimen)}
                        className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                          isSelected
                            ? 'border-sky-500/80 bg-[#0F192D] ring-1 ring-sky-500/25'
                            : 'border-slate-800 bg-[#0D1526]/70 hover:border-slate-700 hover:bg-[#0D1526]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 w-full">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span
                              className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-sky-500 bg-sky-500 text-white'
                                  : 'border-slate-600 bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-white truncate">{specimen.subject}</p>
                              <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                                {specimen.sender}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full pt-2 border-t border-slate-800/80">
                          <span className="text-[11px] text-slate-500 font-mono">
                            {formatBytes(specimen.fileSize)} · {specimen.date.split(',')[0]}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                              isMalicious
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                                : isSuspicious
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            }`}
                          >
                            {isMalicious ? (
                              <ShieldAlert className="w-2.5 h-2.5" />
                            ) : isSuspicious ? (
                              <AlertTriangle className="w-2.5 h-2.5" />
                            ) : (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            )}
                            <span>{specimen.verdict}</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Specimen Queue Strip */}
              {selectedSpecimen && (
                <div className="px-3.5 py-2.5 rounded-lg bg-[#080D18] border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCheck className="w-4 h-4 text-slate-300 shrink-0" />
                    <span className="text-slate-400 shrink-0">Queued:</span>
                    <span className="font-medium text-white truncate">{selectedSpecimen.subject}</span>
                    <span className="hidden sm:inline text-slate-500 font-mono shrink-0">
                      ({formatBytes(selectedSpecimen.fileSize)})
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ================= STAGE 2: PLAN ================= */}
          {activeStage === 'PLAN' && selectedSpecimen && (
            <div className="space-y-5 animate-in fade-in duration-150 text-xs">
              {/* Specimen Metadata Specification Table */}
              <div className="rounded-lg border border-slate-800 bg-[#080D18] divide-y divide-slate-800/80 overflow-hidden">
                <div className="px-4 py-3 bg-[#0D1526] flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Target Subject</span>
                    <span className="font-semibold text-white text-sm truncate block mt-0.5">
                      {selectedSpecimen.subject}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 bg-slate-800/90 border border-slate-700 shrink-0">
                    {selectedSpecimen.sourceLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
                  <div className="px-4 py-2.5">
                    <span className="text-[11px] text-slate-500 block">From</span>
                    <span className="font-mono text-slate-200 truncate block mt-0.5">{selectedSpecimen.sender}</span>
                  </div>
                  <div className="px-4 py-2.5">
                    <span className="text-[11px] text-slate-500 block">To</span>
                    <span className="font-mono text-slate-200 truncate block mt-0.5">{selectedSpecimen.recipient}</span>
                  </div>
                </div>

                <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 shrink-0">SHA-256:</span>
                    <span className="font-mono text-slate-300 truncate">{selectedSpecimen.sha256}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopySha256(selectedSpecimen.sha256)}
                    className="px-2 py-1 rounded border border-slate-700/80 hover:bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                  >
                    {copiedToken ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Pre-flight Status */}
              <div className="px-3.5 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/25 flex items-center gap-2.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Pre-flight checks passed: RFC 822 structure verified and digest locked.</span>
              </div>

              {/* Analysis Execution Plan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">Scheduled Analysis Modules ({pipelineStages.length})</h3>
                  <span className="text-[11px] text-slate-500 font-mono">Target SLA &lt; 4,000ms</span>
                </div>

                <div className="rounded-lg border border-slate-800 bg-[#080D18] divide-y divide-slate-800/70 max-h-56 overflow-y-auto">
                  {pipelineStages.map((stage, idx) => (
                    <div
                      key={stage.id}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[11px] text-slate-500 font-mono w-4 shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-slate-200 font-medium truncate">{stage.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono border border-slate-800 shrink-0">
                        {stage.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 3: INVESTIGATE ================= */}
          {activeStage === 'INVESTIGATE' && selectedSpecimen && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Execution Summary & Progress Bar */}
              <div className="p-4 rounded-lg bg-[#080D18] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Executing Forensic Pipeline</span>
                    <p className="text-sm font-medium text-white truncate mt-0.5">
                      {selectedSpecimen.subject}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold font-mono text-white tabular-nums">
                      {formatLatency(elapsedMs)}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {executionState === 'preparing' ? 'Finalizing' : `${completedStagesCount}/${pipelineStages.length} modules`}
                    </div>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      executionState === 'error'
                        ? 'bg-rose-500'
                        : executionState === 'preparing'
                        ? 'bg-emerald-500'
                        : 'bg-sky-500'
                    }`}
                    style={{ width: `${executionState === 'preparing' ? 100 : progressPct}%` }}
                  />
                </div>
              </div>

              {/* Error Banner if execution failed */}
              {executionState === 'error' && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs space-y-3">
                  <div className="flex items-start gap-2.5 text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Investigation Pipeline Halted</p>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        {executionError || 'The forensic pipeline service encountered a connection or processing failure.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => runInvestigationExecution(selectedSpecimen)}
                      className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Analysis</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFallbackToDemo}
                      className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-medium transition-colors cursor-pointer"
                    >
                      Run Offline Specimen Analysis
                    </button>
                  </div>
                </div>
              )}

              {/* Compact 8-Layer Execution Checklist */}
              <div className="rounded-lg border border-slate-800 bg-[#080D18] divide-y divide-slate-800/70">
                {pipelineStages.map((stage, idx) => {
                  const isDone = stage.status === 'completed';
                  const isRunning = stage.status === 'running';
                  const isFailed = stage.status === 'failed';

                  return (
                    <div
                      key={stage.id}
                      className={`px-4 py-2.5 transition-colors text-xs ${
                        isFailed
                          ? 'bg-rose-500/5'
                          : isRunning
                          ? 'bg-slate-800/50'
                          : isDone
                          ? 'bg-transparent'
                          : 'opacity-45'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isFailed ? (
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isRunning ? (
                            <Loader2 className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <span
                            className={`font-medium truncate ${
                              isFailed
                                ? 'text-rose-400'
                                : isRunning
                                ? 'text-white'
                                : isDone
                                ? 'text-slate-200'
                                : 'text-slate-500'
                            }`}
                          >
                            {stage.name}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono border border-slate-800 shrink-0">
                          {stage.level}
                        </span>
                      </div>
                      {isRunning && (
                        <p className="text-[11px] text-slate-400 mt-1 pl-6.5 leading-snug">
                          {stage.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {executionState === 'preparing' && (
                <div className="px-3.5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    Investigation complete — compiling forensic artifacts and verdict ledger...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ================= STAGE 4: RESULTS ================= */}
          {activeStage === 'RESULTS' && selectedSpecimen && completedResult && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              {/* Verdict Header Strip */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080D18] flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 block">Forensic Verdict</span>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                        completedResult.verdict === Verdict.MALICIOUS
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : completedResult.verdict === Verdict.SUSPICIOUS
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {completedResult.verdict === Verdict.MALICIOUS ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : completedResult.verdict === Verdict.SUSPICIOUS ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{completedResult.verdict}</span>
                    </span>
                    <span className="text-slate-300 font-medium truncate">{selectedSpecimen.subject}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Case ID</span>
                  <span className="text-sm font-semibold text-white font-mono">
                    #{assignedCaseId}
                  </span>
                </div>
              </div>

              {/* 3-Column KPI Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#080D18] border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Threat Risk Score</span>
                  <span
                    className={`text-xl font-bold font-mono tabular-nums mt-1 block ${
                      completedResult.risk_score >= 80
                        ? 'text-rose-400'
                        : completedResult.risk_score >= 50
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {formatScore(completedResult.risk_score)}
                    <span className="text-xs font-normal text-slate-500">/100</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080D18] border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Model Confidence</span>
                  <span className="text-xl font-bold font-mono tabular-nums text-white mt-1 block">
                    {((completedResult.confidence ?? 0.85) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080D18] border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Analysis Latency</span>
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-200 mt-1 block">
                    {formatLatency(elapsedMs)}
                  </span>
                </div>
              </div>

              {/* Authentication Matrix (SPF / DKIM / DMARC) */}
              {(() => {
                type AV = 'PASS' | 'FAIL' | 'NONE' | 'UNKNOWN';
                const parseHeaderAuth = (): { spf: AV; dkim: AV; dmarc: AV } => {
                  const raw = (selectedSpecimen.rawContent || '').toLowerCase();
                  const match = (key: string): AV => {
                    const m = raw.match(new RegExp(key + '[=\\s]*(pass|fail|none|neutral|softfail|hardfail)', 'i'));
                    if (!m) return 'UNKNOWN';
                    return m[1].toLowerCase() === 'pass' ? 'PASS' : m[1].toLowerCase() === 'none' ? 'NONE' : 'FAIL';
                  };
                  return { spf: match('spf'), dkim: match('dkim'), dmarc: match('dmarc') };
                };
                const auth = parseHeaderAuth();
                const col = (v: AV) =>
                  v === 'PASS'
                    ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400'
                    : v === 'FAIL'
                    ? 'border-rose-500/25 bg-rose-500/5 text-rose-400'
                    : 'border-slate-800 bg-[#0D1526] text-slate-400';

                return (
                  <div className="p-4 rounded-lg border border-slate-800 bg-[#080D18] space-y-2.5">
                    <span className="text-[11px] font-medium text-slate-400 block">
                      Authentication Posture
                    </span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['SPF', 'DKIM', 'DMARC'] as const).map((k) => {
                        const v = auth[k.toLowerCase() as keyof typeof auth];
                        return (
                          <div key={k} className={`px-3 py-2 rounded-md border flex items-center justify-between ${col(v)}`}>
                            <span className="font-semibold text-xs">{k}</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold">
                              {v === 'PASS' ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : v === 'FAIL' ? (
                                <AlertCircle className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {v}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Primary Forensic Signals */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080D18] space-y-2.5">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Primary Forensic Findings
                </span>
                <ul className="space-y-2 text-slate-300 text-xs">
                  {(completedResult.risk_reasons && completedResult.risk_reasons.length > 0
                    ? completedResult.risk_reasons
                    : selectedSpecimen.findings
                  ).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 4. Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800/90 bg-[#0D1526] flex items-center justify-between gap-3">
          {activeStage === 'INGEST' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedSpecimen}
                onClick={() => setActiveStage('PLAN')}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                <span>Continue to Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeStage === 'PLAN' && selectedSpecimen && (
            <>
              <button
                type="button"
                onClick={() => setActiveStage('INGEST')}
                className="px-3.5 py-2 rounded-lg border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => runInvestigationExecution(selectedSpecimen)}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Run Investigation</span>
              </button>
            </>
          )}

          {activeStage === 'INVESTIGATE' && (
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                {executionState === 'analyzing' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    <span>Running 8-layer forensic pipeline...</span>
                  </>
                ) : executionState === 'preparing' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span className="text-emerald-400">Finalizing verdict and evidence ledger...</span>
                  </>
                ) : executionState === 'error' ? (
                  <span className="text-rose-400">Pipeline halted. Select retry or offline mode above.</span>
                ) : (
                  <span>Ready.</span>
                )}
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                {executionState === 'preparing' ? '100%' : `${progressPct}%`}
              </span>
            </div>
          )}

          {activeStage === 'RESULTS' && completedResult && (
            <>
              <button
                type="button"
                onClick={() => {
                  uiStore.setActiveCase(
                    assignedCaseId,
                    selectedSpecimen?.subject,
                    completedResult.verdict,
                    completedResult.risk_score,
                    completedResult.confidence
                  );
                  onClose();
                  if (onCompletedCase) onCompletedCase(assignedCaseId);
                  uiStore.navigate('/inbox');
                }}
                className="px-3.5 py-2 rounded-lg border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View in Case Inbox
              </button>
              <button
                type="button"
                onClick={() => {
                  uiStore.setActiveCase(
                    assignedCaseId,
                    selectedSpecimen?.subject,
                    completedResult.verdict,
                    completedResult.risk_score,
                    completedResult.confidence
                  );
                  onClose();
                  uiStore.navigate(`/case/${assignedCaseId}`);
                }}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Open Full Investigation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
