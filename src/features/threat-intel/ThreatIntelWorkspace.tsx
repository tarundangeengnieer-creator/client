import React, { useState, useMemo, useEffect } from 'react';
import { useInvestigator, investigatorStore } from '../../stores/investigator-store.ts';
import { useAuth } from '../../stores/auth-store.ts';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { ThreatIntelDetail, ThreatIntelProvenanceSource } from '../../domain/investigator.ts';
import { ProvenanceLabel } from '../../components/ui/ProvenanceLabel.tsx';
import { ConfidenceIndicator } from '../../components/ui/ConfidenceIndicator.tsx';
import { EvidenceReference } from '../../components/ui/EvidenceReference.tsx';
import { SeverityBadge } from '../../components/ui/SeverityBadge.tsx';
import { MitreBadge } from '../../components/ui/MitreBadge.tsx';
import { PivotMenu } from '../../components/ui/PivotMenu.tsx';
import { GeospatialMap, MapNode } from '../../components/ui/GeospatialMap.tsx';
import {
  Globe,
  Search,
  Crosshair,
  ShieldAlert,
  Radio,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Server,
  Layers,
  Network,
  Archive,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Filter,
  RefreshCw,
  Plus,
  Cpu,
  Fingerprint,
  FileCheck,
} from 'lucide-react';

/**
 * MOCK THREAT INTELLIGENCE DATABASE
 * Realistic multi-indicator corpus with comprehensive provenance records.
 */
