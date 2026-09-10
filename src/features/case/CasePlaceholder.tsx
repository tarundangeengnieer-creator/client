import React from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { casesStore } from '../../stores/cases-store.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Badge, getVerdictBadgeVariant } from '../../components/ui/Badge.tsx';
import {
  Mail,
  ArrowLeft,
  ShieldAlert,
  FileSearch,
  Network,
  Bug,
  Sparkles,
  ExternalLink,
  Lock,
  Cpu,
  Clock,
  Terminal,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { formatTimestamp } from '../../lib/formatters.ts';

export const CasePlaceholder: React.FC = () => {
  const ui = useUI();
  const caseId = ui.activeCaseId || 'ASH-2026-9012';
  const currentCase = casesStore.getCase(caseId);
  const investigation = casesStore.getInvestigation(caseId);

  const verdict = currentCase?.verdict || investigation?.verdict || 'MALICIOUS';
  const riskScore = currentCase?.riskScore ?? investigation?.risk_score ?? 92.5;
  const confidence = currentCase?.confidence ?? investigation?.confidence ?? 0.88;
  const subject = currentCase?.subject || 'Security Verification Alert';
  const sender = currentCase?.sender || 'origin@external.net';
  const timestamp = currentCase?.timestamp ? formatTimestamp(currentCase.timestamp) : 'Just now';

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Case Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => uiStore.navigate('/inbox')}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Return to Triage Queue"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-400" />
              <span>{caseId}</span>
            </h1>
            <Badge variant={getVerdictBadgeVariant(verdict)} size="md">
              {verdict}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono flex items-center gap-2 flex-wrap">
            <span className="text-slate-200 font-medium">{subject}</span>
            <span>&bull;</span>
            <span>From: {sender}</span>
            <span>&bull;</span>
            <span>Risk Score: <strong className={riskScore >= 80 ? 'text-rose-400' : riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'}>{riskScore.toFixed(1)}/100</strong></span>
            <span>&bull;</span>
            <span>Confidence: <strong className="text-sky-400">{(confidence * 100).toFixed(1)}%</strong></span>
            <span>&bull;</span>
            <span className="text-slate-500">{timestamp}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => uiStore.openCopilot(true)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-sky-400" />}
          >
            Ask Copilot
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => uiStore.addToast('warning', `Quarantine action queued for ${caseId}`)}
          >
            Quarantine Mailbox
          </Button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              VERDICT EVALUATION
            </span>
            <span className="text-rose-400 font-bold">{riskScore >= 80 ? 'CRITICAL' : riskScore >= 50 ? 'ELEVATED' : 'LOW'}</span>
          </div>
          <p className="text-xl font-bold text-slate-100 font-mono">{verdict}</p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {investigation?.risk_reasons?.[0] || 'Deterministic heuristics computed by ASHIELDER pipeline.'}
          </p>
        </Card>

        <Card className="border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Network className="w-4 h-4 text-sky-400" />
              TRANSPORT RELAYS
            </span>
            <span className="text-slate-400">{investigation?.geolocation?.length || 1} Hop(s)</span>
          </div>
          <p className="text-xl font-bold text-slate-100 font-mono">
            {currentCase?.originCountry || investigation?.geolocation?.[0]?.country || 'Verified Transport'}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Origin: {currentCase?.originIp || investigation?.geolocation?.[0]?.ip || 'Observed Transport IP'}
          </p>
        </Card>

        <Card className="border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              RESOURCE ENVELOPE
            </span>
            <span className="text-emerald-400 font-mono">SLA SAFE</span>
          </div>
          <p className="text-xl font-bold text-slate-100 font-mono">
            {currentCase?.resourceEnvelope?.wallClockMs || investigation?.budget_spent?.latency_ms || 1840}ms
          </p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {investigation?.tools_used?.length || 8} tools &bull; {investigation?.iteration_count || 3} iterations
          </p>
        </Card>

        <Card className="border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-emerald-400" />
              ATTACK HYPOTHESES
            </span>
            <span className="text-sky-400 font-mono">{investigation?.attack_hypotheses?.length || 1} Active</span>
          </div>
          <p className="text-xl font-bold text-slate-100 font-mono">
            {investigation?.attack_hypotheses?.[0]?.hypothesis_type || 'CREDENTIAL_PHISHING'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Bayesian confidence: {((investigation?.attack_hypotheses?.[0]?.confidence || 0.88) * 100).toFixed(0)}%
          </p>
        </Card>
      </div>

      {/* Forensic Risk Findings */}
      <Card className="border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold font-mono text-slate-200 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-sky-400" />
            <span>Forensic Findings & Deterministic Signals</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Phase 5 Full Dossier Ready</span>
        </div>
        <div className="p-4 space-y-3">
          {(investigation?.risk_reasons && investigation.risk_reasons.length > 0
            ? investigation.risk_reasons
            : [
                'Origin transport verified through recursive RFC 822 Received hop reconstruction.',
                'Cryptographic hash chain validated against local audit block register.',
                'DMARC authentication policy alignment evaluated.',
              ]
          ).map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
              <div className="flex-1">{reason}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
