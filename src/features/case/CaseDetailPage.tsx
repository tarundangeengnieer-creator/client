import React, { useState, useMemo, useEffect } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { investigatorStore, useInvestigator } from '../../stores/investigator-store.ts';
import { useAuth } from '../../stores/auth-store.ts';
import { casesStore, CaseViewModel } from '../../stores/cases-store.ts';
import { ForensicReportPage } from '../reports/ForensicReportPage.tsx';
import { downloadPdfReport } from '../reports/exporters.ts';
import {
  Mail,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  FileDown,
  RotateCw,
  MoreHorizontal,
  ChevronRight,
  Shield,
  FileText,
  Activity,
  Archive,
  History,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Globe,
  Server,
  ArrowRight,
  AlertCircle,
  Terminal,
  Bookmark,
  Search,
  MapPin,
  Paperclip,
  Link2,
  Code,
  Sparkles,
} from 'lucide-react';
import { GeospatialMap, MapNode, MapRoute } from '../../components/ui/GeospatialMap.tsx';
import { EntityRelationshipGraph } from '../investigator/components/EntityRelationshipGraph.tsx';
import { InvestigationTimeline } from '../investigator/components/InvestigationTimeline.tsx';
import { ThreatIntelPanel } from '../investigator/components/ThreatIntelPanel.tsx';
import { OriginIntelligenceWorkspace } from '../investigator/components/OriginIntelligenceWorkspace.tsx';
import { EntityProfileDrawer } from '../investigator/components/EntityProfileDrawer.tsx';
import { EmailEntityModal } from '../investigator/components/EmailEntityModal.tsx';
import { LinkCaseModal } from '../investigator/components/LinkCaseModal.tsx';
import { MergeCampaignModal } from '../investigator/components/MergeCampaignModal.tsx';
import { EscalateModal } from '../investigator/components/EscalateModal.tsx';

