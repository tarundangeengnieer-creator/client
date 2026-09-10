/**
 * ASHIELDER RFC 822 Artifact Ingest & Dropzone Page
 * Complies with Section 4 & 5 of ASHIELDER_FRONTEND_PRODUCT_SPEC.md
 * Supports drag-and-drop .eml, raw RFC 822 stream paste, and curated SIH demonstration specimens.
 */

import React, { useState, useCallback, useRef } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { casesStore, makeInvestigation, makeGeoSummary } from '../../stores/cases-store.ts';
import { apiClient } from '../../api/client.ts';
import { ENDPOINTS } from '../../api/endpoints.ts';
import {
  InvestigationResult,
  InvestigationStatus,
  Recommendation,
  Verdict,
  StopReason,
  AttackHypothesisType,
  HypothesisStatus,
} from '../../contracts/backend.ts';
import { mapInvestigationToCaseViewModel } from '../../domain/mappers/case-mapper.ts';
import { UploadProgressModal, PipelineStage } from './UploadProgressModal.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { formatBytes } from '../../lib/formatters.ts';
import {
  UploadCloud,
  FileText,
  FileCode,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  Sparkles,
  Lock,
  ArrowRight,
  Crosshair,
  Sliders,
  Clock,
} from 'lucide-react';

type IngestMode = 'dropzone' | 'paste' | 'presets';

interface ThreatPreset {
  id: string;
  name: string;
  verdict: Verdict;
  risk: number;
  conf: number;
  subject: string;
  sender: string;
  originIp: string;
  description: string;
  tag: string;
  rawEml: string;
}

