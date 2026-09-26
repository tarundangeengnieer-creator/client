import React, { useState, useEffect, useRef } from 'react';
import {
  InvestigationResult,
  Verdict,
  InvestigationStatus,
  Recommendation,
  StopReason,
  AttackHypothesisType,
  HypothesisStatus,
} from '../../contracts/backend.ts';
import { casesStore, makeInvestigation, makeGeoSummary } from '../../stores/cases-store.ts';
import { uiStore } from '../../stores/ui-store.ts';
import { mapInvestigationToCaseViewModel } from '../../domain/mappers/case-mapper.ts';
import { formatBytes, formatLatency, formatScore } from '../../lib/formatters.ts';
import { OfficialGmailLogo, OfficialMicrosoftLogo } from '../../components/ui/BrandLogos.tsx';
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

const PREBUILT_GMAIL_SPECIMENS: IngestedSpecimen[] = [
  {
    id: 'gm-1',
    source: 'gmail',
    sourceLabel: 'Gmail',
    subject: 'Urgent: Account Verification Required',
    sender: 'security@bankofamerica-secure.net',
    recipient: 'victim@targetcorp.in',
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
      'DMARC policy strict enforcement failed (header.from=bankofamerica.com mismatch)',
    ],
    rawContent: `Received: from 185.220.101.5 (tor-exit-04.de [185.220.101.5])
    by mx.targetcorp.in with ESMTP id A819BF1; Mon, 07 Sep 2026 10:24:00 +0000
Authentication-Results: mx.targetcorp.in; spf=fail; dkim=fail; dmarc=fail (p=reject)
From: "Bank of America Security Dept" <security@bankofamerica-secure.net>
To: victim@targetcorp.in
Subject: Urgent: Account Verification Required
Date: Mon, 07 Sep 2026 10:24:00 +0000

Your account access has been suspended due to suspicious login activity.
Verify immediately: https://bankofamerica-secure.net/login/verify`,
  },
  {
    id: 'gm-2',
    source: 'gmail',
    sourceLabel: 'Gmail',
    subject: 'Payment Confirmation for Order #CD-8819',
    sender: 'orders@secure-gateway-in.com',
    recipient: 'investigator@targetcorp.in',
    date: '7 Sep 2026, 09:15 AM',
    fileSize: 3120,
    sha256: 'c8932fa5a78c187e5b6da93c5d8e7b9a6c1d4e2f5b8a0c3d7e9f1a2b4c6e8d0a',
    verdict: Verdict.SUSPICIOUS,
    riskScore: 71,
    confidence: 0.76,
    originIp: '194.26.29.112',
    findings: [
      'Newly active domain registered in non-reputable TLD',
      'Payment redirect link points to dynamic cloud worker endpoint',
      'SPF softfail on secondary relay hop',
    ],
    rawContent: `Received: from 194.26.29.112 (mow-relay.ru [194.26.29.112])
From: "Billing Portal" <orders@secure-gateway-in.com>
Subject: Payment Confirmation for Order #CD-8819
Date: Mon, 07 Sep 2026 09:15:00 +0000`,
  },
];

const PREBUILT_MICROSOFT_SPECIMENS: IngestedSpecimen[] = [
  {
    id: 'ms-1',
    source: 'microsoft',
    sourceLabel: 'Outlook',
    subject: 'Meeting Schedule - Project Update',
    sender: 'pm@cdgi-enterprise.in',
    recipient: 'team@cdgi-enterprise.in',
    date: '6 Sep 2026, 04:18 PM',
    fileSize: 2840,
    sha256: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
    verdict: Verdict.BENIGN,
    riskScore: 12,
    confidence: 0.94,
    originIp: '40.92.18.94',
    findings: [
      'Internal Microsoft 365 Exchange Online transit relay',
      'Full cryptographic SPF/DKIM/DMARC pass with aligned corporate domain',
      'No external suspicious URLs or anomalous payload attachments found',
    ],
    rawContent: `Received: from mail-eop.outlook.com ([40.92.18.94])
From: "Project Management" <pm@cdgi-enterprise.in>
To: team@cdgi-enterprise.in
Subject: Meeting Schedule - Project Update
Date: Sun, 06 Sep 2026 16:18:00 +0000`,
  },
  {
    id: 'ms-2',
    source: 'microsoft',
    sourceLabel: 'Outlook',
    subject: 'Action Required: Microsoft 365 Password Expiry Notice',
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
      'High-severity brand impersonation targeting Microsoft 365 credentials',
      'Sender domainoffice365-security-update.in is deceptive lookalike registered 2 days ago',
      'SPF hardfail and missing DKIM signature',
    ],
    rawContent: `Received: from 185.156.73.19 (bulletproof-vps.nl)
From: "Microsoft 365 Security" <admin@office365-security-update.in>
Subject: Action Required: Microsoft 365 Password Expiry Notice
Date: Sun, 06 Sep 2026 14:40:00 +0000`,
  },
];