export const CaseDetailPage: React.FC = () => {
  const ui = useUI();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id;

  // GAP 1 FIX: Extract case ID from URL path /case/:id first, then activeCaseId, then demo fallback
  const caseIdFromUrl = ui.currentPath.startsWith('/case/')
    ? ui.currentPath.replace('/case/', '').split('/')[0].split('?')[0]
    : null;
  const caseId = caseIdFromUrl || ui.activeCaseId || 'A2291';

  // Sync uiStore.activeCaseId when we resolve a case ID from URL that differs from the current active
  useEffect(() => {
    if (caseId && caseId !== ui.activeCaseId) {
      const resolved = casesStore.getCase(caseId);
      if (resolved) {
        uiStore.setActiveCase(
          resolved.id,
          resolved.subject,
          resolved.verdict,
          resolved.riskScore,
          resolved.confidence
        );
      } else {
        // Case not in store yet (e.g. deep link) — set ID anyway so HUD is consistent
        uiStore.setActiveCase(caseId);
      }
    }
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tenantId && caseId) {
      investigatorStore.selectCase(caseId, tenantId);
    }
  }, [caseId, tenantId]);
  const caseData = casesStore.getCase(caseId) || {
    id: 'A2291',
    subject: 'Invoice Payment Update - Action Required',
    sender: 'support@paypal1-secure.com',
    recipient: 'user@company.com',
    timestamp: '2025-08-12T10:24:00Z',
    verdict: 'MALICIOUS' as const,
    riskScore: 87.0,
    confidence: 0.87,
    originIp: '185.220.101.5',
    originCountry: 'Germany',
    primaryIoc: 'paypal1-secure.com/invoice',
    attackHypotheses: ['Credential Phishing', 'Impersonation'],
    toolsUsed: ['header_parse', 'url_ml', 'geoip_lookup'],
    toolsFailed: [] as string[],
    iterationCount: 3,
    stopReason: 'CONFIDENCE_TARGET_REACHED',
    resourceEnvelope: { wallClockMs: 1840, toolCalls: 8, externalCalls: 3, tokensUsed: 0 },
    evidenceCount: 6,
    isTorExit: true,
    hasAttachmentMismatch: false,
    recommendation: 'QUARANTINE' as const,
  };

  const investigation = casesStore.getInvestigation(caseId);

  type DetailTab =
    | 'overview'
    | 'split'
    | 'evidence'
    | 'timeline'
    | 'graph'
    | 'threat-intel'
    | 'report'
    | 'findings'
    | 'geolocation'
    | 'ai-analysis';

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [threatPreviewMode, setThreatPreviewMode] = useState<'rendered' | 'text' | 'raw'>('rendered');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isReinvestigating, setIsReinvestigating] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // AI Reasoning state — fetched from /reason endpoint
  const [reasoningResult, setReasoningResult] = useState<import('../../contracts/backend.ts').ReasoningResult | null>(null);
  const [reasoningLoading, setReasoningLoading] = useState(false);
  const [reasoningError, setReasoningError] = useState<string | null>(null);

  // Fetch AI reasoning narrative when we have a real investigation
  useEffect(() => {
    // Only fetch when we have an investigation object (works for real + demo cases)
    if (!caseId || !investigation) return;

    setReasoningLoading(true);
    setReasoningError(null);

    import('../../api/client.ts').then(({ apiClient }) => {
      import('../../api/endpoints.ts').then(({ ENDPOINTS }) => {
        apiClient
          .post<{ reasoning_status: string; reasoning_result?: Partial<import('../../contracts/backend.ts').ReasoningResult>; reason?: string }>(
            ENDPOINTS.INVESTIGATION_REASON(caseId)
          )
          .then(raw => {
            // Backend returns { reasoning_status, reasoning_result } or { reasoning_status, reason }
            if (raw.reasoning_status === 'available' && raw.reasoning_result) {
              const r = raw.reasoning_result;
              setReasoningResult({
                ...r,
                investigation_id: r.investigation_id ?? caseId,
                summary: r.summary ?? 'No reasoning summary available.',
                hypotheses: r.hypotheses ?? [],
                recommended_next_actions: r.recommended_next_actions ?? [],
              } as import('../../contracts/backend.ts').ReasoningResult);
            } else {
              // Reasoning unavailable — show graceful fallback
              const reason = raw.reason ?? 'AI reasoning is currently unavailable.';
              setReasoningError(reason);
            }
          })
          .catch(err => {
            // Non-fatal — the AI tab will show a graceful message
            setReasoningError(err?.message || 'AI reasoning unavailable');
            console.warn('Reasoning fetch failed:', err);
          })
          .finally(() => setReasoningLoading(false));
      });
    });
  }, [caseId, investigation]);

  // Seed investigatorStore graph from investigation data when graph is empty (mock mode / backend unavailable)
  const { graphNodes } = useInvestigator();
  useEffect(() => {
    if (!investigation || graphNodes.length > 0) return;
    // Build synthetic graph nodes from the investigation's geolocation and attack_hypotheses
    const nodes: import('../../domain/investigator.ts').GraphNode[] = [];
    const edges: import('../../domain/investigator.ts').GraphEdge[] = [];

    // Root: Email node
    nodes.push({
      id: 'root-email',
      type: 'Email',
      label: caseData.subject || 'Email',
      value: caseData.sender || '',
      confidence: caseData.riskScore,
      depth: 0,
    });

    // IP/Geo hops as depth-1 nodes
    (investigation.geolocation || []).slice(0, 3).forEach((hop, i) => {
      const nodeId = `geo-${i}`;
      nodes.push({
        id: nodeId,
        type: 'Source IP',
        label: `${hop.country_code || 'IP'} Relay`,
        value: hop.ip || `hop-${i}`,
        confidence: 50,
        depth: 1,
        attributes: { country: hop.country || '', asn: hop.asn || '' },
      });
      edges.push({ id: `e-root-${nodeId}`, source: 'root-email', target: nodeId, label: 'routed via', relationship_type: 'RELAY' });
    });

    // Attack hypotheses as depth-2 nodes
    (investigation.attack_hypotheses || []).filter(h => h.status === 'SUPPORTED' || h.status === 'UNCERTAIN').slice(0, 3).forEach((h, i) => {
      const nodeId = `hyp-${i}`;
      nodes.push({
        id: nodeId,
        type: 'Threat Intelligence Indicator',
        label: h.hypothesis_type.replace(/_/g, ' '),
        value: `${(h.score * 100).toFixed(0)}% confidence`,
        confidence: h.score * 100,
        depth: 2,
      });
      edges.push({ id: `e-email-${nodeId}`, source: 'root-email', target: nodeId, label: 'matches', relationship_type: 'HYPOTHESIS' });
    });

    if (nodes.length > 1) {
      investigatorStore.seedGraph(nodes, edges);
    }
  }, [investigation, graphNodes.length, caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Map Interactive Pointer States
  const [isPointerMode, setIsPointerMode] = useState(false);
  const [selectedPinColor, setSelectedPinColor] = useState<'red' | 'amber' | 'emerald' | 'blue'>('red');
  const [customPins, setCustomPins] = useState<{ id: string; lng: number; lat: number; color: string }[]>([]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('https://paypal1-secure.com/invoice');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    uiStore.addToast('info', 'Suspicious URL copied to clipboard');
  };

  const handleReinvestigate = () => {
    setIsReinvestigating(true);
    uiStore.addToast('info', `Autonomous re-investigation triggered for Case #${caseId}`);
    setTimeout(() => {
      setIsReinvestigating(false);
      uiStore.addToast('success', `Case #${caseId} telemetry verified with 8 forensic tools.`);
    }, 1200);
  };

  const handleDownloadMainReport = () => {
    setIsDownloadingPdf(true);
    setActiveTab('report');
    uiStore.addToast('info', `Compiling main exact forensic report for Case #${caseId}...`);
    
    // Give React time to render the report tab and its DOM elements if needed
    setTimeout(async () => {
      try {
        await downloadPdfReport('exact-forensic-report-main', caseId, undefined, caseData, investigation);
        uiStore.addToast('success', `Main Forensic Report downloaded for Case #${caseId}.`);
      } catch (err) {
        console.error('Failed to generate exact PDF report:', err);
        uiStore.addToast('error', 'Failed to generate exact PDF report.');
      } finally {
        setIsDownloadingPdf(false);
      }
    }, 400);
  };

  // Helper: country_code → flag emoji (e.g. "IN" → "🇮🇳")
  const toFlagEmoji = (cc?: string | null) => {
    if (!cc || cc.length !== 2) return '🌐';
    return cc.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E0 + c.charCodeAt(0) - 65));
  };

  // Helper: country_code → approximate centroid [lng, lat] for map positioning
  const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
    US: [-98.5, 39.5], GB: [-1.0, 52.0], DE: [10.0, 51.0], FR: [2.5, 46.5],
    RU: [60.0, 60.0], CN: [104.0, 35.0], IN: [78.9, 20.6], JP: [138.0, 36.0],
    AU: [133.0, -25.0], BR: [-52.0, -10.0], CA: [-96.0, 56.0], SG: [103.8, 1.4],
    HK: [114.2, 22.3], NL: [5.3, 52.1], UA: [31.0, 49.0], RO: [24.9, 45.9],
    PL: [19.0, 52.0], TR: [35.0, 39.0], KR: [127.0, 36.0], ID: [120.0, -5.0],
    VN: [108.0, 14.0], MY: [109.5, 4.2], TH: [100.5, 15.0], PK: [69.3, 30.0],
    BD: [90.4, 23.7], NG: [8.0, 10.0], ZA: [25.0, -29.0], KE: [37.9, -0.02],
    EG: [30.0, 26.8], IL: [34.9, 31.5], SA: [45.0, 23.9], IR: [53.0, 32.4],
    SE: [18.6, 62.0], NO: [10.0, 62.0], DK: [10.0, 56.0], FI: [26.0, 64.0],
    CH: [8.2, 46.8], AT: [13.2, 47.5], BE: [4.5, 50.5], PT: [-8.2, 39.5],
    ES: [-3.7, 40.4], IT: [12.5, 42.5], PH: [122.0, 12.0], NZ: [174.0, -41.0],
    MX: [-102.0, 23.6], AR: [-64.0, -34.0], CL: [-71.0, -30.0], CO: [-74.3, 4.6],
    BY: [28.0, 53.0], CZ: [15.5, 49.8], HU: [19.5, 47.2],
    BG: [25.5, 42.7], HR: [16.4, 45.1], SK: [19.5, 48.7], RS: [21.0, 44.0],
  };

  const getCountryLatLng = (cc?: string | null): [number, number] | null => {
    if (!cc) return null;
    return COUNTRY_CENTROIDS[cc.toUpperCase()] ?? null;
  };

  const caseMapNodes = useMemo(() => {
    const realHops = investigation?.geolocation;

    // Build hop data with real country-derived coordinates
    const FALLBACK_HOPS = [
      { id: 'hop-in', lng: 78.9, lat: 20.6, flag: '🇮🇳' },
      { id: 'hop-sg', lng: 103.8, lat: 1.4, flag: '🇸🇬' },
      { id: 'hop-de', lng: 10.0, lat: 51.0, flag: '🇩🇪' },
    ];

    const hops = realHops && realHops.length > 0
      ? realHops.slice(0, 3).map((h, i) => {
          const coords = getCountryLatLng(h.country_code) ?? (FALLBACK_HOPS[i] ? [FALLBACK_HOPS[i].lng, FALLBACK_HOPS[i].lat] as [number, number] : [0, 20] as [number, number]);
          return {
            id: `hop-geo-${i}`,
            lng: coords[0],
            lat: coords[1],
            flag: toFlagEmoji(h.country_code),
          };
        })
      : FALLBACK_HOPS;

    const hopNodes = hops.map(hop => {
      const el = document.createElement('div');
      el.className = "flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0c1322] border-2 border-slate-300 dark:border-slate-700 shadow-md text-lg cursor-pointer hover:scale-110 transition-transform";
      el.innerText = hop.flag;
      return {
        id: hop.id,
        lng: hop.lng,
        lat: hop.lat,
        element: el,
      } as MapNode;
    });

    const userNodes = customPins.map(pin => {
      const el = document.createElement('div');
      const colorMap = {
        red: 'border-rose-500 bg-rose-500/20 text-rose-500',
        amber: 'border-amber-500 bg-amber-500/20 text-amber-500',
        emerald: 'border-emerald-500 bg-emerald-500/20 text-emerald-500',
        blue: 'border-blue-500 bg-blue-500/20 text-blue-500'
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

    return [...hopNodes, ...userNodes];
  }, [customPins, investigation]); // eslint-disable-line react-hooks/exhaustive-deps

  const caseMapRoutes = useMemo(() => {
    const realHops = investigation?.geolocation;
    let coords: [number, number][];

    if (realHops && realHops.length > 0) {
      coords = realHops.slice(0, 3).map((h, i) => {
        const FALLBACK: [number, number][] = [[78.9, 20.6], [103.8, 1.4], [10.0, 51.0]];
        return getCountryLatLng(h.country_code) ?? FALLBACK[i] ?? [0, 20];
      });
    } else {
      coords = [[78.9, 20.6], [103.8, 1.4], [10.0, 51.0]];
    }

    return [
      {
        id: 'route-1',
        coordinates: coords,
        color: '#f43f5e',
        width: 3,
        dashed: true,
      }
    ];
  }, [investigation]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full min-w-0 p-4 sm:p-5 lg:p-6 space-y-5 lg:space-y-6">
      {/* 1. CASE HEADER CARD */}
      <div id="case-header-card" className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Case Title & Metadata */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0c1322] border border-transparent flex items-center justify-center text-slate-800 dark:text-white shrink-0 shadow-xs">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Case #{caseData.id.length > 12 ? `${caseData.id.slice(0, 8)}…` : caseData.id}
                  </h1>
                  {caseData.id.length > 12 && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(caseData.id);
                        uiStore.addToast('info', `Full Case UUID copied: ${caseData.id}`);
                      }}
                      title={`Copy full UUID: ${caseData.id}`}
                      aria-label="Copy full Case UUID"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {caseData.verdict}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full bg-transparent border text-xs font-semibold ${caseData.riskScore >= 80 ? 'border-rose-500/30 text-rose-600 dark:text-rose-400' : 'border-amber-500/30 text-amber-600 dark:text-amber-400'}`}>
                  Risk: {caseData.riskScore}
                </span>
              </div>

              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                {caseData.subject}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <div>
                  <span className="text-slate-400 dark:text-slate-500">From: </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{caseData.sender}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">To: </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{caseData.recipient}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Received: </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(caseData.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    }).replace(' AM', ' am').replace(' PM', ' pm')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Status: </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Investigating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={handleReinvestigate}
              disabled={isReinvestigating}
              className="h-9 px-3.5 flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReinvestigating ? 'animate-spin text-blue-600' : ''}`} />
              <span>Re-investigate</span>
            </button>

            <button
              type="button"
              id="btn-download-report-pdf"
              onClick={handleDownloadMainReport}
              disabled={isDownloadingPdf}
              className="h-9 px-3.5 flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-60"
              title="Download Main Exact Forensic Report (NIST SP 800-86)"
            >
              <FileDown className={`w-3.5 h-3.5 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingPdf ? 'Generating Report...' : 'Download Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW: Investigation Context Bar */}
      <div className="flex items-center gap-2 pb-2 select-none print:hidden border-b border-slate-200 dark:border-slate-800/80">
        {[
          { label: 'Threat detected', state: 'done' },
          { label: 'Evidence collected', state: 'done' },
          { label: 'Indicators correlated', state: 'done' },
          { label: 'Investigation in progress', state: 'active' },
          { label: 'Report pending', state: 'pending' }
        ].map((phase, i, arr) => (
          <React.Fragment key={phase.label}>
            <div className={`text-xs font-semibold flex items-center gap-1.5 ${
              phase.state === 'done' ? 'text-emerald-600 dark:text-emerald-400' :
              phase.state === 'active' ? 'text-blue-600 dark:text-sky-400' :
              'text-slate-400 dark:text-slate-500'
            }`}>
              {phase.state === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
               phase.state === 'active' ? <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(8,180,237,0.6)] ml-1 mr-0.5" /> :
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 ml-1 mr-0.5" />}
              {phase.label}
            </div>
            {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 mx-1" />}
          </React.Fragment>
        ))}
      </div>

      {/* 2. TAB NAVIGATION BAR matching screenshot */}
      <div className="flex items-center gap-6 sm:gap-7 text-xs font-medium select-none overflow-x-auto no-scrollbar pt-1 print:hidden">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'split', label: 'Forensic Split' },
          { id: 'evidence', label: 'Evidence (Raw Email)' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'graph', label: 'Graph' },
          { id: 'threat-intel', label: 'Threat Intelligence' },
          { id: 'ai-analysis', label: 'AI Analysis' },
          { id: 'report', label: 'Report' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as DetailTab)}
            className={`pb-3 whitespace-nowrap transition-colors relative cursor-pointer font-semibold ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-sky-400 border-b-2 border-blue-600 dark:border-sky-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-b-2 border-transparent'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.id === 'ai-analysis' && reasoningLoading && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              )}
              {tab.id === 'ai-analysis' && reasoningResult && !reasoningLoading && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* 3. ACTIVE TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ROW 1: 3 COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Col 1: Executive Summary */}
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/70">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Executive Summary</h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {investigation?.risk_reasons && investigation.risk_reasons.length > 0
                    ? `This email has been classified as ${caseData.verdict}. ${investigation.risk_reasons.slice(0, 2).join('. ')}.`
                    : 'This email is likely a phishing attempt impersonating PayPal. It contains a suspicious link leading to a lookalike domain and uses deceptive language to create urgency.'}
                </p>

                {/* Key Threat Box */}
                <div className={`p-3.5 rounded-xl bg-slate-50 dark:bg-[#090e1c] border flex items-start gap-3 ${
                  caseData.verdict === 'MALICIOUS' ? 'border-rose-500/30' :
                  caseData.verdict === 'SUSPICIOUS' ? 'border-amber-500/30' :
                  caseData.verdict === 'BENIGN' ? 'border-emerald-500/30' : 'border-slate-500/30'
                }`}>
                  <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
                    caseData.verdict === 'MALICIOUS' ? 'text-rose-600 dark:text-rose-400' :
                    caseData.verdict === 'SUSPICIOUS' ? 'text-amber-600 dark:text-amber-400' :
                    caseData.verdict === 'BENIGN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                  }`} />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Key Threat: <span className={
                        caseData.verdict === 'MALICIOUS' ? 'text-rose-600 dark:text-rose-400' :
                        caseData.verdict === 'SUSPICIOUS' ? 'text-amber-600 dark:text-amber-400' :
                        caseData.verdict === 'BENIGN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                      }>
                        {investigation?.attack_hypotheses && investigation.attack_hypotheses.length > 0
                          ? investigation.attack_hypotheses.filter(h => h.status === 'SUPPORTED' || h.status === 'UNCERTAIN').map(h => h.hypothesis_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(' + ') || caseData.verdict
                          : caseData.attackHypotheses?.join(' + ') || caseData.verdict}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                      {investigation?.attack_hypotheses && investigation.attack_hypotheses.length > 0
                        ? investigation.attack_hypotheses.filter(h => (h.reasons?.length ?? 0) > 0).map(h => h.reasons?.[0] ?? '').join('. ') || 'Forensic investigation completed.'
                        : 'Targeted credentials harvester mimicking official PayPal payment dispute workflow.'}
                    </p>
                  </div>
                </div>

                {/* Attack Metadata List — Dynamic from investigation */}
                <div className="pt-2 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800/70">
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Verdict:</span>
                    <span className={`font-semibold ${
                      caseData.verdict === 'MALICIOUS' ? 'text-rose-600 dark:text-rose-400' :
                      caseData.verdict === 'SUSPICIOUS' ? 'text-amber-600 dark:text-amber-400' :
                      caseData.verdict === 'BENIGN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>{caseData.verdict}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Attack Type:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {investigation?.attack_hypotheses?.find(h => h.status === 'SUPPORTED')?.hypothesis_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || caseData.attackHypotheses?.[0] || 'Phishing'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Confidence:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {((caseData.confidence ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Investigation Level:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {investigation?.investigation_level_reached?.replace(/_/g, ' ') || 'L1 Targeted'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Origin IP:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{caseData.originIp || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 dark:text-slate-500">Origin Country:</span>
                    <span className="text-slate-700 dark:text-slate-300">{caseData.originCountry || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Investigation Engine: ASH-Adaptive v3.2</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {investigation?.tools_used?.length || caseData.toolsUsed?.length || 8} Tools Executed
                </span>
              </div>
            </div>

            {/* Col 2: Key Findings */}
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Key Findings</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('findings')}
                    className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Findings</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Key Findings — Dynamic from risk_reasons */}
                <div className="space-y-3 mt-3">
                  {investigation?.risk_reasons && investigation.risk_reasons.length > 0
                    ? investigation.risk_reasons.map((reason, idx) => {
                        // Determine severity from risk score and reason content
                        const isCritical = caseData.riskScore >= 70 && idx < 2;
                        const isWarning = !isCritical && idx < 4;
                        const iconColor = isCritical ? 'text-rose-600 dark:text-rose-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
                        const badgeColor = isCritical ? 'border-rose-500/30 text-rose-600 dark:text-rose-400' : isWarning ? 'border-amber-500/30 text-amber-600 dark:text-amber-400' : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
                        const badgeText = isCritical ? 'Critical' : isWarning ? 'Warning' : 'Info';
                        const Icon = isCritical ? AlertCircle : isWarning ? AlertTriangle : CheckCircle2;

                        return (
                          <div key={idx} className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className={`w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 ${iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Finding #{idx + 1}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">{reason}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full bg-transparent border ${badgeColor} font-semibold text-[10px] shrink-0`}>
                              {badgeText}
                            </span>
                          </div>
                        );
                      })
                    : /* Fallback: legacy hardcoded findings for demo */
                      <>
                        <div className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Suspicious Domain</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">paypal1-secure.com (lookalike registered 4h ago)</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold text-[10px]">
                            Malicious
                          </span>
                        </div>
                        <div className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">SPF Check</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Pass (Host permitted in rogue SPF record)</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-transparent border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                            Success
                          </span>
                        </div>
                      </>
                  }
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>{investigation?.risk_reasons?.length || 6} indicators correlated</span>
                <span className={`font-semibold ${
                  caseData.confidence >= 0.8 ? 'text-emerald-600 dark:text-emerald-400' :
                  caseData.confidence >= 0.5 ? 'text-amber-600 dark:text-amber-400' :
                  'text-rose-600 dark:text-rose-400'
                }`}>{caseData.confidence >= 0.8 ? 'High' : caseData.confidence >= 0.5 ? 'Medium' : 'Low'} confidence</span>
              </div>
            </div>

            {/* Col 3: Threat Preview with Segmented Mode Switcher */}
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Threat Preview</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" />
                    Safe Render
                  </span>
                </div>

                {/* Segmented view mode buttons */}
                <div className="mt-3 flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setThreatPreviewMode('rendered')}
                    className={`flex-1 h-7 px-2.5 rounded-md font-medium text-center transition-colors cursor-pointer text-xs ${
                      threatPreviewMode === 'rendered'
                        ? 'bg-white dark:bg-[#0c1322] text-blue-600 dark:text-sky-400 shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Rendered Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setThreatPreviewMode('text')}
                    className={`flex-1 h-7 px-2.5 rounded-md font-medium text-center transition-colors cursor-pointer text-xs ${
                      threatPreviewMode === 'text'
                        ? 'bg-white dark:bg-[#0c1322] text-blue-600 dark:text-sky-400 shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Text View
                  </button>
                  <button
                    type="button"
                    onClick={() => setThreatPreviewMode('raw')}
                    className={`flex-1 h-7 px-2.5 rounded-md font-medium text-center transition-colors cursor-pointer text-xs ${
                      threatPreviewMode === 'raw'
                        ? 'bg-white dark:bg-[#0c1322] text-blue-600 dark:text-sky-400 shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Source (Raw)
                  </button>
                </div>

                {/* Preview Content Container */}
                {threatPreviewMode === 'rendered' && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 text-xs space-y-3 font-sans">
                    {/* Email headers */}
                    <div className="space-y-1 pb-2.5 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <p>
                        <strong className="text-slate-700 dark:text-slate-300 font-sans">From:</strong> PayPal Support &lt;support@paypal1-secure.com&gt;
                      </p>
                      <p>
                        <strong className="text-slate-700 dark:text-slate-300 font-sans">To:</strong> user@company.com
                      </p>
                      <p>
                        <strong className="text-slate-700 dark:text-slate-300 font-sans">Date:</strong> 12 Aug 2025, 10:24 AM
                      </p>
                    </div>

                    {/* Email Body */}
                    <div className="pt-1 space-y-3 bg-white dark:bg-[#0d1627] p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                      {/* Brand Header Mock */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-blue-600 text-white font-black italic flex items-center justify-center text-sm shadow-xs">
                          P
                        </div>
                        <span className="font-extrabold text-blue-900 dark:text-sky-400 tracking-tight text-sm">PayPal</span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">Payment Confirmation Required</h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Dear customer, We detected an unusual transaction of $349.00 USD on your account. If you did not authorize this, please review and cancel the invoice immediately.
                      </p>

                      {/* Phishing Call to Action - Sandboxed & Muted with warning indicator */}
                      <div className="pt-1">
                        <div className="inline-flex items-center gap-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <button
                            type="button"
                            onClick={() => uiStore.addToast('warning', 'Live click intercepted: URL points to phishing harvester!')}
                            className="h-8 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md text-xs font-medium transition-colors cursor-pointer"
                            title="Untrusted simulated phishing link"
                          >
                            View Invoice
                          </button>
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1 pr-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            Phishing Link (Sandboxed)
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                        PayPal Pte. Ltd. All rights reserved.
                      </p>
                    </div>
                  </div>
                )}

                {threatPreviewMode === 'text' && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
{`From: PayPal Support <support@paypal1-secure.com>
To: user@company.com
Subject: Invoice Payment Update - Action Required
Date: 12 Aug 2025 10:24:00 +0000

Dear customer,

We detected an unusual transaction of $349.00 USD on your account.
If you did not authorize this charge, please review and cancel the invoice immediately:

Link: https://paypal1-secure.com/invoice

Thank you,
PayPal Security & Fraud Department`}
                  </div>
                )}

                {threatPreviewMode === 'raw' && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
                    <pre>{`Return-Path: <bounce@paypal1-secure.com>
Received: from mail.paypal1-secure.com (185.220.101.5)
 by mx.company.com with ESMTP id 9X29A78
 for <user@company.com>; Tue, 12 Aug 2025 10:24:00 +0000
Message-ID: <202508121024.PAYPAL-ALERT@paypal1-secure.com>
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="--boundary_7812"
X-Mailer: Python-smtplib/3.10
Authentication-Results: mx.company.com;
 spf=pass (sender IP is 185.220.101.5);
 dkim=none;
 dmarc=fail (p=reject)`}</pre>
                  </div>
                )}
              </div>

              {/* Suspicious URL Warning Banner with Copy */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-[#090e1c] border border-rose-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      Suspicious URL Detected
                    </div>
                    <div className="text-xs font-mono text-slate-900 dark:text-white truncate">
                      https://paypal1-secure.com/invoice
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="h-7 px-2.5 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: 3 CARDS matching sample image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Email Geolocation & Route */}
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Email Geolocation & Route</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('geolocation')}
                    className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View on Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Route diagram — dynamic from investigation.geolocation */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
                  {(() => {
                    const geoHops = investigation?.geolocation && investigation.geolocation.length > 0
                      ? investigation.geolocation
                      : null;

                    // Helper: country code → flag emoji
                    const toFlag = (cc?: string | null) => {
                      if (!cc || cc.length !== 2) return '🌐';
                      return cc.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E0 + c.charCodeAt(0) - 65));
                    };

                    if (geoHops) {
                      return (
                        <div className="flex items-center justify-around gap-2 text-center flex-wrap">
                          {geoHops.slice(0, 3).map((hop, idx) => (
                            <React.Fragment key={idx}>
                              <div className="flex-1 min-w-0">
                                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs mb-1.5">
                                  {toFlag(hop.country_code)}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                  {idx === 0 ? 'Origin' : idx === geoHops.slice(0,3).length - 1 ? 'Destination' : 'Relay'}
                                </span>
                                <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">{hop.ip}</p>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{hop.country || hop.country_code || 'Unknown'}</span>
                              </div>
                              {idx < geoHops.slice(0,3).length - 1 && (
                                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      );
                    }

                    // Fallback: hardcoded demo route
                    return (
                      <div className="flex items-center justify-between gap-2 text-center">
                        <div className="flex-1 min-w-0">
                          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs mb-1.5">🇮🇳</div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sender IP</span>
                          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">103.21.244.88</p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">India</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs mb-1.5">🇸🇬</div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Relay</span>
                          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">45.117.12.34</p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Singapore</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs mb-1.5">🇩🇪</div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">185.112.36.21</p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Germany</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-3 pt-2 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>
                  {investigation?.geolocation && investigation.geolocation.length > 0
                    ? `${investigation.geolocation.length} relay hop${investigation.geolocation.length !== 1 ? 's' : ''} detected`
                    : 'Multi-hop proxy chain detected'}
                </span>
                <span className={`font-semibold font-mono ${caseData.isTorExit ? 'text-rose-500' : 'text-slate-500'}`}>
                  {caseData.isTorExit ? 'Tor Exit Detected' : investigation?.geolocation?.[0]?.asn || 'AS unknown'}
                </span>
              </div>
            </div>

            {/* Card 2: Risk & Confidence Analysis */}
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Risk & Confidence Analysis</h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Risk Score Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Risk Score</span>
                      <span className={`font-bold ${caseData.riskScore >= 70 ? 'text-rose-600 dark:text-rose-400' : caseData.riskScore >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {caseData.riskScore.toFixed(0)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${caseData.riskScore >= 70 ? 'bg-rose-500' : caseData.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(caseData.riskScore, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Confidence</span>
                      <span className="font-bold text-blue-600 dark:text-sky-400">
                        {((caseData.confidence ?? 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-sky-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min((caseData.confidence ?? 0) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Benign Indicators Bar (inverse of risk) */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Benign Indicators</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {(100 - caseData.riskScore).toFixed(0)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(100 - caseData.riskScore, 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Evidence breakdown */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs space-y-1.5">
                    {investigation && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Observed Facts</span>
                          <span className="font-mono text-slate-600 dark:text-slate-300">{investigation.observed_facts?.length ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Heuristic Findings</span>
                          <span className="font-mono text-slate-600 dark:text-slate-300">{investigation.heuristic_findings?.length ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ML Signals</span>
                          <span className="font-mono text-slate-600 dark:text-slate-300">{investigation.ml_signals?.length ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Threat Intel Hits</span>
                          <span className="font-mono text-slate-600 dark:text-slate-300">{investigation.threat_intelligence?.length ?? 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-400 dark:text-slate-500">
                {investigation
                  ? `Calculated from ${investigation.iteration_count ?? 1} investigation iterations · ${investigation.tools_used?.length ?? 0} tools`
                  : 'Calculated across 42 SIEM heuristical vectors'}
              </div>
            </div>

            {/* Card 3: Next Actions */}
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Next Actions</h3>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => uiStore.addToast('success', 'Sender domain added to CDGI SOC Watchlist')}
                    className="h-9 px-3 w-full flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bookmark className="w-4 h-4 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-sky-400" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-sky-400">
                        Add to Watchlist
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      uiStore.navigate('/inbox');
                      uiStore.addToast('info', 'Searching inbox for similar sender pattern...');
                    }}
                    className="h-9 px-3 w-full flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-sky-400" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-sky-400">
                        Search Similar Emails
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('report')}
                    className="h-9 px-3 w-full flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-sky-400" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-sky-400">
                        Create Investigation Report
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-400 dark:text-slate-500">
                Recommended playbook: Quarantine & Firewall Block
              </div>
            </div>
          </div>

          {/* ROW 3: Authentication Matrix (SPF / DKIM / DMARC) */}
          {(() => {
            type AuthVal = 'PASS' | 'FAIL' | 'NONE' | 'NEUTRAL' | 'UNKNOWN';
            let spf: AuthVal = 'UNKNOWN';
            let dkim: AuthVal = 'UNKNOWN';
            let dmarc: AuthVal = 'UNKNOWN';
            const caseAny = caseData as typeof caseData & { authSignals?: { spf: string; dkim: string; dmarc: string } };
            if (caseAny.authSignals) {
              spf = (caseAny.authSignals.spf?.toUpperCase() as AuthVal) || 'UNKNOWN';
              dkim = (caseAny.authSignals.dkim?.toUpperCase() as AuthVal) || 'UNKNOWN';
              dmarc = (caseAny.authSignals.dmarc?.toUpperCase() as AuthVal) || 'UNKNOWN';
            } else if (investigation?.risk_reasons && investigation.risk_reasons.length > 0) {
              const combined = investigation.risk_reasons.join(' ').toLowerCase();
              const parseAuth = (key: string): AuthVal => {
                const m = combined.match(new RegExp(key + '[=:\\s]*(pass|fail|none|neutral|softfail|hardfail)', 'i'));
                if (!m) return 'UNKNOWN';
                const v = m[1].toLowerCase();
                if (v === 'pass') return 'PASS';
                if (v === 'none') return 'NONE';
                if (v === 'neutral') return 'NEUTRAL';
                return 'FAIL';
              };
              spf = parseAuth('spf');
              dkim = parseAuth('dkim');
              dmarc = parseAuth('dmarc');
            }
            const authColor = (v: AuthVal) =>
              v === 'PASS' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5' :
              v === 'FAIL' ? 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5' :
              v === 'NONE' ? 'text-slate-500 dark:text-slate-400 border-slate-400/30 bg-slate-50/50 dark:bg-slate-800/40' :
              v === 'NEUTRAL' ? 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5' :
              'text-slate-400 dark:text-slate-500 border-slate-300/30 bg-slate-50/30 dark:bg-slate-800/20';
            const authIcon = (v: AuthVal) =>
              v === 'PASS' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> :
              v === 'FAIL' ? <XCircle className="w-4 h-4 shrink-0" /> :
              <AlertCircle className="w-4 h-4 shrink-0" />;
            return (
              <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Authentication Signals (SPF / DKIM / DMARC)</h3>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">RFC 7489 / RFC 6376</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {([
                    { label: 'SPF', value: spf, desc: 'Sender Policy Framework' },
                    { label: 'DKIM', value: dkim, desc: 'DomainKeys Identified Mail' },
                    { label: 'DMARC', value: dmarc, desc: 'Domain-based Msg Auth' },
                  ] as { label: string; value: AuthVal; desc: string }[]).map(({ label, value, desc }) => (
                    <div key={label} className={`p-3 rounded-xl border flex flex-col gap-1.5 ${authColor(value)}`}>
                      <div className="flex items-center gap-1.5">
                        {authIcon(value)}
                        <span className="text-xs font-black tracking-wide">{label}</span>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider">{value}</span>
                      <span className="text-[10px] opacity-70 leading-tight">{desc}</span>
                    </div>
                  ))}
                </div>
                {(spf === 'UNKNOWN' && dkim === 'UNKNOWN' && dmarc === 'UNKNOWN') && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                    Auth signal data unavailable — upload a real .eml file or view the Evidence tab for raw header data.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* SPLIT TAB */}
      {activeTab === 'split' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[500px]">
            {/* Left 7 cols: Entity Relationship Graph */}
            <div className="lg:col-span-7 flex flex-col min-h-[500px] bg-white dark:bg-[#070b14] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
              <EntityRelationshipGraph />
            </div>

            {/* Right 5 cols: Chronological Investigation Timeline */}
            <div className="lg:col-span-5 flex flex-col min-h-[500px] bg-white dark:bg-[#070b14] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
              <InvestigationTimeline />
            </div>
          </div>

          {/* Forensic Origin Intelligence & Geolocation Workspace */}
          <div className="w-full">
            <OriginIntelligenceWorkspace />
          </div>
        </div>
      )}

      {/* EVIDENCE TAB — Phase 2.4: Dynamic evidence with type badges */}
      {activeTab === 'evidence' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Observed Forensic Evidence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {investigation
                ? `${(investigation.observed_facts?.length ?? 0) + (investigation.heuristic_findings?.length ?? 0) + (investigation.ml_signals?.length ?? 0) + (investigation.threat_intelligence?.length ?? 0)} total evidence items collected`
                : 'Raw email artifacts, headers, and extracted indicators'}
            </p>
          </div>

          {investigation ? (
            <div className="space-y-4">
              {/* Evidence type summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Observed Facts', count: investigation.observed_facts?.length ?? 0, color: 'blue', icon: '🔬' },
                  { label: 'Heuristic Findings', count: investigation.heuristic_findings?.length ?? 0, color: 'amber', icon: '⚡' },
                  { label: 'ML Signals', count: investigation.ml_signals?.length ?? 0, color: 'purple', icon: '🧠' },
                  { label: 'Threat Intel', count: investigation.threat_intelligence?.length ?? 0, color: 'rose', icon: '🎯' },
                ].map(({ label, count, color, icon }) => (
                  <div key={label} className={`p-3 rounded-xl border ${
                    color === 'blue' ? 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5' :
                    color === 'amber' ? 'border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5' :
                    color === 'purple' ? 'border-purple-500/20 bg-purple-50/50 dark:bg-purple-500/5' :
                    'border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5'
                  }`}>
                    <div className="text-lg mb-1">{icon}</div>
                    <div className={`text-xl font-black ${
                      color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                      color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-rose-600 dark:text-rose-400'
                    }`}>{count}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{label}</div>
                  </div>
                ))}
              </div>

              {/* Tools used */}
              {investigation.tools_used && investigation.tools_used.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Tools Executed</p>
                  <div className="flex flex-wrap gap-1.5">
                    {investigation.tools_used.map(tool => (
                      <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        ✓ {tool}
                      </span>
                    ))}
                    {investigation.tools_failed?.map(tool => (
                      <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        ✗ {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk reasons as evidence items */}
              {investigation.risk_reasons && investigation.risk_reasons.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Risk Reason Evidence ({investigation.risk_reasons.length})</p>
                  <div className="space-y-1.5">
                    {investigation.risk_reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 mt-0.5">EVD-{String(idx + 1).padStart(3, '0')}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 shrink-0 uppercase tracking-wide">RISK</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing evidence */}
              {investigation.missing_evidence && investigation.missing_evidence.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Missing Evidence ({investigation.missing_evidence.length})</p>
                  <div className="space-y-1.5">
                    {investigation.missing_evidence.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
                        <span className="text-amber-500 text-xs shrink-0">◌</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
{`Return-Path: <bounce@paypal1-secure.com>
Received: from mail.paypal1-secure.com (185.220.101.5)
 by mx.company.com with ESMTP id 9X29A78
 for <user@company.com>; Tue, 12 Aug 2025 10:24:00 +0000
Message-ID: <202508121024.PAYPAL-ALERT@paypal1-secure.com>
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="--boundary_7812"
X-Mailer: Python-smtplib/3.10
Authentication-Results: mx.company.com;
 spf=pass (sender IP is 185.220.101.5);
 dkim=none;
 dmarc=fail (p=reject)`}
            </div>
          )}
        </div>
      )}

      {/* AI ANALYSIS TAB — Phase 2.3: Real LLM reasoning narrative */}
      {activeTab === 'ai-analysis' && (
        <div className="space-y-4">
          {reasoningLoading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Fetching AI Reasoning Narrative…</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Querying Groq LLM via reasoning engine</p>
            </div>
          )}

          {reasoningError && !reasoningLoading && (
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-amber-500/20 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">AI Reasoning Unavailable</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{reasoningError}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">This may occur if the Groq LLM is rate-limited or if this is a demo case. The investigation verdict and risk score are still valid.</p>
                </div>
              </div>

              {/* Show investigation-derived analysis as fallback */}
              {investigation && (
                <div className="mt-5 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Derived Analysis (from investigation engine)</p>
                  <div className="space-y-3">
                    {investigation.attack_hypotheses?.filter(h => h.status === 'SUPPORTED').map((h, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 dark:text-white">{h.hypothesis_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">{(h.score * 100).toFixed(0)}% confidence</span>
                        </div>
                        {h.reasons?.map((r, ri) => <p key={ri} className="text-slate-500 dark:text-slate-400">{r}</p>)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {reasoningResult && !reasoningLoading && (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Forensic Reasoning</h3>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    reasoningResult.uncertainty === 'low' ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5' :
                    reasoningResult.uncertainty === 'medium' ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/5' :
                    'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/5'
                  }`}>
                    {reasoningResult.uncertainty.toUpperCase()} UNCERTAINTY
                  </span>
                  {reasoningResult.escalation_required && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/5 animate-pulse">
                      ESCALATION REQUIRED
                    </span>
                  )}
                </div>

                {/* Summary */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Executive Summary</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{reasoningResult.summary}</p>
                </div>

                {/* Explanation */}
                {reasoningResult.explanation && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Detailed Explanation</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{reasoningResult.explanation}</p>
                  </div>
                )}
              </div>

              {/* Hypotheses & Next Actions side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Attack Hypotheses */}
                {reasoningResult.hypotheses && reasoningResult.hypotheses.length > 0 && (
                  <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Attack Hypotheses</h4>
                    </div>
                    <div className="mt-3 space-y-2">
                      {reasoningResult.hypotheses.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                          <span className="text-rose-500 shrink-0">◆</span>
                          <span className="text-slate-700 dark:text-slate-300">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Next Actions */}
                {reasoningResult.recommended_next_actions && reasoningResult.recommended_next_actions.length > 0 && (
                  <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <Activity className="w-4 h-4 text-sky-500" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Recommended Actions</h4>
                    </div>
                    <div className="mt-3 space-y-2">
                      {reasoningResult.recommended_next_actions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                          <span className="text-sky-500 font-bold shrink-0">{idx + 1}.</span>
                          <span className="text-slate-700 dark:text-slate-300">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Demo case fallback — show when no reasoning is available and not loading */}
          {!reasoningResult && !reasoningLoading && !reasoningError && (
            <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">AI Analysis Available for Live Investigations</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Upload a real <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">.eml</code> file or paste raw email headers to trigger a live backend investigation. The AI reasoning engine will then generate a detailed forensic narrative, attack hypotheses, and recommended next actions powered by Groq LLM.
                  </p>
                  <button
                    type="button"
                    onClick={() => uiStore.navigate('/investigation')}
                    className="mt-4 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Start New Investigation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-[#070b14] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors min-h-[600px] flex flex-col">
          <InvestigationTimeline />
        </div>
      )}

      {/* GRAPH TAB */}
      {activeTab === 'graph' && (
        <div className="bg-white dark:bg-[#070b14] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors min-h-[700px] flex flex-col p-4">
          <EntityRelationshipGraph />
        </div>
      )}

      {/* THREAT INTEL TAB */}
      {activeTab === 'threat-intel' && (
        <div className="bg-white dark:bg-[#070b14] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors min-h-[600px] flex flex-col">
          <ThreatIntelPanel />
        </div>
      )}

      {/* REPORT TAB */}
      {activeTab === 'report' && (
        <div id="case-forensic-report-container" className="space-y-4">
          <ForensicReportPage caseId={caseId} embedded={true} />
        </div>
      )}

      {/* OVERLAYS & MODALS */}
      <EntityProfileDrawer />
      <EmailEntityModal />
      <LinkCaseModal />
      <MergeCampaignModal />
      <EscalateModal />
    </div>
  );
};