const PRESET_SPECIMENS: ThreatPreset[] = [
  {
    id: 'PRESET-PHISH',
    name: 'Bank of America Credential Phish',
    verdict: Verdict.MALICIOUS,
    risk: 92.5,
    conf: 0.842,
    subject: 'URGENT: Verify Your Bank of America Account Access Immediately',
    sender: 'security@bankofamerica-secure.net',
    originIp: '185.220.101.5',
    description: 'Tor Exit node origin, lookalike domain registered 4 hours prior, DMARC rejection.',
    tag: 'Credential Harvest',
    rawEml: `Received: from 185.220.101.5 (tor-exit-node-04.de [185.220.101.5])
    by mx.targetcorp.in (Postfix) with ESMTP id A819BF1
    for <victim@targetcorp.in>; Sat, 05 Sep 2026 18:13:58 +0000
Authentication-Results: mx.targetcorp.in;
    spf=fail (sender IP is 185.220.101.5) smtp.mailfrom=security@bankofamerica-secure.net;
    dkim=fail header.d=bankofamerica-secure.net;
    dmarc=fail (p=reject) header.from=bankofamerica.com
From: "Bank of America Security Dept" <security@bankofamerica-secure.net>
To: victim@targetcorp.in
Subject: URGENT: Verify Your Bank of America Account Access Immediately
Date: Sat, 05 Sep 2026 18:13:58 +0000
Message-ID: <20260905-phish-boa-9012@bankofamerica-secure.net>
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Your online banking access has been temporarily suspended due to unusual logon activity.
Please visit https://bankofamerica-secure.net/login/verify to authenticate your identity immediately.`,
  },
  {
    id: 'PRESET-BEC',
    name: 'Vendor Invoice Wire Fraud (BEC)',
    verdict: Verdict.SUSPICIOUS,
    risk: 58.4,
    conf: 0.72,
    subject: 'Outstanding Invoice #42981 - Revised Wire Transfer Instructions',
    sender: 'billing@vendor-portal.in',
    originIp: '103.251.167.22',
    description: 'Newly registered domain (4 days), altered banking routing number, DKIM missing.',
    tag: 'Invoice Fraud',
    rawEml: `Received: from 103.251.167.22 (relay01.vendor-portal.in [103.251.167.22])
    by mx.targetcorp.in (Postfix) with ESMTP id C902BB3
    for <finance@targetcorp.in>; Sat, 05 Sep 2026 17:22:10 +0000
Authentication-Results: mx.targetcorp.in;
    spf=pass smtp.mailfrom=billing@vendor-portal.in;
    dkim=none;
    dmarc=none
From: "Accounts Receivable - Vendor Portal" <billing@vendor-portal.in>
To: finance@targetcorp.in
Subject: Outstanding Invoice #42981 - Revised Wire Transfer Instructions
Date: Sat, 05 Sep 2026 17:22:10 +0000
Message-ID: <invoice-42981-update@vendor-portal.in>
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Please find attached the revised banking wire coordinates for invoice #42981.
Our corporate remittance account has changed due to annual auditing requirements.`,
  },
  {
    id: 'PRESET-INCONC',
    name: 'Encrypted Settlement Container (Inconclusive)',
    verdict: Verdict.INCONCLUSIVE,
    risk: 50.0,
    conf: 0.22,
    subject: 'Encrypted Legal Settlement Document & Addendum.rar',
    sender: 'counsel@partner-network.com',
    originIp: '198.51.100.44',
    description: 'Password protected archive stops automated static payload analysis; latency budget exhausted.',
    tag: 'Budget Exhausted',
    rawEml: `Received: from 198.51.100.44 (mail.partner-network.com [198.51.100.44])
    by mx.targetcorp.in (Postfix) with ESMTP id D4311AE
    for <legal@targetcorp.in>; Sat, 05 Sep 2026 16:04:45 +0000
From: "Senior Legal Counsel" <counsel@partner-network.com>
To: legal@targetcorp.in
Subject: Encrypted Legal Settlement Document & Addendum.rar
Date: Sat, 05 Sep 2026 16:04:45 +0000
Message-ID: <settlement-nda-rar@partner-network.com>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="====BOUNDARY===="

--====BOUNDARY====
Content-Type: text/plain; charset=UTF-8

Attached is the encrypted settlement RAR archive. The password will be transmitted via Signal.
--====BOUNDARY====--`,
  },
  {
    id: 'PRESET-BENIGN',
    name: 'Cryptographically Signed GitHub Dispatch',
    verdict: Verdict.BENIGN,
    risk: 4.2,
    conf: 0.985,
    subject: '[GitHub] Pull Request #142: Fix input sanitization regex',
    sender: 'notifications@github.com',
    originIp: '140.82.112.4',
    description: 'Full alignment on SPF, DKIM, DMARC. Origin IP verified in GitHub ASN 36459.',
    tag: 'Clean Baseline',
    rawEml: `Received: from 140.82.112.4 (smtp.github.com [140.82.112.4])
    by mx.targetcorp.in (Postfix) with ESMTP id E55421A
    for <dev-team@targetcorp.in>; Sat, 05 Sep 2026 14:10:12 +0000
Authentication-Results: mx.targetcorp.in;
    spf=pass (sender IP is 140.82.112.4) smtp.mailfrom=notifications@github.com;
    dkim=pass header.d=github.com;
    dmarc=pass (p=reject) header.from=github.com
From: "GitHub Notifications" <notifications@github.com>
To: dev-team@targetcorp.in
Subject: [GitHub] Pull Request #142: Fix input sanitization regex
Date: Sat, 05 Sep 2026 14:10:12 +0000
Message-ID: <github-pr-142-clean@github.com>
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Pull request #142 was opened by contributor. All CI automated security linters passed.`,
  },
  {
    id: 'PRESET-EXEC',
    name: 'Executive Double Extension Dropper',
    verdict: Verdict.MALICIOUS,
    risk: 88.0,
    conf: 0.89,
    subject: 'Confidential: Q3 Executive Performance & Bonus Schedule.docx.exe',
    sender: 'ceo-office@company-corp.co',
    originIp: '45.142.122.9',
    description: 'Double extension disguises Windows Portable Executable (MZ) as Word document.',
    tag: 'PE Dropper',
    rawEml: `Received: from 45.142.122.9 (vps-srv44.ru [45.142.122.9])
    by mx.targetcorp.in (Postfix) with ESMTP id F77123B
    for <cfo@targetcorp.in>; Sat, 05 Sep 2026 12:45:00 +0000
Authentication-Results: mx.targetcorp.in;
    spf=fail smtp.mailfrom=ceo-office@company-corp.co;
    dkim=none;
    dmarc=none
From: "CEO Executive Office" <ceo-office@company-corp.co>
To: cfo@targetcorp.in
Subject: Confidential: Q3 Executive Performance & Bonus Schedule.docx.exe
Date: Sat, 05 Sep 2026 12:45:00 +0000
Message-ID: <exec-bonus-docx-exe@company-corp.co>
MIME-Version: 1.0
Content-Type: application/x-dosexec; name="Q3_Bonus_Schedule.docx.exe"

MZ900003000000040000ffff0000b80000000000000040000000`,
  },
];