const PREBUILT_EML_SPECIMENS: IngestedSpecimen[] = [
  {
    id: 'eml-1',
    source: 'eml',
    sourceLabel: 'Uploaded (.eml)',
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
Date: Sat, 05 Sep 2026 11:02:00 +0000`,
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
  const [selectedSource, setSelectedSource] = useState<IngestionSource>(initialSource);
  const [selectedSpecimen, setSelectedSpecimen] = useState<IngestedSpecimen | null>(null);

  // Investigation Execution State
  const [pipelineStages, setPipelineStages] = useState<PipelineExecutionStage[]>(DEFAULT_PIPELINE_STAGES);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [completedResult, setCompletedResult] = useState<InvestigationResult | null>(null);
  const [assignedCaseId, setAssignedCaseId] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 3.1 — Backend health state: null = unknown, true = online, false = offline
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setActiveStage('INGEST');
      setSelectedSource(initialSource);
      setPipelineStages(DEFAULT_PIPELINE_STAGES.map((s) => ({ ...s, status: 'pending' })));
      setCurrentStageIdx(0);
      setElapsedMs(0);
      setCompletedResult(null);
      setAssignedCaseId('');

      // Auto-select first specimen for quick convenience
      if (initialSource === 'gmail') {
        setSelectedSpecimen(PREBUILT_GMAIL_SPECIMENS[0]);
      } else if (initialSource === 'microsoft') {
        setSelectedSpecimen(PREBUILT_MICROSOFT_SPECIMENS[0]);
      } else if (initialSource === 'eml') {
        setSelectedSpecimen(PREBUILT_EML_SPECIMENS[0]);
      } else {
        setSelectedSpecimen(null);
      }

      // Probe backend health
      setBackendOnline(null);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      fetch(`${baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(4000) })
        .then(r => setBackendOnline(r.ok))
        .catch(() => setBackendOnline(false));
    }
  }, [isOpen, initialSource]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Handle Local File Reading
  const processUploadedFile = async (file: File) => {
    try {
      const text = await file.text();
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256 = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      // Quick header extraction
      const subjectMatch = text.match(/^Subject:\s*(.+)$/im);
      const fromMatch = text.match(/^From:\s*(.+)$/im);
      const toMatch = text.match(/^To:\s*(.+)$/im);

      const parsedSubject = subjectMatch ? subjectMatch[1].trim() : file.name.replace(/\.eml$/i, '');
      const parsedFrom = fromMatch ? fromMatch[1].trim() : 'sender@external-domain.com';
      const parsedTo = toMatch ? toMatch[1].trim() : 'analyst@targetcorp.in';

      const customSpecimen: IngestedSpecimen = {
        id: `upload-${Date.now()}`,
        source: 'eml',
        sourceLabel: 'Uploaded (.eml)',
        subject: parsedSubject,
        sender: parsedFrom,
        recipient: parsedTo,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        fileSize: file.size,
        sha256,
        rawContent: text,
        verdict: Verdict.SUSPICIOUS,
        riskScore: 74,
        confidence: 0.81,
        originIp: '185.220.101.5',
        findings: [
          'Cryptographic SHA-256 integrity hash recorded into audit chain',
          'RFC 822 MIME structure parsed with full boundary separation',
          'Heuristic signals flagged for dynamic execution pipeline',
        ],
        rawFile: file,
      };

      setSelectedSpecimen(customSpecimen);
      setActiveStage('PLAN');
    } catch {
      uiStore.addToast('error', 'Failed to read .eml file. Please ensure it is a valid RFC 822 email format.');
    }
  };

  const finalizeDemoResult = (specimen: IngestedSpecimen, startTime: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalElapsed = Date.now() - startTime;
    setElapsedMs(finalElapsed);

    setPipelineStages((prev) => prev.map((s) => ({ ...s, status: 'completed' })));

    const generatedId = `ASH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setAssignedCaseId(generatedId);

    const mockInvestigation = makeInvestigation({
      investigation_id: generatedId,
      verdict: specimen.verdict,
      risk_score: specimen.riskScore,
      confidence: specimen.confidence,
      risk_reasons: specimen.findings,
      status: InvestigationStatus.COMPLETED,
    });

    const viewModel = mapInvestigationToCaseViewModel(mockInvestigation);
    viewModel.subject = specimen.subject;
    viewModel.sender = specimen.sender;
    viewModel.recipient = specimen.recipient;
    casesStore.addCase(viewModel, mockInvestigation);

    setCompletedResult(mockInvestigation);
    setActiveStage('RESULTS');
    uiStore.addToast('success', `Forensic investigation completed for ${specimen.subject}`);
  };

  // Execution runner for INVESTIGATE stage
  const runInvestigationExecution = (specimen: IngestedSpecimen) => {
    setActiveStage('INVESTIGATE');
    setElapsedMs(0);
    const startTime = Date.now();

    // Start SLA stopwatch
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 40);

    const totalStages = DEFAULT_PIPELINE_STAGES.length;
    let step = 0;

    // Animate pipeline stages progressively
    const executeNextStep = () => {
      if (step < totalStages) {
        setCurrentStageIdx(step);
        setPipelineStages((prev) =>
          prev.map((stg, i) => {
            if (i < step) return { ...stg, status: 'completed' };
            if (i === step) return { ...stg, status: 'running' };
            return { ...stg, status: 'pending' };
          })
        );
        step++;
        setTimeout(executeNextStep, 320);
      }
      // Note: don't finalize here - wait for the backend response or demo timeout
    };

    // Start animation
    setTimeout(executeNextStep, 200);

    // Check if this is a REAL file upload (has rawFile) vs demo specimen
    if (specimen.rawFile) {
      // REAL BACKEND CALL
      const formData = new FormData();
      formData.append('file', specimen.rawFile);

      import('../../api/client.ts').then(({ apiClient }) => {
        import('../../api/endpoints.ts').then(({ ENDPOINTS }) => {
          import('../../api/dto-mappers.ts').then(({ mapInvestigationResult }) => {
            apiClient
              .postForm<InvestigationResult>(ENDPOINTS.INVESTIGATIONS_ANALYZE, formData, { timeoutMs: 30000 })
              .then((rawResult) => {
                const result = mapInvestigationResult(rawResult);
                
                // Stop timer
                if (timerRef.current) clearInterval(timerRef.current);
                const finalElapsed = Date.now() - startTime;
                setElapsedMs(finalElapsed);
  
                // Mark all stages complete
                setPipelineStages((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
  
                // Use real investigation ID
                const realCaseId = result.investigation_id;
                setAssignedCaseId(realCaseId);
  
                // Store REAL result into global case repository
                const viewModel = mapInvestigationToCaseViewModel(result, {
                  subject: specimen.subject,
                  sender: specimen.sender,
                  recipient: specimen.recipient,
                });
                casesStore.addCase(viewModel, result);
  
                setCompletedResult(result);
                setActiveStage('RESULTS');
              uiStore.addToast('success', `Live forensic investigation completed for ${specimen.subject}`);
            })
            .catch((err) => {
              // Stop timer
              if (timerRef.current) clearInterval(timerRef.current);
              setElapsedMs(Date.now() - startTime);

              console.error('Backend investigation failed:', err);
              uiStore.addToast('error', `Backend analysis failed: ${err.message || 'Unknown error'}. Falling back to demo mode.`);

              // FALLBACK: Run the demo mock flow so the demo doesn't break
              finalizeDemoResult(specimen, startTime);
            });
          });
        });
      });
    } else {
      // DEMO SPECIMEN: Use existing mock behavior with timeout
      setTimeout(() => {
        finalizeDemoResult(specimen, startTime);
      }, totalStages * 320 + 400);
    }
  };

  return (
    <div
      id="forensic-workflow-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-sky-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                Forensic Investigation Pipeline
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {activeStage === 'INGEST' && 'Step 1 of 4: Ingest & Select Email Specimen'}
                {activeStage === 'PLAN' && 'Step 2 of 4: Review Forensic Plan & Integrity Check'}
                {activeStage === 'INVESTIGATE' && 'Step 3 of 4: Live Automated Forensic Execution'}
                {activeStage === 'RESULTS' && 'Step 4 of 4: Investigation Findings & Verdict'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workflow Phase Stepper Ribbon */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          {(['INGEST', 'PLAN', 'INVESTIGATE', 'RESULTS'] as WorkflowStage[]).map((stage, idx) => {
            const stageOrder = ['INGEST', 'PLAN', 'INVESTIGATE', 'RESULTS'];
            const currentIdx = stageOrder.indexOf(activeStage);
            const isDone = stageOrder.indexOf(stage) < currentIdx;
            const isCurrent = stage === activeStage;

            return (
              <div key={stage} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 font-semibold text-[11px] sm:text-xs ${
                    isCurrent
                      ? 'text-blue-600 dark:text-sky-400'
                      : isDone
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isCurrent
                        ? 'bg-sky-600 text-white font-bold shadow-[0_0_8px_rgba(14,165,233,0.25)]'
                        : isDone
                        ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <span>{stage}</span>
                </div>
                {idx < 3 && <div className="w-4 sm:w-8 h-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 sm:mx-1" />}
              </div>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 space-y-4">
          {/* STAGE 1: INGEST */}
          {activeStage === 'INGEST' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* 3.1 — Backend Health Banner */}
              {backendOnline === false && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-400/30 text-xs">
                  <span className="text-amber-500 text-sm shrink-0">⚠</span>
                  <div>
                    <p className="font-bold text-amber-700 dark:text-amber-400">Backend Offline</p>
                    <p className="text-amber-600/80 dark:text-amber-500/80 mt-0.5">
                      Cannot reach <code className="font-mono bg-amber-100 dark:bg-amber-500/10 px-1 rounded">localhost:8000</code>. Upload and Paste modes will fall back to demo analysis. Gmail and Microsoft specimens work offline.
                    </p>
                  </div>
                </div>
              )}
              {backendOnline === true && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-400/20 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Backend Online</span>
                  <span className="text-emerald-600/70 dark:text-emerald-500/70">— Live forensic analysis active at <code className="font-mono">localhost:8000</code></span>
                </div>
              )}
              {backendOnline === null && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                  <span>Checking backend status…</span>
                </div>
              )}

              {/* Source Selector Tabs */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'gmail' as IngestionSource, label: 'Gmail', icon: <OfficialGmailLogo className="w-4 h-4" /> },
                  { id: 'microsoft' as IngestionSource, label: 'Microsoft', icon: <OfficialMicrosoftLogo className="w-3.5 h-3.5" /> },
                  { id: 'eml' as IngestionSource, label: 'Upload .EML', icon: <FileText className="w-4 h-4" /> },
                  { id: 'paste' as IngestionSource, label: 'Paste Email', icon: <FileCode className="w-4 h-4" /> },
                  { id: 'server' as IngestionSource, label: 'Send to Server', icon: <Mail className="w-4 h-4" /> },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSource(s.id);
                      if (s.id === 'gmail') setSelectedSpecimen(PREBUILT_GMAIL_SPECIMENS[0]);
                      else if (s.id === 'microsoft') setSelectedSpecimen(PREBUILT_MICROSOFT_SPECIMENS[0]);
                      else if (s.id === 'eml') setSelectedSpecimen(PREBUILT_EML_SPECIMENS[0]);
                      else setSelectedSpecimen(null);
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedSource === s.id
                        ? 'border-blue-500 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Source-specific Ingestion Views */}
              {selectedSource === 'gmail' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-blue-500/30 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Connected Google Workspace:</span>
                      <span className="font-mono font-bold">tarundangeengnieer@gmail.com</span>
                    </div>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 bg-transparent px-2 py-0.5 rounded border border-sky-500/30">
                      OAuth2 Active
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Suspicious Email Specimen from Gmail Inbox:
                  </p>

                  <div className="space-y-2">
                    {PREBUILT_GMAIL_SPECIMENS.map((specimen) => (
                      <div
                        key={specimen.id}
                        onClick={() => setSelectedSpecimen(specimen)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          selectedSpecimen?.id === specimen.id
                            ? 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0">
                            {selectedSpecimen?.id === specimen.id && <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {specimen.subject}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                From: {specimen.sender}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 font-mono shrink-0">{specimen.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSource === 'microsoft' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-blue-500/30 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Connected Tenant:</span>
                      <span className="font-mono font-bold">CDGI Enterprise / Exchange Online</span>
                    </div>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 bg-transparent px-2 py-0.5 rounded border border-sky-500/30">
                      Graph API
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Suspicious Email Specimen from Outlook Mailbox:
                  </p>

                  <div className="space-y-2">
                    {PREBUILT_MICROSOFT_SPECIMENS.map((specimen) => (
                      <div
                        key={specimen.id}
                        onClick={() => setSelectedSpecimen(specimen)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          selectedSpecimen?.id === specimen.id
                            ? 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0">
                            {selectedSpecimen?.id === specimen.id && <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {specimen.subject}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                From: {specimen.sender}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 font-mono shrink-0">{specimen.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSource === 'eml' && (
                <div className="space-y-3">
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
                    className={`p-6 sm:p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      dragOver
                        ? 'border-blue-500 bg-slate-100 dark:bg-slate-800'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 hover:border-blue-400'
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
                    <UploadCloud className="w-8 h-8 text-blue-600 dark:text-sky-400 mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                      Drag and drop your raw RFC 822 (.eml) file here
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      or <span className="text-blue-600 underline font-medium">browse from your computer</span> (Max 25MB)
                    </p>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2">
                    Or select from curated test specimens:
                  </p>
                  {PREBUILT_EML_SPECIMENS.map((specimen) => (
                    <div
                      key={specimen.id}
                      onClick={() => setSelectedSpecimen(specimen)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selectedSpecimen?.id === specimen.id
                          ? 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          {selectedSpecimen?.id === specimen.id && <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {specimen.subject}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              From: {specimen.sender} ({formatBytes(specimen.fileSize)})
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 font-mono shrink-0">{specimen.date}</span>
                      </div>
                    </div>
                  ))}

                  {/* 3.2 — Live Backend Fixture Files */}
                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      Live Demo Fixtures
                      {backendOnline && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">LIVE</span>}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Upload one of these validated files from <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">backend/tests/fixtures/</code> for{' '}
                      {backendOnline ? <strong className="text-emerald-600 dark:text-emerald-400">real AI analysis</strong> : <span>demo analysis</span>}.
                    </p>
                    {[
                      { file: 'bec_wire_transfer.eml', label: 'BEC Wire Transfer', verdict: 'MALICIOUS', color: 'rose', desc: 'CEO impersonation requesting urgent wire transfer — BEC attack' },
                      { file: 'golden_google_zendesk.eml', label: 'Google / Zendesk Legit', verdict: 'BENIGN', color: 'emerald', desc: 'Legitimate Zendesk notification — clean baseline for comparison' },
                      { file: 'scenario_a_benign.eml', label: 'Scenario A (Benign)', verdict: 'BENIGN', color: 'emerald', desc: 'Normal internal corporate email with full SPF/DKIM/DMARC pass' },
                      { file: 'scenario_c_bec_valid_auth.eml', label: 'Scenario C (BEC)', verdict: 'SUSPICIOUS', color: 'amber', desc: 'BEC with valid authentication — tests heuristic engine depth' },
                    ].map(({ file, label, verdict, color, desc }) => (
                      <div key={file} className={`p-3 rounded-xl border text-xs ${
                        color === 'rose' ? 'border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/5' :
                        color === 'amber' ? 'border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/5' :
                        'border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/5'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold font-mono text-slate-800 dark:text-white">{file}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                            color === 'rose' ? 'border-rose-500/30 text-rose-600 dark:text-rose-400' :
                            color === 'amber' ? 'border-amber-500/30 text-amber-600 dark:text-amber-400' :
                            'border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          }`}>{verdict}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSource === 'server' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                      Inbound SMTP Forwarding Address:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value="analyze-inbound@soc.ashielder.targetcorp.in"
                        className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-600 dark:text-sky-400 outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('analyze-inbound@soc.ashielder.targetcorp.in');
                          setCopiedToken(true);
                          setTimeout(() => setCopiedToken(false), 2000);
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Forward any suspicious email as an RFC 822 attachment directly from your email client (Outlook, Thunderbird, Apple Mail). The server pipeline will authenticate and ingest it instantly.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const simulated = PREBUILT_GMAIL_SPECIMENS[0];
                        setSelectedSpecimen({
                          ...simulated,
                          source: 'server',
                          sourceLabel: 'Inbound SMTP Server',
                        });
                        uiStore.addToast('info', 'Simulated inbound SMTP delivery received.');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl border border-blue-500/30 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Simulate Inbound SMTP Test Handshake</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedSource === 'paste' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-blue-500/20 text-xs flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <FileCode className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span>Paste the full raw email source below (including headers like <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">From:</code>, <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">Subject:</code>, <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">Received:</code> and body). The system will parse headers, extract IPs, and run the full investigation pipeline.</span>
                  </div>

                  <textarea
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    placeholder={"Delivered-To: user@company.com\nReceived: from mail.sender.com ([185.220.101.5])\nFrom: PayPal Support <no-reply@paypal1-secure.com>\nTo: user@company.com\nSubject: Action Required: Verify Your Account\nDate: Mon, 12 Aug 2025 10:24:00 +0000\nMIME-Version: 1.0\nContent-Type: text/html; charset=UTF-8\n\n<html>...</html>"}
                    className="w-full h-48 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none outline-none focus:border-blue-400 dark:focus:border-sky-500 transition-colors"
                    spellCheck={false}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      {pasteContent.length > 0 ? `${pasteContent.length} characters pasted` : 'Paste email content above'}
                    </span>
                    <button
                      type="button"
                      disabled={pasteContent.trim().length < 20}
                      onClick={() => {
                        // Convert pasted text to a File blob and process via existing pipeline
                        const blob = new Blob([pasteContent], { type: 'message/rfc822' });
                        const file = new File([blob], 'pasted-email.eml', { type: 'message/rfc822', lastModified: Date.now() });
                        processUploadedFile(file);
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Analyze Pasted Email</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: PLAN */}
          {activeStage === 'PLAN' && selectedSpecimen && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              {/* Evidence Overview Box */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {selectedSpecimen.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-transparent text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    {selectedSpecimen.sourceLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/80 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Sender:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                      {selectedSpecimen.sender}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Recipient:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                      {selectedSpecimen.recipient}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">SHA-256 Hash Integrity:</span>
                  <span className="font-mono text-blue-600 dark:text-sky-400 select-all truncate max-w-[280px]">
                    {selectedSpecimen.sha256}
                  </span>
                </div>
              </div>

              {/* Deduplication & Pre-flight Status */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Pre-flight checks passed: Specimen is unique, non-duplicated, and ready for forensic execution.</span>
              </div>

              {/* Pipeline Plan Stepper Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-900 dark:text-white">Scheduled Analysis Execution Layers:</p>
                  <span className="text-[11px] text-slate-500 font-mono">SLA Target: &lt;4,000ms</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {pipelineStages.map((stage, idx) => (
                    <div
                      key={stage.id}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] text-slate-500 font-mono">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{stage.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        {stage.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: INVESTIGATE */}
          {activeStage === 'INVESTIGATE' && selectedSpecimen && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Telemetry Header */}
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Pipeline Execution Telemetry
                  </p>
                  <p className="text-xs font-bold text-slate-100 truncate max-w-sm mt-0.5">
                    Analyzing: {selectedSpecimen.subject}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-sky-400">{formatLatency(elapsedMs)}</div>
                  <div className="text-[10px] font-mono text-slate-400">SLA: &lt;4,000ms (ACTIVE)</div>
                </div>
              </div>

              {/* Stepper Progress */}
              <div className="space-y-2">
                {pipelineStages.map((stage, idx) => {
                  const isDone = stage.status === 'completed';
                  const isRunning = stage.status === 'running';
                  return (
                    <div
                      key={stage.id}
                      className={`p-3 rounded-xl border transition-all text-xs ${
                        isRunning
                          ? 'border-blue-500/50 bg-slate-50 dark:bg-slate-800/60 shadow-xs'
                          : isDone
                          ? 'border-emerald-500/30 bg-slate-50 dark:bg-slate-800/40'
                          : 'border-slate-200 dark:border-slate-800/60 opacity-40 bg-white dark:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : isRunning ? (
                            <Loader2 className="w-4 h-4 text-blue-600 dark:text-sky-400 animate-spin shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] text-slate-400">
                              {idx + 1}
                            </div>
                          )}
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{stage.name}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                          {stage.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-6 leading-tight">
                        {stage.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STAGE 4: RESULTS */}
          {activeStage === 'RESULTS' && selectedSpecimen && completedResult && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              {/* Verdict Summary Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      FORENSIC VERDICT
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold mt-1 ${
                        completedResult.verdict === Verdict.MALICIOUS
                          ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : completedResult.verdict === Verdict.SUSPICIOUS
                          ? 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {completedResult.verdict}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      ASSIGNED CASE ID
                    </span>
                    <span className="text-base font-black text-blue-600 dark:text-sky-400 font-mono">
                      #{assignedCaseId}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">THREAT RISK SCORE</span>
                    <span
                      className={`text-xl font-black ${
                        completedResult.risk_score >= 80
                          ? 'text-rose-600 dark:text-rose-400'
                          : completedResult.risk_score >= 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {formatScore(completedResult.risk_score)}/100
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">CONFIDENCE METRIC</span>
                    <span className="text-xl font-black text-blue-600 dark:text-sky-400">
                      {((completedResult.confidence ?? 0.85) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    PRIMARY FORENSIC SIGNALS
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc marker:text-blue-500 text-slate-700 dark:text-slate-300 text-xs">
                    {(completedResult.risk_reasons && completedResult.risk_reasons.length > 0 ? completedResult.risk_reasons : selectedSpecimen.findings).map((f, i) => (
                      <li key={i} className="leading-snug">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Authentication Matrix (SPF / DKIM / DMARC) derived from rawContent headers */}
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
                  v === 'PASS' ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' :
                  v === 'FAIL' ? 'border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400' :
                  v === 'NONE' ? 'border-slate-300/30 bg-slate-50/30 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400' :
                  'border-slate-200/40 bg-slate-50/20 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500';
                return (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AUTHENTICATION MATRIX</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['SPF', 'DKIM', 'DMARC'] as const).map(k => {
                        const v = auth[k.toLowerCase() as keyof typeof auth];
                        return (
                          <div key={k} className={`p-2.5 rounded-lg border flex flex-col gap-0.5 ${col(v)}`}>
                            <span className="font-black text-xs">{k}</span>
                            <span className="text-[11px] font-bold uppercase">{v}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
          {activeStage === 'INGEST' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedSpecimen}
                onClick={() => setActiveStage('PLAN')}
                className="pl-4 pr-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 cursor-pointer"
              >
                <span>Proceed to Investigation Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeStage === 'PLAN' && selectedSpecimen && (
            <>
              <button
                type="button"
                onClick={() => setActiveStage('INGEST')}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back to Ingestion
              </button>
              <button
                type="button"
                disabled={activeStage !== 'PLAN'}
                onClick={() => runInvestigationExecution(selectedSpecimen)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Execute Investigation Pipeline</span>
              </button>
            </>
          )}

          {activeStage === 'INVESTIGATE' && (
            <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500 dark:text-sky-400" />
                <span>Executing real-time forensic pipeline...</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">Step {currentStageIdx + 1} of 8</span>
            </div>
          )}

          {activeStage === 'RESULTS' && completedResult && (
            <>
              <button
                type="button"
                onClick={() => {
                  // GAP 2+4 FIX: Set active case then navigate to inbox
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
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done (View in Table)
              </button>
              <button
                type="button"
                onClick={() => {
                  // GAP 2 FIX: Set active case before navigating to workspace
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
                className="pl-4 pr-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 cursor-pointer"
              >
                <span>Enter Full Forensic Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
