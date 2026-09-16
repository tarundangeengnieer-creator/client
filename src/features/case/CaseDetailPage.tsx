import React, { useState, useMemo, useEffect } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { investigatorStore } from '../../stores/investigator-store.ts';
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
  const caseId = ui.activeCaseId || 'A2291';

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
    verdict: 'MALICIOUS',
    riskScore: 87.0,
    confidence: 0.87,
    originIp: '185.220.101.5',
    originCountry: 'Germany',
    primaryIoc: 'paypal1-secure.com/invoice',
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
    | 'geolocation';

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [threatPreviewMode, setThreatPreviewMode] = useState<'rendered' | 'text' | 'raw'>('rendered');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isReinvestigating, setIsReinvestigating] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

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

  const caseMapNodes = useMemo(() => {
    const hops = [
      { id: 'hop-in', lng: 77.5946, lat: 12.9716, flag: '🇮🇳' },
      { id: 'hop-sg', lng: 103.7423, lat: 1.3321, flag: '🇸🇬' },
      { id: 'hop-de', lng: 8.6821, lat: 50.1109, flag: '🇩🇪' },
    ];
    
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
      // Tailwind border colors for our 4 categories
      const colorMap = {
        red: 'border-rose-500 bg-rose-500/20 text-rose-500',
        amber: 'border-amber-500 bg-amber-500/20 text-amber-500',
        emerald: 'border-emerald-500 bg-emerald-500/20 text-emerald-500',
        blue: 'border-blue-500 bg-blue-500/20 text-blue-500'
      };
      const colorClasses = colorMap[pin.color as keyof typeof colorMap] || colorMap.red;
      el.className = `flex items-center justify-center w-6 h-6 rounded-full border-[2.5px] ${colorClasses} shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-110 transition-all backdrop-blur-sm`;
      
      // Add a little inner dot
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
  }, [customPins]);

  const caseMapRoutes = useMemo(() => {
    return [
      {
        id: 'route-1',
        coordinates: [
          [77.5946, 12.9716],
          [103.7423, 1.3321],
          [8.6821, 50.1109]
        ] as [number, number][],
        color: '#f43f5e',
        width: 3,
        dashed: true
      }
    ];
  }, []);

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
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Case #{caseData.id}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-semibold">
                  {caseData.verdict}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full bg-transparent border text-[11px] font-semibold ${caseData.riskScore >= 80 ? 'border-rose-500/30 text-rose-600 dark:text-rose-400' : 'border-amber-500/30 text-amber-600 dark:text-amber-400'}`}>
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
                  <span className="text-slate-700 dark:text-slate-300">{new Date(caseData.timestamp).toLocaleString()}</span>
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-[#0e1627] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReinvestigating ? 'animate-spin text-blue-600' : ''}`} />
              <span>Re-investigate</span>
            </button>

            <button
              type="button"
              id="btn-download-report-pdf"
              onClick={handleDownloadMainReport}
              disabled={isDownloadingPdf}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 cursor-pointer disabled:opacity-60"
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
            {tab.label}
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
                  This email is likely a phishing attempt impersonating PayPal. It contains a suspicious link leading to a lookalike domain and uses deceptive language to create urgency.
                </p>

                {/* Key Threat Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090e1c] border border-rose-500/30 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Key Threat: <span className="text-rose-600 dark:text-rose-400">Impersonation + Credential Theft</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                      Targeted credentials harvester mimicking official PayPal payment dispute workflow.
                    </p>
                  </div>
                </div>

                {/* Attack Metadata List */}
                <div className="pt-2 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800/70">
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Attack Type:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Phishing</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Threat Actors:</span>
                    <span className="text-slate-700 dark:text-slate-300">Likely Financial Phishing Group</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Targeted Entity:</span>
                    <span className="text-slate-700 dark:text-slate-300">PayPal (Impersonation)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Language:</span>
                    <span className="text-slate-700 dark:text-slate-300">English</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                    <span className="text-slate-400 dark:text-slate-500">Attachments:</span>
                    <span className="text-slate-700 dark:text-slate-300">1 (invoice.pdf)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 dark:text-slate-500">URLs:</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">3 (1 malicious)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Investigation Engine: ASH-Adaptive v3.2</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">8 Tools Executed</span>
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
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">6 Items</span>
                </div>

                {/* 6 Key Findings */}
                <div className="space-y-3 mt-3">
                  {/* 1. Suspicious Domain */}
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

                  {/* 2. Lookalike Brand */}
                  <div className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Lookalike Brand</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Impersonates PayPal brand headers</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-transparent border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                      Warning
                    </span>
                  </div>

                  {/* 3. SPF Check */}
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

                  {/* 4. DKIM Check */}
                  <div className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">DKIM Check</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Not found (Missing cryptographic signature)</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-transparent border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                      Warning
                    </span>
                  </div>

                  {/* 5. Suspicious URL */}
                  <div className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Suspicious URL</p>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium truncate">1 malicious URL detected in body</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold text-[10px]">
                      Malicious
                    </span>
                  </div>

                  {/* 6. Attachment Scan */}
                  <div className="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Attachment Scan</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">No malware detected (0 payload files)</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-transparent border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                      Success
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('findings')}
                className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span>View All Findings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
                <div className="mt-3 flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setThreatPreviewMode('rendered')}
                    className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${
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
                    className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${
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
                    className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${
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
                    <div className="space-y-1 pb-2.5 border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
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

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Dear customer, We detected an unusual transaction of $349.00 USD on your account. If you did not authorize this, please review and cancel the invoice immediately.
                      </p>

                      {/* Phishing Call to Action */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => uiStore.addToast('warning', 'Live click intercepted: URL points to phishing harvester!')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          View Invoice
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                        PayPal Pte. Ltd. All rights reserved.
                      </p>
                    </div>
                  </div>
                )}

                {threatPreviewMode === 'text' && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
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
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] overflow-x-auto max-h-48 border border-slate-800">
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
                    <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
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
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
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

                {/* Route diagram matching Image 1 */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2 text-center">
                    {/* Node 1: Sender */}
                    <div className="flex-1 min-w-0">
                      <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs mb-1.5">
                        🇮🇳
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sender IP</span>
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">103.21.244.88</p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">India</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    {/* Node 2: Relay */}
                    <div className="flex-1 min-w-0">
                      <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs mb-1.5">
                        🇸🇬
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Relay</span>
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">45.117.12.34</p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Singapore</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    {/* Node 3: Destination */}
                    <div className="flex-1 min-w-0">
                      <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs mb-1.5">
                        🇩🇪
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">185.112.36.21</p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Germany</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Multi-hop proxy chain detected</span>
                <span className="text-rose-500 font-semibold font-mono">AS205100 (Tor)</span>
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
                  {/* Risk Indicators Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Risk Indicators</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">8 / 10</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: '80%' }} />
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Confidence</span>
                      <span className="font-bold text-blue-600 dark:text-sky-400">87%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 dark:bg-sky-400 rounded-full transition-all duration-500" style={{ width: '87%' }} />
                    </div>
                  </div>

                  {/* Benign Indicators Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Benign Indicators</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">2 / 10</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-[11px] text-slate-400 dark:text-slate-500">
                Calculated across 42 SIEM heuristical vectors
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
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
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
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
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
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-sky-400" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-sky-400">
                        Create Investigation Report
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-[11px] text-slate-400 dark:text-slate-500">
                Recommended playbook: Quarantine & Firewall Block
              </div>
            </div>
          </div>
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

      {/* EVIDENCE TAB */}
      {activeTab === 'evidence' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Observed Forensic Evidence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Raw email artifacts, headers, and extracted indicators</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
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