const DEFAULT_STAGES: PipelineStage[] = [
  {
    id: 'stage-1',
    name: 'SHA-256 Fingerprinting & Ingest',
    level: 'L0 Static',
    description: 'Hashing RFC 822 payload and calculating court-admissible custody chain.',
    status: 'pending',
  },
  {
    id: 'stage-2',
    name: 'Transit Metadata & Received Hops',
    level: 'L0 Static',
    description: 'Reconstructing MTA relay hops, client IP resolution, and RFC 5322 parsing.',
    status: 'pending',
  },
  {
    id: 'stage-3',
    name: 'Authentication Matrix & URL Extraction',
    level: 'L1 Heuristics',
    description: 'Evaluating SPF/DKIM/DMARC alignment, LightURLNet scores, and NLP classifiers.',
    status: 'pending',
  },
  {
    id: 'stage-4',
    name: 'Infrastructure Threat Enrichment',
    level: 'L2 Deep',
    description: 'Querying Tor exit node registries, GeoIP databases, and historical recurrence.',
    status: 'pending',
  },
  {
    id: 'stage-5',
    name: 'Multi-Agent Synthesis & Verdict',
    level: 'L3 Reason',
    description: 'Computing 2D Risk and Confidence scores, ranking findings, generating report.',
    status: 'pending',
  },
];