const INTEL_RECORDS: Record<string, ThreatIntelDetail> = {
  '185.220.101.5': {
    indicator: '185.220.101.5',
    type: 'ip',
    reputation: 'MALICIOUS',
    risk_level: 'CRITICAL',
    confidence: 96,
    first_seen: '2026-07-02T14:22:00Z',
    last_seen: '2026-09-08T08:14:18Z',
    country: 'Germany',
    country_code: 'DE',
    city: 'Frankfurt am Main',
    asn: 'AS205100 (Tor Exit Network Operator)',
    isp: 'Zwiebelfreunde e.V. Anonymity Node',
    infrastructure_type: 'Tor Exit Node',
    associated_activity: 'Credential Phishing / Wire Fraud Lure',
    known_campaigns: ['CMP-PHISH-FIN-2026', 'OP-INVOICE-HARVEST'],
    related_domains: [
      'paypal1-secure.com',
      'auth-portal-update.net',
      'invoice-verify-pay.org',
      'secure-mfa-confirm.com',
    ],
    related_urls: [
      'https://paypal1-secure.com/invoice/INV-9041/auth',
      'https://paypal1-secure.com/webhooks/token-dump',
      'https://auth-portal-update.net/login/session',
    ],
    provenance_sources: [
      {
        source_name: 'Global Threat Telemetry Grid (AbuseIPDB, OTX, VirusTotal)',
        category: 'Commercial Feed',
        observation_time: '2026-09-08T08:14:00Z',
        last_updated: '2026-09-08T08:14:00Z',
        confidence: 96,
        reputation: 'MALICIOUS',
        source_record_ref: 'GRID-IOC-DE-185220-4109',
      },
      {
        source_name: 'MaxMind GeoLite2 City Database',
        category: 'GeoIP Database',
        observation_time: '2026-09-01T00:00:00Z',
        last_updated: '2026-09-08T06:00:00Z',
        confidence: 99,
        reputation: 'NEUTRAL',
        source_record_ref: 'GEOIP2-LOC-2925533',
      },
      {
        source_name: 'Authoritative & Passive DNS Ledger',
        category: 'Passive DNS',
        observation_time: '2026-09-06T12:00:00Z',
        last_updated: '2026-09-08T08:00:00Z',
        confidence: 94,
        reputation: 'SUSPICIOUS',
        source_record_ref: 'PDNS-A-RECORD-8812',
      },
      {
        source_name: 'AShieldER Detonation Sandbox',
        category: 'Detonation Sandbox',
        observation_time: '2026-09-08T08:15:00Z',
        last_updated: '2026-09-08T08:15:20Z',
        confidence: 98,
        reputation: 'MALICIOUS',
        source_record_ref: 'DETONATE-EML-8812-RES',
      },
      {
        source_name: 'Internal AShieldER Correlation Engine',
        category: 'Internal Correlation',
        observation_time: '2026-09-08T08:16:00Z',
        last_updated: '2026-09-08T08:16:10Z',
        confidence: 92,
        reputation: 'MALICIOUS',
        source_record_ref: 'CORR-CASE-8812-MATCH',
      },
    ],
    observed_in_email: {
      case_id: 'CASE-2026-8812',
      field: 'Received Header (Hop 1 of 3)',
      hop_number: 1,
      header_snippet:
        'Received: from tor-exit-frankfurt.node.org (185.220.101.5)\n  by mta-inbound-02.acme-corp.com (Postfix) with ESMTPS\n  id 4StLzq19vNz for <finance.controller@acme-corp.com>;\n  Tue, 8 Sep 2026 08:14:18 +0000 (UTC)',
    },
    analyst_notes: [
      'Confirmed Tor exit relay operated by Zwiebelfreunde e.V. Anonymity Node in Frankfurt.',
      'Correlated with wire diversion lure targeting Accounts Payable controller.',
      'Observed SPF hard failure: Domain paypal1-secure.com did not authorize 185.220.101.5.',
    ],
    ai_summary: {
      summary_text:
        'This IP appears relevant to the current investigation because it was observed as the direct connecting relay in the inbound message headers and possesses confirmed malicious reputation across external feeds as an active Tor Exit Node deploying brand-spoofed financial phishing.',
      evidence_count: 12,
      evidence_sources: [
        'RFC 5322 Received Header',
        'Global Threat Telemetry Grid',
        'Authentication Ledger (SPF Fail)',
        'LightURLNet Lexical Engine',
      ],
      generated_at: '2026-09-08T08:20:00Z',
    },
  },

  'paypal1-secure.com': {
    indicator: 'paypal1-secure.com',
    type: 'domain',
    reputation: 'MALICIOUS',
    risk_level: 'CRITICAL',
    confidence: 98,
    first_seen: '2026-09-06T12:00:00Z',
    last_seen: '2026-09-08T08:14:22Z',
    country: 'United States',
    country_code: 'US',
    asn: 'AS49981 (WorldStream B.V. Bulletproof)',
    isp: 'Offshore Privacy Registrar',
    infrastructure_type: 'Typosquatting Harvester Host',
    associated_activity: 'Brand Impersonation & Credential Interception',
    known_campaigns: ['CMP-PHISH-FIN-2026'],
    related_domains: ['auth-portal-update.net', 'invoice-verify-pay.org'],
    related_urls: [
      'https://paypal1-secure.com/invoice/INV-9041/auth',
      'https://paypal1-secure.com/webhooks/token-dump',
    ],
    provenance_sources: [
      {
        source_name: 'WHOIS & RDAP Domain Registry',
        category: 'Commercial Feed',
        observation_time: '2026-09-06T12:00:00Z',
        last_updated: '2026-09-08T06:00:00Z',
        confidence: 99,
        reputation: 'SUSPICIOUS',
        source_record_ref: 'WHOIS-REG-NAME-SILO-490',
      },
      {
        source_name: 'LightURLNet Engine',
        category: 'Commercial Feed',
        observation_time: '2026-09-08T08:14:24Z',
        last_updated: '2026-09-08T08:14:24Z',
        confidence: 98,
        reputation: 'MALICIOUS',
        source_record_ref: 'URLNET-TOK-9812-RES',
      },
      {
        source_name: 'DNS Passive Correlation',
        category: 'Passive DNS',
        observation_time: '2026-09-06T14:00:00Z',
        last_updated: '2026-09-08T08:00:00Z',
        confidence: 95,
        reputation: 'MALICIOUS',
        source_record_ref: 'PDNS-NS1-BULLETPROOF',
      },
    ],
    observed_in_email: {
      case_id: 'CASE-2026-8812',
      field: 'Envelope From / Return-Path',
      header_snippet:
        'From: "PayPal Enterprise Accounts" <accounts-billing@paypal1-secure.com>\nReturn-Path: <bounce@paypal1-secure.com>',
    },
    analyst_notes: [
      'Registered 48h prior to payment invoice dispatch via privacy proxy.',
      'Nameservers delegated to known bulletproof host ns1.bulletproof-dns.org.',
    ],
    ai_summary: {
      summary_text:
        'Domain paypal1-secure.com is an active typosquatted impersonation asset created specifically to siphon wire transfers by deceiving enterprise accounts payable workflows.',
      evidence_count: 8,
      evidence_sources: ['WHOIS Registry', 'LightURLNet Engine', 'MIME Headers'],
      generated_at: '2026-09-08T08:21:00Z',
    },
  },

  'https://paypal1-secure.com/invoice/INV-9041/auth': {
    indicator: 'https://paypal1-secure.com/invoice/INV-9041/auth',
    type: 'url',
    reputation: 'MALICIOUS',
    risk_level: 'CRITICAL',
    confidence: 98,
    first_seen: '2026-09-08T08:14:10Z',
    last_seen: '2026-09-08T08:14:22Z',
    infrastructure_type: 'Live Credential Harvester',
    associated_activity: 'Session Token Exfiltration',
    known_campaigns: ['CMP-PHISH-FIN-2026'],
    related_domains: ['paypal1-secure.com'],
    related_urls: ['https://paypal1-secure.com/webhooks/token-dump'],
    provenance_sources: [
      {
        source_name: 'AShieldER Detonation Sandbox',
        category: 'Detonation Sandbox',
        observation_time: '2026-09-08T08:15:10Z',
        last_updated: '2026-09-08T08:15:30Z',
        confidence: 98,
        reputation: 'MALICIOUS',
        source_record_ref: 'SANDBOX-DOM-DUMP-9041',
      },
      {
        source_name: 'Google Safe Browsing & URLhaus',
        category: 'Commercial Feed',
        observation_time: '2026-09-08T08:30:00Z',
        last_updated: '2026-09-08T08:30:00Z',
        confidence: 95,
        reputation: 'MALICIOUS',
        source_record_ref: 'URLHAUS-REC-89104',
      },
    ],
    observed_in_email: {
      case_id: 'CASE-2026-8812',
      field: 'MIME HTML Body Anchor Hyperlink',
      header_snippet:
        '<a href="https://paypal1-secure.com/invoice/INV-9041/auth">Please log in immediately to complete verification</a>',
    },
    analyst_notes: [
      'Interactive form targets PayPal business credentials + SMS MFA OTP token.',
    ],
    ai_summary: {
      summary_text:
        'Detonated URL executes an adversary-in-the-middle session interceptor designed to bypass MFA security policies by proxying authentic login challenges in real time.',
      evidence_count: 6,
      evidence_sources: ['Sandbox Emulation', 'HTML Lexer', 'URLhaus Blocklist'],
      generated_at: '2026-09-08T08:22:00Z',
    },
  },
};

