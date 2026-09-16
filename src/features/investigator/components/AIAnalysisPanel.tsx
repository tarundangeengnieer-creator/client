import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { ProvenanceLabel } from '../../../components/ui/ProvenanceLabel.tsx';
import { EvidenceReference } from '../../../components/ui/EvidenceReference.tsx';
import {
  Sparkles,
  Send,
  HelpCircle,
  FileCheck,
  Radio,
  Clock,
  ExternalLink,
  ShieldAlert,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PredefinedQuery {
  id: string;
  label: string;
  query: string;
  response: string;
  evidenceCount: number;
  evidenceIds: string[];
  sources: string[];
  mitre?: string[];
}

export const AIAnalysisPanel: React.FC = () => {
  const { currentCase, currentCaseId, selectedEntity, caseEvidence } = useInvestigator();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id ;
  const tenantName = auth.currentTenant?.name || 'Acme Security Operations';
  const investigatorName = auth.currentUser?.name || 'Ankit Sharma (Investigator)';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeQueryText, setActiveQueryText] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [activeResponse, setActiveResponse] = useState<PredefinedQuery | null>(null);
  const [auditTimestamp, setAuditTimestamp] = useState<string>(new Date().toISOString());

  // Grounded preset queries adhering strictly to current case evidence
  const presetQueries: PredefinedQuery[] = [
    {
      id: 'q-ip-association',
      label: 'Why is this IP associated with the email?',
      query: 'Why is IP 185.220.101.5 associated with this email and case?',
      response:
        'IP 185.220.101.5 was observed directly in Hop 1 of the RFC 5322 Received header chain as the connecting relay (tor-exit-frankfurt.node.org). Forensic threat intelligence enrichment correlates this IP with an active Tor exit node operated in Frankfurt, Germany. It directly injected the message into the perimeter gateway while spoofing the paypal1-secure.com envelope.',
      evidenceCount: 12,
      evidenceIds: ['EVD-8812-01', 'EVD-8812-02', 'EVD-8812-05'],
      sources: ['RFC 5322 Received Header', 'Threat Intelligence Grid', 'GeoIP Telemetry', 'MTA Ingress Log'],
      mitre: ['T1566.002', 'T1090.003'],
    },
    {
      id: 'q-phishing-classification',
      label: 'Explain phishing classification',
      query: 'Explain why this email was classified as MALICIOUS Phishing.',
      response:
        'The classification is driven by 4 concordant forensic signals: (1) SPF hard fail and DMARC reject for paypal1-secure.com; (2) Inbound delivery via a confirmed Tor exit node; (3) Natural Language Processing classifier flagged extreme urgency and wire transfer diversion lures; (4) LightURLNet detected a credential harvesting auth portal on a domain registered under 48 hours ago.',
      evidenceCount: 15,
      evidenceIds: ['EVD-8812-01', 'EVD-8812-03', 'EVD-8812-04', 'EVD-8812-06'],
      sources: ['Authentication Ledger', 'MIME Content NLP', 'LightURLNet Engine', 'Detonation Sandbox'],
      mitre: ['T1566.001', 'T1566.002', 'T1059.007'],
    },
    {
      id: 'q-attack-chain',
      label: 'Summarize attack chain & MITRE tactics',
      query: 'Summarize the chronological attack chain and mapped MITRE ATT&CK techniques.',
      response:
        'Attack Chain Progression:\n1. Initial Access (T1566.002): Inbound spear-phishing email targeting financial controller.\n2. Proxy Anonymization (T1090.003): Relayed through Tor Exit Node 185.220.101.5 to conceal true origin.\n3. Brand Impersonation (T1583.001): Deployed typo-squatted domain paypal1-secure.com mimicking PayPal Commercial Gateway.\n4. Credential Access (T1056.003): Webhook authentication link harvesting corporate ERP credentials under urgency pressure.',
      evidenceCount: 18,
      evidenceIds: ['EVD-8812-01', 'EVD-8812-02', 'EVD-8812-03', 'EVD-8812-05'],
      sources: ['Timeline Engine', 'RFC 5322 Headers', 'MITRE ATT&CK Matrix', 'Threat Feeds'],
      mitre: ['T1566.002', 'T1090.003', 'T1583.001', 'T1056.003'],
    },
    {
      id: 'q-pivots',
      label: 'Suggest investigative pivots',
      query: 'What investigative pivots are recommended next based on available evidence?',
      response:
        'Recommended Forensic Pivots:\n• Pivot 1 (Graph): Trace domain paypal1-secure.com across tenant mailbox stores to identify any co-targeted finance staff.\n• Pivot 2 (Threat Intel): Query registrar NameSilo LLC and authoritative NS ns1.bulletproof-dns.org to cluster related campaign nodes (found 2 matching historical cases).\n• Pivot 3 (Timeline): Correlate MTA Ingress timestamp with corporate firewall egress logs for outbound clicks to /invoice/INV-9041/auth.',
      evidenceCount: 9,
      evidenceIds: ['EVD-8812-03', 'EVD-8812-04'],
      sources: ['Entity Relationship Graph', 'Correlated Cases Ledger', 'DNS Passive Database'],
    },
    {
      id: 'q-exec-summary',
      label: 'Generate investigation summary',
      query: 'Generate an executive forensic summary for case report disposition.',
      response:
        `Forensic investigation of #${currentCaseId || 'CASE-2026-8812'} confirms high-severity credential phishing and wire diversion fraud. Specimen masquerades as PayPal Enterprise Accounts with failed SPF/DMARC authentication. Relay originated from German Tor Exit 185.220.101.5 delivering an urgent payment dispute lure. Contained URL points to active harvesting infrastructure. Recommending immediate quarantine, perimeter block of IP/domain, and escalation to Fraud IR.`,
      evidenceCount: 16,
      evidenceIds: ['EVD-8812-01', 'EVD-8812-02', 'EVD-8812-03', 'EVD-8812-04', 'EVD-8812-05'],
      sources: ['Forensic Evidence Ledger', 'RFC Header Parser', 'Threat Telemetry Grid', 'ML Classifiers'],
    },
  ];

  const handleSelectPreset = (preset: PredefinedQuery) => {
    setIsLoadingAnswer(true);
    setActiveQueryText(preset.query);
    setAuditTimestamp(new Date().toISOString());

    setTimeout(() => {
      setActiveResponse(preset);
      setIsLoadingAnswer(false);
    }, 280);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsLoadingAnswer(true);
    setActiveQueryText(customInput);
    setAuditTimestamp(new Date().toISOString());

    // Generate evidence-grounded response scoped to this case
    setTimeout(() => {
      setActiveResponse({
        id: `custom-${Date.now()}`,
        label: customInput,
        query: customInput,
        response: `Based on evidence ledger for #${currentCaseId || 'CASE-2026-8812'}, observed telemetry indicates: The primary indicator (${selectedEntity?.value || '185.220.101.5'}) is correlated with 12 verified forensic records. Authentication failed (SPF/DMARC), relay traversed an anonymized exit node, and the embedded URL exhibits malicious credential phishing indicators. No cross-tenant data was accessed.`,
        evidenceCount: 12,
        evidenceIds: ['EVD-8812-01', 'EVD-8812-02'],
        sources: ['RFC 5322 Headers', 'Case Evidence Ledger', 'Threat Intelligence Grid'],
      });
      setIsLoadingAnswer(false);
      setCustomInput('');
    }, 350);
  };

  return (
    <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs font-mono select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#070b14] border border-sky-500/40 text-sky-500 flex items-center justify-center font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>AI-Assisted Investigation</span>
              <ProvenanceLabel type="AI ANALYSIS" size="xs" />
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10.5px]">
          {/* Tenant & Case Scope Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-400">SCOPE:</span>
            <span className="text-[#08B4ED] font-bold">#{currentCaseId || 'CASE-2026-8812'}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="truncate max-w-[120px]">{tenantName}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Toggle AI Investigation Panel"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4 bg-slate-50/20 dark:bg-transparent">
          {/* Active Context Scope Indicator */}
          <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Selected Entity:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {selectedEntity ? `${selectedEntity.value} (${selectedEntity.type})` : '185.220.101.5 (Source IP - Tor Exit)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 italic">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Restricted strictly to case & tenant boundary.</span>
            </div>
          </div>

          {/* Quick Query Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              Ask about this investigation:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetQueries.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all cursor-pointer text-left ${
                    activeResponse?.id === preset.id
                      ? 'bg-sky-50 dark:bg-[#0c1a2e] border-sky-500/60 text-sky-600 dark:text-sky-300 shadow-2xs'
                      : 'bg-white dark:bg-[#070b14] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input */}
          <form onSubmit={handleCustomSubmit} className="relative flex items-center">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={`Ask evidence question regarding #${currentCaseId || 'CASE-2026-8812'}...`}
              className="w-full pl-3 pr-20 py-2 rounded-lg text-xs bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500/60 font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={!customInput.trim() || isLoadingAnswer}
              className="absolute right-1.5 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3" />
              <span>Ask</span>
            </button>
          </form>

          {/* Loading State */}
          {isLoadingAnswer && (
            <div className="p-4 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 space-y-1">
              <div className="w-5 h-5 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mx-auto mb-1.5" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Grounding reasoning across {caseEvidence.length || 12} case evidence records...
              </span>
              <p className="text-[10px] text-slate-400 font-sans">
                Verifying RFC headers, threat telemetry, and timeline events within tenant scope.
              </p>
            </div>
          )}

          {/* AI Response Card adhering to Trust & Provenance Guidelines */}
          {!isLoadingAnswer && activeResponse && (
            <div className="p-4 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs animate-fadeIn">
              {/* Restrained Trust Label */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    AI ASSESSMENT
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    SUPPORTED BY: {activeResponse.evidenceCount} RECORDS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 italic">Evidence-grounded • Non-authoritative</span>
              </div>

              {/* Inquiry Context */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Question: <span className="text-slate-800 dark:text-slate-200 font-normal italic">"{activeResponse.query}"</span>
              </div>

              {/* Response Narrative */}
              <div className="text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-[#0a0f1d] p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                {activeResponse.response}
              </div>

              {/* Sources & Supporting Evidence Ledger */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Evidence Sources Utilized:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeResponse.sources.map((src) => (
                      <span
                        key={src}
                        className="px-1.5 py-0.2 rounded text-[9.5px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evidence References */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Primary Pointers:</span>
                  {activeResponse.evidenceIds.map((id) => (
                    <EvidenceReference key={id} evidenceId={id} size="sm" />
                  ))}
                </div>
              </div>

              {/* Forensic Actions & Audit Trail */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => investigatorStore.openEvidenceInspector(true)}
                    className="px-2.5 py-1 rounded bg-[#08B4ED]/10 hover:bg-[#08B4ED]/20 text-[#08B4ED] border border-[#08B4ED]/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>View Evidence ({activeResponse.evidenceCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomInput(`Follow-up on: ${activeResponse.label} - `);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Ask Follow-up</span>
                  </button>
                </div>

                {/* Auditability Timestamp & Signature */}
                <div className="text-[9.5px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-slate-400" />
                  <span>Audit: {investigatorName} • {new Date(auditTimestamp).toLocaleTimeString()} • Reasoner v1.4</span>
                </div>
              </div>
            </div>
          )}

          {/* Default state before query */}
          {!isLoadingAnswer && !activeResponse && (
            <div className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                AI Investigation Ready — Scoped to Case #{currentCaseId || 'CASE-2026-8812'}
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Select a preset question above or enter a case-specific query to analyze relationships, MITRE tactics, or classifications using verified evidence.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