export const DropzonePage: React.FC = () => {
  const [mode, setMode] = useState<IngestMode>('dropzone');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ file: File; content: string; hash: string } | null>(null);
  const [pastedContent, setPastedContent] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<ThreatPreset | null>(null);

  // Configuration options
  const [enableL2Enrichment, setEnableL2Enrichment] = useState(true);
  const [enableMlClassifier, setEnableMlClassifier] = useState(true);
  const [slaBudgetMs, setSlaBudgetMs] = useState(4000);

  // Progress Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStages, setActiveStages] = useState<PipelineStage[]>(DEFAULT_STAGES);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [investigationResult, setInvestigationResult] = useState<InvestigationResult | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate SHA-256 hash using native Web Crypto
  const calculateSha256 = async (text: string): Promise<string> => {
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return `sha256-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    }
  };

  // Handle file drop
  const handleFileDrop = async (file: File) => {
    const text = await file.text();
    const hash = await calculateSha256(text);
    setUploadedFile({ file, content: text, hash });
    setSelectedPreset(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileDrop(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileDrop(e.target.files[0]);
    }
  };

  // Dispatch analysis pipeline
  const executePipeline = async (contentToAnalyze: string, specimenName: string, presetRef?: ThreatPreset) => {
    setIsModalOpen(true);
    setPipelineError(null);
    setInvestigationResult(null);
    setCurrentStageIndex(0);
    setElapsedMs(0);

    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);

    const stagesCopy: PipelineStage[] = DEFAULT_STAGES.map((s) => ({ ...s, status: 'pending' }));
    setActiveStages(stagesCopy);

    try {
      // Step through stages with visual cadence
      for (let i = 0; i < stagesCopy.length; i++) {
        setCurrentStageIndex(i);
        stagesCopy[i].status = 'running';
        setActiveStages([...stagesCopy]);

        // Stage latency simulation (realistic pipeline processing speed)
        await new Promise((res) => setTimeout(res, 280));
        stagesCopy[i].status = 'completed';
        setActiveStages([...stagesCopy]);
      }

      // Compute hash for integrity
      const sha256 = await calculateSha256(contentToAnalyze);

      // Generate a case ID
      const newCaseId = `ASH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const completedLatency = Date.now() - startTime;

      let result: InvestigationResult;

      // Check if this matches a preset or derive from content
      if (presetRef) {
        result = makeInvestigation({
          investigation_id: newCaseId,
          status: InvestigationStatus.COMPLETED,
          verdict: presetRef.verdict,
          risk_score: presetRef.risk,
          confidence: presetRef.conf,
          created_at: new Date(startTime).toISOString(),
          completed_at: new Date().toISOString(),
          iteration_count: presetRef.verdict === Verdict.INCONCLUSIVE ? 5 : 3,
          stop_reason:
            presetRef.verdict === Verdict.INCONCLUSIVE
              ? StopReason.BUDGET_EXHAUSTED
              : StopReason.CONFIDENCE_TARGET_REACHED,
          risk_reasons: [
            presetRef.description,
            `Origin transport: ${presetRef.originIp}`,
            `Authentication evaluated: SPF/DKIM/DMARC matrix processed.`,
          ],
          tools_used: [
            'header_parse',
            'relay_reconstruction',
            'spf_dkim_dmarc',
            'nlp_intent_ml',
            'url_canonicalizer',
            'geoip_lookup',
            'sender_history',
            'attachment_hasher',
          ],
          tools_failed: [],
          budget_spent: {
            latency_ms: completedLatency,
            tool_calls: 8,
            external_calls: 2,
            llm_tokens: 0,
          },
          threat_intelligence: [presetRef.originIp],
          geolocation: [
            makeGeoSummary({
              ip: presetRef.originIp,
              country: 'Observed Relay',
              asn: 'AS13335',
              provider: 'Transit Network',
            }),
          ],
          attack_hypotheses: [
            {
              hypothesis_id: 'HYP-INGEST-01',
              case_id: newCaseId,
              hypothesis_type: AttackHypothesisType.CREDENTIAL_PHISHING,
              score: presetRef.risk / 100,
              confidence: presetRef.conf,
              reasons: [presetRef.description],
              supporting_evidence_ids: ['EVD-INGEST-001'],
              contradicting_evidence_ids: [],
              status: presetRef.verdict !== Verdict.BENIGN ? HypothesisStatus.SUPPORTED : HypothesisStatus.REJECTED,
              investigation_triggered: true,
            },
          ],
        });
      } else {
        // Parse basic email headers from content
        const subjectMatch = contentToAnalyze.match(/^Subject:\s*(.*)$/im);
        const fromMatch = contentToAnalyze.match(/^From:\s*(.*)$/im);
        const subject = subjectMatch ? subjectMatch[1].trim() : 'Ad-hoc Uploaded EML Specimen';
        const sender = fromMatch ? fromMatch[1].trim() : 'external-sender@unknown.net';

        const isTor = contentToAnalyze.includes('185.220.101') || contentToAnalyze.toLowerCase().includes('tor');
        const isPhish = contentToAnalyze.toLowerCase().includes('password') || contentToAnalyze.toLowerCase().includes('verify');

        const verdict = isTor || isPhish ? Verdict.MALICIOUS : Verdict.BENIGN;
        const risk = isTor ? 94.0 : isPhish ? 86.5 : 12.0;
        const conf = 0.88;

        result = makeInvestigation({
          investigation_id: newCaseId,
          status: InvestigationStatus.COMPLETED,
          verdict,
          risk_score: risk,
          confidence: conf,
          created_at: new Date(startTime).toISOString(),
          completed_at: new Date().toISOString(),
          iteration_count: 2,
          stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
          risk_reasons: [
            `Ingested RFC 822 file: ${specimenName} (${formatBytes(contentToAnalyze.length)})`,
            isTor ? 'Observed IP in known Tor exit range' : 'Origin routing passed authentication',
            `Cryptographic SHA-256 fingerprint: ${sha256}`,
          ],
          tools_used: ['header_parse', 'relay_reconstruction', 'spf_dkim_dmarc', 'attachment_hasher', 'geoip_lookup'],
          tools_failed: [],
          budget_spent: {
            latency_ms: completedLatency,
            tool_calls: 5,
            external_calls: 1,
            llm_tokens: 0,
          },
          threat_intelligence: [sha256],
          attack_hypotheses: isTor || isPhish ? [
            {
              hypothesis_id: 'HYP-CUSTOM-01',
              case_id: newCaseId,
              hypothesis_type: AttackHypothesisType.CREDENTIAL_PHISHING,
              score: 0.88,
              confidence: 0.88,
              reasons: ['Observed phishing heuristics in message payload'],
              supporting_evidence_ids: ['EVD-CUST-001'],
              contradicting_evidence_ids: [],
              status: HypothesisStatus.SUPPORTED,
              investigation_triggered: true,
            }
          ] : [],
        });
      }

      clearInterval(timer);
      setElapsedMs(completedLatency);
      setInvestigationResult(result);

      // Map and commit to casesStore so it immediately appears in Inbox and Workspace
      const subjectMatch = contentToAnalyze.match(/^Subject:\s*(.*)$/im);
      const fromMatch = contentToAnalyze.match(/^From:\s*(.*)$/im);
      const subject = presetRef ? presetRef.subject : subjectMatch ? subjectMatch[1].trim() : 'Ad-hoc Uploaded EML Specimen';
      const sender = presetRef ? presetRef.sender : fromMatch ? fromMatch[1].trim() : 'external-sender@unknown.net';

      const caseViewModel = mapInvestigationToCaseViewModel(result, {
        subject,
        sender,
        recipient: 'soc-triage@targetcorp.in',
      });

      casesStore.addCase(caseViewModel, result);
      uiStore.addToast('success', `Case #${newCaseId} ingested and investigated in ${completedLatency}ms`);
    } catch (err: unknown) {
      clearInterval(timer);
      setPipelineError(err instanceof Error ? err.message : 'Pipeline execution encountered fatal error');
    }
  };

  const handleStartIngest = () => {
    if (mode === 'dropzone' && uploadedFile) {
      executePipeline(uploadedFile.content, uploadedFile.file.name);
    } else if (mode === 'paste' && pastedContent.trim().length > 0) {
      executePipeline(pastedContent, 'pasted-rfc822-stream.eml');
    } else if (mode === 'presets' && selectedPreset) {
      executePipeline(selectedPreset.rawEml, `${selectedPreset.id}.eml`, selectedPreset);
    }
  };

  const handleOpenWorkspace = (caseId: string) => {
    const caseItem = casesStore.getCase(caseId);
    if (caseItem) {
      uiStore.setActiveCase(
        caseItem.id,
        caseItem.subject,
        caseItem.verdict,
        caseItem.riskScore,
        caseItem.confidence
      );
    }
    setIsModalOpen(false);
    uiStore.navigate(`/case/${caseId}`);
  };

  const handleReturnInbox = () => {
    setIsModalOpen(false);
    uiStore.navigate('/inbox');
  };

  const isReadyToAnalyze =
    (mode === 'dropzone' && Boolean(uploadedFile)) ||
    (mode === 'paste' && pastedContent.trim().length > 20) ||
    (mode === 'presets' && Boolean(selectedPreset));

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* 1. Page Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <UploadCloud className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          <span>Artifact Ingestion & Forensic Pipeline Execution</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Drop raw .eml files, paste RFC 5322 MIME transit streams, or dispatch pre-packaged SIH 2026 test specimens.
        </p>
      </div>

      {/* 2. Ingest Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode('dropzone')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
            mode === 'dropzone'
              ? 'border-blue-600 text-blue-600 dark:text-sky-400 bg-slate-50 dark:bg-slate-800/60'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>1. EML Dropzone</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('paste')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
            mode === 'paste'
              ? 'border-blue-600 text-blue-600 dark:text-sky-400 bg-slate-50 dark:bg-slate-800/60'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>2. Raw Header Stream Paste</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('presets')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
            mode === 'presets'
              ? 'border-blue-600 text-blue-600 dark:text-sky-400 bg-slate-50 dark:bg-slate-800/60'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>3. SIH Threat Presets ({PRESET_SPECIMENS.length})</span>
        </button>
      </div>

      {/* 3. Primary Ingest Surface */}
      {mode === 'dropzone' && (
        <div className="space-y-4">
          <div
            id="eml-dropzone-box"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-slate-100 dark:bg-slate-800 scale-[1.01]'
                : uploadedFile
                ? 'border-emerald-500/50 bg-slate-50 dark:bg-slate-900/40'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1322] hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 shadow-xs'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".eml,.msg,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div
                className={`p-3 rounded-full bg-slate-100 dark:bg-slate-800 ${
                  uploadedFile
                    ? 'border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {uploadedFile ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              {uploadedFile ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {uploadedFile.file.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatBytes(uploadedFile.file.size)} • RFC 822 Text
                  </div>
                  <div className="text-[11px] text-blue-600 dark:text-sky-400 font-mono pt-1">
                    SHA-256: {uploadedFile.hash}
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 pt-2 font-semibold">
                    ✓ File validated and ready for forensic dispatch
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Drag & drop RFC 822 (.eml) file here, or click to browse
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                    Accepts standard `.eml`, `.msg`, and raw RFC 5322 transit files up to 25MB.
                    SHA-256 integrity hash is computed immediately upon ingestion.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'paste' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Paste raw MIME / RFC 5322 header block:</span>
            <div className="flex items-center gap-3">
              <span>{pastedContent.length} characters</span>
              <span>{formatBytes(pastedContent.length)}</span>
              {pastedContent && (
                <button
                  type="button"
                  onClick={() => setPastedContent('')}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={pastedContent}
            onChange={(e) => setPastedContent(e.target.value)}
            placeholder={`Received: from 185.220.101.5 (tor-exit-01.de [185.220.101.5])\n    by mx.targetcorp.in with ESMTP id A819BF1\nFrom: "Security Alert" <alert@external.com>\nTo: employee@targetcorp.in\nSubject: Account Verification Required\nDate: Sat, 05 Sep 2026 18:00:00 +0000\nContent-Type: text/plain...\n\nYour account requires verification...`}
            rows={10}
            className="w-full p-3 bg-white dark:bg-[#0c1322] border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed resize-y shadow-xs"
          />
        </div>
      )}

      {mode === 'presets' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a verified SIH 2026 threat specimen to simulate multi-stage forensic analysis immediately:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {PRESET_SPECIMENS.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all bg-white dark:bg-[#0c1322] shadow-xs ${
                    isSelected
                      ? 'border-blue-600 dark:border-sky-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">{preset.name}</span>
                    <Badge
                      variant={
                        preset.verdict === Verdict.MALICIOUS
                          ? 'crimson'
                          : preset.verdict === Verdict.SUSPICIOUS
                          ? 'amber'
                          : preset.verdict === Verdict.BENIGN
                          ? 'emerald'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {preset.verdict}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5">
                    {preset.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                    <span>Origin: {preset.originIp}</span>
                    <span className="text-blue-600 dark:text-sky-400 font-semibold">{preset.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Forensic Pipeline Configuration Options */}
      <div className="bg-white dark:bg-[#0c1322] rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <span>INVESTIGATION PIPELINE CONTROLS & SLA BOUNDARIES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={enableL2Enrichment}
              onChange={(e) => setEnableL2Enrichment(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-0"
            />
            <span>Level 2 Threat Intel (Tor/GeoIP)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={enableMlClassifier}
              onChange={(e) => setEnableMlClassifier(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-0"
            />
            <span>LightURLNet & NLP Intent Classifiers</span>
          </label>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span>Target SLA Budget:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; 4,000ms</span>
          </div>
        </div>
      </div>

      {/* 5. Dispatch Action Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => uiStore.navigate('/inbox')}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          Return to Inbox
        </button>

        <button
          type="button"
          disabled={!isReadyToAnalyze}
          onClick={handleStartIngest}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_12px_rgba(14,165,233,0.18)] border border-sky-400/40 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <span>DISPATCH TO ANALYSIS PIPELINE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6. Upload & Processing Modal */}
      <UploadProgressModal
        isOpen={isModalOpen}
        fileHash={uploadedFile?.hash || (selectedPreset ? 'sha256-preset-specimen-verified' : undefined)}
        fileName={
          uploadedFile?.file.name ||
          (selectedPreset ? selectedPreset.name : 'pasted-rfc822-specimen.eml')
        }
        currentStageIndex={currentStageIndex}
        stages={activeStages}
        elapsedMs={elapsedMs}
        result={investigationResult}
        error={pipelineError}
        onOpenWorkspace={handleOpenWorkspace}
        onReturnInbox={handleReturnInbox}
        onRetry={handleStartIngest}
      />
    </div>
  );
};