export const ThreatIntelWorkspace: React.FC = () => {
  const auth = useAuth();
  const ui = useUI();
  const { currentCaseId, caseEvidence, geographicHops } = useInvestigator();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';

  // Read URL query parameter if available (e.g. /hunting?q=185.220.101.5)
  const initialQuery = useMemo(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('q') || '185.220.101.5';
    } catch {
      return '185.220.101.5';
    }
  }, []);

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [selectedIndicator, setSelectedIndicator] = useState<string>(initialQuery);
  const [viewTab, setViewTab] = useState<'dossier' | 'pointerMap' | 'provenance'>('dossier');

  // Interactive Geo Pointer Map state (preserved from HuntingPlaceholder)
  const [isPointerMode, setIsPointerMode] = useState(false);
  const [selectedPinColor, setSelectedPinColor] = useState<'red' | 'amber' | 'emerald' | 'blue'>('red');
  const [customPins, setCustomPins] = useState<{ id: string; lng: number; lat: number; color: string }[]>([
    { id: 'pin-frankfurt', lng: 8.6821, lat: 50.1109, color: 'red' },
    { id: 'pin-ashburn', lng: -77.4874, lat: 39.0438, color: 'blue' },
  ]);

  // Sync state if initial query changes
  useEffect(() => {
    if (initialQuery && initialQuery !== selectedIndicator) {
      setSelectedIndicator(initialQuery);
      setSearchInput(initialQuery);
    }
  }, [initialQuery]);

  // Find active intel detail or fallback
  const activeIntel: ThreatIntelDetail = useMemo(() => {
    const trimmed = selectedIndicator.trim();
    if (INTEL_RECORDS[trimmed]) {
      return INTEL_RECORDS[trimmed];
    }
    // Dynamic generated fallback for unseeded indicator
    return {
      indicator: trimmed,
      type: trimmed.includes('@') ? 'email' : trimmed.includes('/') ? 'url' : trimmed.includes('.') ? 'ip' : 'hash',
      reputation: 'SUSPICIOUS',
      risk_level: 'HIGH',
      confidence: 84,
      first_seen: new Date(Date.now() - 86400000 * 3).toISOString(),
      last_seen: new Date().toISOString(),
      country: 'Germany',
      country_code: 'DE',
      city: 'Frankfurt am Main',
      asn: 'AS205100 (Autonomous System)',
      infrastructure_type: 'External Indicator',
      associated_activity: 'Suspicious Network Activity',
      known_campaigns: ['CMP-PHISH-FIN-2026'],
      related_domains: ['paypal1-secure.com'],
      related_urls: ['https://paypal1-secure.com/invoice/INV-9041/auth'],
      provenance_sources: [
        {
          source_name: 'Global Threat Telemetry Grid',
          category: 'Commercial Feed',
          observation_time: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          confidence: 84,
          reputation: 'SUSPICIOUS',
          source_record_ref: `GRID-${trimmed.substring(0, 8)}`,
        },
      ],
      observed_in_email: {
        case_id: currentCaseId || 'CASE-2026-8812',
        field: 'Observed Telemetry',
        header_snippet: `Indicator ${trimmed} correlated with current investigation case #${currentCaseId || 'CASE-2026-8812'}.`,
      },
      analyst_notes: ['Queried via Threat Intelligence Workstation.'],
      ai_summary: {
        summary_text: `Telemetry indicates ${trimmed} has been observed in association with recent phishing activity. External reputation feeds report suspicious traffic with high confidence.`,
        evidence_count: 4,
        evidence_sources: ['Global Threat Grid', 'Case Observation'],
        generated_at: new Date().toISOString(),
      },
    };
  }, [selectedIndicator, currentCaseId]);

  // Map nodes for GeospatialMap
  const huntingMapNodes = useMemo(() => {
    return customPins.map((pin) => {
      const el = document.createElement('div');
      const colorMap = {
        red: 'border-rose-500 bg-rose-500/20 text-rose-500',
        amber: 'border-amber-500 bg-amber-500/20 text-amber-500',
        emerald: 'border-emerald-500 bg-emerald-500/20 text-emerald-500',
        blue: 'border-blue-500 bg-blue-500/20 text-blue-500',
      };
      const colorClasses = colorMap[pin.color as keyof typeof colorMap] || colorMap.red;
      el.className = `flex items-center justify-center w-6 h-6 rounded-full border-[2.5px] ${colorClasses} shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-110 transition-all backdrop-blur-sm`;

      const dot = document.createElement('div');
      dot.className = `w-1.5 h-1.5 rounded-full ${colorClasses.split(' ')[0].replace('border', 'bg')}`;
      el.appendChild(dot);

      return {
        id: pin.id,
        lng: pin.lng,
        lat: pin.lat,
        element: el,
      } as MapNode;
    });
  }, [customPins]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSelectedIndicator(searchInput.trim());
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-5 lg:p-6 space-y-5 flex flex-col min-h-full font-mono select-none bg-[#f4f7fb] dark:bg-[#070b14] transition-colors">
      {/* Page Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wider">
                <span>Threat Intelligence Workspace</span>
                <ProvenanceLabel type="THREAT INTELLIGENCE" size="xs" />
              </h1>
              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                Investigate external IOC reputation, verify provenance, correlate detection signals, and pivot across forensic surfaces.
              </p>
            </div>
          </div>
        </div>

        {/* Global Case Link & Pivot Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => uiStore.navigate('/investigator')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:border-[#08B4ED]/60 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Active Case: #{currentCaseId || 'CASE-2026-8812'}</span>
            <ExternalLink className="w-3 h-3 text-[#08B4ED]" />
          </button>

          <PivotMenu
            indicator={activeIntel.indicator}
            type={activeIntel.type}
            caseId={currentCaseId || 'CASE-2026-8812'}
            buttonLabel="Pivot Indicator"
          />
        </div>
      </div>

      {/* SECTION 1: SEARCH & QUICK INVESTIGATION IOCS */}
      <div className="space-y-2">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search indicator: e.g. 185.220.101.5, paypal1-secure.com, SHA-256 hash, or URL..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500/60 shadow-xs transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Investigate
          </button>
        </form>

        {/* Quick Picks from Current Case */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Case #{currentCaseId || 'CASE-2026-8812'} IOCs:
          </span>
          {['185.220.101.5', 'paypal1-secure.com', 'https://paypal1-secure.com/invoice/INV-9041/auth'].map((ioc) => (
            <button
              key={ioc}
              type="button"
              onClick={() => {
                setSearchInput(ioc);
                setSelectedIndicator(ioc);
              }}
              className={`px-2 py-0.5 rounded border transition-colors cursor-pointer truncate max-w-[240px] ${
                selectedIndicator === ioc
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500/50 text-purple-600 dark:text-purple-300 font-bold'
                  : 'bg-white dark:bg-[#070b14] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-500'
              }`}
            >
              {ioc}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Tabs: Dossier vs Provenance Grid vs Geo Pointer Map */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-200/70 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewTab('dossier')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'dossier'
                ? 'bg-white dark:bg-[#070b14] text-purple-600 dark:text-purple-400 shadow-xs border border-purple-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Intelligence Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => setViewTab('provenance')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'provenance'
                ? 'bg-white dark:bg-[#070b14] text-purple-600 dark:text-purple-400 shadow-xs border border-purple-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Source Provenance ({activeIntel.provenance_sources.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewTab('pointerMap')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'pointerMap'
                ? 'bg-white dark:bg-[#070b14] text-purple-600 dark:text-purple-400 shadow-xs border border-purple-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Geo Pointer Map</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const snapshot = investigatorStore.getSnapshot();
              const node = snapshot.graphNodes.find((n) => n.value.toLowerCase() === activeIntel.indicator.toLowerCase());
              if (node) investigatorStore.selectEntity(node);
              uiStore.navigate('/investigator/graph');
            }}
            className="px-2.5 py-1 rounded bg-[#08B4ED]/10 hover:bg-[#08B4ED]/20 text-[#08B4ED] border border-[#08B4ED]/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Open in Graph</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTELLIGENCE DOSSIER (Complete 9-Part Architecture) */}
      {viewTab === 'dossier' && (
        <div className="space-y-5">
          {/* SECTION 2: INDICATOR OVERVIEW CARD */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-xs space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Indicator Overview • {activeIntel.type.toUpperCase()}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 break-all mt-0.5">
                  {activeIntel.indicator}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={activeIntel.reputation} size="md" showDot pulse />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  Risk: {activeIntel.risk_level}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  {activeIntel.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                <span className="text-[9.5px] font-bold uppercase text-slate-400 block">First Seen</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {new Date(activeIntel.first_seen).toLocaleDateString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                <span className="text-[9.5px] font-bold uppercase text-slate-400 block">Last Seen</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {new Date(activeIntel.last_seen).toLocaleDateString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                <span className="text-[9.5px] font-bold uppercase text-slate-400 block">Origin Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {activeIntel.city ? `${activeIntel.city}, ` : ''}{activeIntel.country || 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                <span className="text-[9.5px] font-bold uppercase text-slate-400 block">Autonomous System</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5 truncate" title={activeIntel.asn}>
                  {activeIntel.asn || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3 & 4: DUAL COLUMN (Findings & Conceptual Separation) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 6 cols: Intelligence Findings & Provenance */}
            <div className="lg:col-span-6 space-y-4">
              {/* Intelligence Findings Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-purple-500" />
                    <span>Threat Intelligence Findings</span>
                  </h3>
                  <ProvenanceLabel type="THREAT INTELLIGENCE" size="xs" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <span className="text-[9.5px] text-slate-400 block">Infrastructure:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{activeIntel.infrastructure_type || 'Unknown'}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <span className="text-[9.5px] text-slate-400 block">Associated Activity:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeIntel.associated_activity}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <span className="text-[9.5px] text-slate-400 block">Known Campaigns:</span>
                    <span className="font-bold text-[#08B4ED]">{activeIntel.known_campaigns.length} Active</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <span className="text-[9.5px] text-slate-400 block">Related Domains / URLs:</span>
                    <span className="font-bold text-purple-500">
                      {activeIntel.related_domains.length} Domains / {activeIntel.related_urls.length} URLs
                    </span>
                  </div>
                </div>

                {/* Related Domain & URL Nodes */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Related Infrastructure:</span>
                  <div className="space-y-1">
                    {activeIntel.related_domains.slice(0, 3).map((dom) => (
                      <div
                        key={dom}
                        onClick={() => {
                          setSearchInput(dom);
                          setSelectedIndicator(dom);
                        }}
                        className="p-1.5 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-purple-500/50 transition-colors cursor-pointer text-xs"
                      >
                        <span className="text-slate-700 dark:text-slate-200 font-semibold">{dom}</span>
                        <span className="text-[10px] text-purple-500 font-bold">Inspect →</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* OBSERVED IN EMAIL FORENSIC GROUND TRUTH (Section 12) */}
              {activeIntel.observed_in_email && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-[#08B4ED]" />
                      <span>Observed In Email (Authoritative Forensic Evidence)</span>
                    </h3>
                    <ProvenanceLabel type="OBSERVED EVIDENCE" size="xs" />
                  </div>

                  <div className="text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Field Location: <strong className="text-slate-800 dark:text-slate-200">{activeIntel.observed_in_email.field}</strong></span>
                      <span className="font-bold text-[#08B4ED]">Case #{activeIntel.observed_in_email.case_id}</span>
                    </div>

                    <pre className="p-2.5 rounded bg-slate-900 text-slate-200 text-[10.5px] overflow-x-auto font-mono border border-slate-800 leading-relaxed">
                      {activeIntel.observed_in_email.header_snippet}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Right 6 cols: Correlation, AI Interpretation & Geolocation */}
            <div className="lg:col-span-6 space-y-4">
              {/* AI INTELLIGENCE SUMMARY (Section 15) */}
              {activeIntel.ai_summary && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                        AI Intelligence Summary
                      </h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-bold">
                      SUPPORTED BY: {activeIntel.ai_summary.evidence_count} RECORDS
                    </span>
                  </div>

                  <p className="text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-[#070b14] p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                    "{activeIntel.ai_summary.summary_text}"
                  </p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Underlying Evidence:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeIntel.ai_summary.evidence_sources.map((src) => (
                        <span
                          key={src}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => investigatorStore.openEvidenceInspector(true)}
                      className="px-2.5 py-1 rounded bg-[#08B4ED]/10 hover:bg-[#08B4ED]/20 text-[#08B4ED] border border-[#08B4ED]/30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Archive className="w-3 h-3" />
                      <span>View Evidence</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const snapshot = investigatorStore.getSnapshot();
                        const node = snapshot.graphNodes.find((n) => n.value.toLowerCase() === activeIntel.indicator.toLowerCase());
                        if (node) investigatorStore.selectEntity(node);
                        uiStore.navigate('/investigator/graph');
                      }}
                      className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Network className="w-3 h-3" />
                      <span>Open Graph</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => uiStore.navigate('/investigator')}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>Ask AI in Workspace</span>
                    </button>
                  </div>
                </div>
              )}

              {/* DETECTION SIGNALS CORRELATION (Section 16) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-amber-500" />
                    <span>ML + Threat Intelligence Correlation Signals</span>
                  </h3>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                    CONCORDANT RISK: CRITICAL
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ProvenanceLabel type="ML DETECTION" size="xs" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Email Classifier</span>
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">PHISHING — 96%</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ProvenanceLabel type="ML DETECTION" size="xs" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">URL Model (LightURLNet)</span>
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">MALICIOUS — 98%</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ProvenanceLabel type="THREAT INTELLIGENCE" size="xs" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">External Threat Telemetry</span>
                    </div>
                    <span className="font-bold text-purple-600 dark:text-purple-400">MATCHED — HIGH CONFIDENCE</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ProvenanceLabel type="OBSERVED EVIDENCE" size="xs" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Infrastructure Relay</span>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400">CONFIRMED TOR EXIT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOURCE & PROVENANCE BREAKDOWN (Section 11) */}
      {viewTab === 'provenance' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-500" />
                <span>Forensic Provenance & Audit Verification</span>
              </h3>
              <p className="text-[11px] font-sans text-slate-500 mt-0.5">
                Every external indicator finding is tracked with timestamped evidence provenance to maintain forensic integrity in court.
              </p>
            </div>
            <span className="text-[10.5px] font-mono text-[#08B4ED] font-bold">
              {activeIntel.provenance_sources.length} Independent Providers
            </span>
          </div>

          <div className="space-y-3">
            {activeIntel.provenance_sources.map((src, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {src.source_name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                      {src.category}
                    </span>
                  </div>
                  <SeverityBadge severity={src.reputation} size="sm" showDot />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10.5px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div>
                    <span>Observed: </span>
                    <strong className="text-slate-700 dark:text-slate-300 font-mono">
                      {new Date(src.observation_time).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span>Updated: </span>
                    <strong className="text-slate-700 dark:text-slate-300 font-mono">
                      {new Date(src.last_updated).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span>Record Ref: </span>
                    <code className="text-[#08B4ED] font-bold">{src.source_record_ref}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GEO POINTER MAP (Preserved & Integrated from HuntingPlaceholder) */}
      {viewTab === 'pointerMap' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Geo-Intelligence Toolbar */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
                <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                <span>Interactive Forensic Pointer Map</span>
              </h3>
              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                Drop forensic markers, plan cross-campaign correlation, and inspect relay origin trajectory.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isPointerMode && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 mr-1">PIN COLOR:</span>
                  {(['red', 'amber', 'emerald', 'blue'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedPinColor(color)}
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedPinColor === color ? 'border-slate-900 dark:border-slate-100 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      } transition-all cursor-pointer`}
                      style={{
                        backgroundColor: color === 'red' ? '#f43f5e' : color === 'amber' ? '#f59e0b' : color === 'emerald' ? '#10b981' : '#3b82f6',
                      }}
                      title={`Drop ${color} pin`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomPins([])}
                    className="ml-2 text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    CLEAR
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsPointerMode(!isPointerMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  isPointerMode
                    ? 'bg-blue-900/30 border-blue-800 text-blue-400'
                    : 'bg-white dark:bg-[#0c1322] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isPointerMode ? 'Done Marker Placement' : 'Drop Forensic Pins'}</span>
              </button>
            </div>
          </div>

          {/* Geospatial Map Container */}
          <div className="w-full min-h-[520px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative shadow-inner">
            {isPointerMode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-slate-950/90 text-white text-xs font-bold rounded-full border border-slate-800 backdrop-blur-sm pointer-events-none shadow-xl flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Click anywhere on the world map to drop a forensic investigation marker
              </div>
            )}
            <GeospatialMap
              nodes={huntingMapNodes}
              initialCenter={[20, 30]}
              initialZoom={1.5}
              interactive={true}
              className={`w-full h-full ${isPointerMode ? 'cursor-crosshair' : ''}`}
              onMapClick={(lngLat) => {
                if (isPointerMode) {
                  setCustomPins((prev) => [
                    ...prev,
                    {
                      id: `hunting-pin-${Date.now()}`,
                      lng: lngLat.lng,
                      lat: lngLat.lat,
                      color: selectedPinColor,
                    },
                  ]);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
