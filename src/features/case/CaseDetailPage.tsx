import React, { useState, useMemo } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
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

export const CaseDetailPage: React.FC = () => {
  const ui = useUI();
  const caseId = ui.activeCaseId || 'A2291';
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
    | 'summary'
    | 'findings'
    | 'journey'
    | 'evidence'
    | 'headers'
    | 'body'
    | 'urls'
    | 'attachments'
    | 'geolocation'
    | 'history'
    | 'report';

  const [activeTab, setActiveTab] = useState<DetailTab>('summary');
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
                  Malicious
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
                  <span className="text-slate-700 dark:text-slate-300">12 Aug 2025, 10:24 AM</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Source: </span>
                  <span className="text-slate-700 dark:text-slate-300">Uploaded (.eml)</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Investigation ID: </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">INV-7823</span>
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

      {/* 2. TAB NAVIGATION BAR matching screenshot */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 sm:gap-7 text-xs font-medium select-none overflow-x-auto no-scrollbar pt-1 print:hidden">
        {[
          { id: 'summary', label: 'Summary' },
          { id: 'findings', label: 'Findings' },
          { id: 'journey', label: 'Investigation Journey' },
          { id: 'evidence', label: 'Evidence (6)' },
          { id: 'headers', label: 'Headers' },
          { id: 'body', label: 'Body & Content' },
          { id: 'urls', label: 'URLs (3)' },
          { id: 'attachments', label: 'Attachments (1)' },
          { id: 'geolocation', label: 'Geolocation' },
          { id: 'history', label: 'Historical Context (3)' },
          { id: 'report', label: 'Report' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as DetailTab)}
            className={`pb-3 whitespace-nowrap transition-colors relative cursor-pointer font-semibold ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-sky-400 border-b-2 border-blue-600 dark:border-sky-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. ACTIVE TAB CONTENT */}
      {activeTab === 'summary' && (
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

      {/* 4. FINDINGS TAB */}
      {activeTab === 'findings' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Comprehensive Forensic Findings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Autonomous evaluation results across RFC 822 headers, domains, and network indicators</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
              Verdict: MALICIOUS (Risk 87/100)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Finding 1 */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-slate-50 dark:bg-[#090e1c] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Domain Typosquatting & Impersonation
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono">CRITICAL</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The sender domain <code className="text-rose-600 dark:text-rose-400 bg-white dark:bg-[#090e1a] px-1 rounded border border-rose-500/20">paypal1-secure.com</code> uses deceptive string concatenation mimicking PayPal Inc. Registered only 4 hours prior via an anonymous registrar in Panama.
              </p>
            </div>

            {/* Finding 2 */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-slate-50 dark:bg-[#090e1c] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Credential Harvesting Hyperlink
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono">CRITICAL</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Extracted URL <code className="text-rose-600 dark:text-rose-400 bg-white dark:bg-[#090e1a] px-1 rounded border border-rose-500/20">https://paypal1-secure.com/invoice</code> loads an unauthenticated fake login form requesting payment card details and SSN.
              </p>
            </div>

            {/* Finding 3 */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-slate-50 dark:bg-[#090e1c] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Cryptographic Authentication Discrepancy
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-transparent border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono">WARNING</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                DKIM signature is absent. While SPF passed against the malicious disposable host, DMARC alignment failed against official PayPal authentication policy (p=reject).
              </p>
            </div>

            {/* Finding 4 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090e1a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  Anonymized Routing Relay
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">EVIDENCE</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Origin relay IP <code className="text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0c1322] px-1 rounded">185.220.101.5</code> is a known active Tor Exit Node in Frankfurt, Germany (AS205100).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. INVESTIGATION JOURNEY TAB */}
      {activeTab === 'journey' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Autonomous Investigation Journey</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Node-by-node execution trace of the multi-stage adaptive forensic loop</p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-blue-200 dark:before:bg-blue-900/60">
            {/* Step 1 */}
            <div className="relative flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-sky-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-50 dark:ring-blue-950/60 shrink-0">
                1
              </div>
              <div className="bg-slate-50 dark:bg-[#090e1a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Ingestion & RFC 822 Header Parsing</span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">18ms</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Extracted MIME structures, decoded base64 payload, and hashed full email payload with SHA-256.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-sky-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-50 dark:ring-blue-950/60 shrink-0">
                2
              </div>
              <div className="bg-slate-50 dark:bg-[#090e1a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Authentication Protocol Verification</span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">142ms</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Resolved DNS TXT records for SPF, checked DKIM public keys, and evaluated DMARC policy. Detected alignment failure.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <div className="bg-slate-50 dark:bg-[#090e1c] p-4 rounded-xl border border-rose-500/30 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">URL Canonicalization & Threat Feed Cross-Match</span>
                  <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400">310ms</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Discovered lookalike token in host part. Target flagged in antiphishing feeds as credential harvester.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                4
              </div>
              <div className="bg-slate-50 dark:bg-[#090e1a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Final Verdict & Confidence Threshold Reached</span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">Total: 1840ms</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Confidence score achieved 0.87 (target: 0.80). Investigation halted with final recommendation: <strong className="text-rose-600 dark:text-rose-400">QUARANTINE</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. EVIDENCE TAB */}
      {activeTab === 'evidence' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Court-Admissible Evidence Atoms (6)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographically verifiable hashes and forensic chain of custody</p>
            </div>
            <button
              type="button"
              onClick={() => uiStore.addToast('success', 'Evidence bundle verified against tamper registry.')}
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Verify Hashes
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'EVD-DOM-01',
                type: 'Domain Lookalike',
                val: 'paypal1-secure.com',
                sha: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              },
              {
                id: 'EVD-URL-01',
                type: 'Malicious URL',
                val: 'https://paypal1-secure.com/invoice',
                sha: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
              },
              {
                id: 'EVD-IP-01',
                type: 'Tor Exit Origin',
                val: '185.220.101.5:443',
                sha: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
              },
              {
                id: 'EVD-SPF-01',
                type: 'DNS SPF Record',
                val: 'v=spf1 ip4:185.220.101.0/24 -all',
                sha: '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf093400e1a2',
              },
              {
                id: 'EVD-HDR-01',
                type: 'Raw RFC 822 Header Block',
                val: 'Message-ID: <202508121024.PAYPAL-ALERT@paypal1-secure.com>',
                sha: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
              },
              {
                id: 'EVD-TXT-01',
                type: 'NLP Threat Intent Vector',
                val: 'Urgent Action Required (0.912 Score)',
                sha: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
              },
            ].map((evd) => (
              <div key={evd.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#090e1a] flex items-center justify-between text-xs transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{evd.id}</span>
                    <span className="px-2 py-0.5 rounded bg-transparent border border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold text-[10px]">
                      {evd.type}
                    </span>
                  </div>
                  <p className="font-mono text-slate-700 dark:text-slate-300 font-medium">{evd.val}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">SHA-256: {evd.sha}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(evd.sha);
                    uiStore.addToast('info', `Copied hash for ${evd.id}`);
                  }}
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Copy SHA-256"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. HEADERS TAB */}
      {activeTab === 'headers' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Full RFC 822 Email Headers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Complete raw network transport metadata</p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`Received: from mail.paypal1-secure.com (185.220.101.5) by mx.company.com; Tue, 12 Aug 2025 10:24:00 +0000\nFrom: "PayPal Support" <support@paypal1-secure.com>\nTo: <user@company.com>\nSubject: Invoice Payment Update - Action Required\nDate: Tue, 12 Aug 2025 10:24:00 +0000\nMessage-ID: <202508121024.PAYPAL-ALERT@paypal1-secure.com>\nReturn-Path: <bounce@paypal1-secure.com>\nAuthentication-Results: mx.company.com; spf=pass (ip 185.220.101.5); dkim=none; dmarc=fail (p=reject)\nX-Priority: 1 (Highest)\nX-Mailer: Python-smtplib/3.10`);
                uiStore.addToast('success', 'Copied raw RFC 822 headers to clipboard');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Headers</span>
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { key: 'Delivered-To', value: 'user@company.com' },
              { key: 'Received', value: 'from mail.paypal1-secure.com (185.220.101.5) by mx.company.com with ESMTP id 9X29A78 for <user@company.com>; Tue, 12 Aug 2025 10:24:00 +0000' },
              { key: 'Return-Path', value: '<bounce@paypal1-secure.com>' },
              { key: 'From', value: '"PayPal Support" <support@paypal1-secure.com>' },
              { key: 'To', value: '<user@company.com>' },
              { key: 'Subject', value: 'Invoice Payment Update - Action Required' },
              { key: 'Date', value: 'Tue, 12 Aug 2025 10:24:00 +0000' },
              { key: 'Message-ID', value: '<202508121024.PAYPAL-ALERT@paypal1-secure.com>' },
              { key: 'Authentication-Results', value: 'mx.company.com; spf=pass smtp.mailfrom=paypal1-secure.com; dkim=none; dmarc=fail (p=reject)' },
              { key: 'X-Mailer', value: 'Python-smtplib/3.10' },
              { key: 'X-Spam-Score', value: '8.7 (HIGH)' },
            ].map((hdr, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 min-w-[160px] shrink-0">{hdr.key}:</span>
                <span className="text-slate-600 dark:text-slate-300 break-all">{hdr.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. BODY & CONTENT TAB */}
      {activeTab === 'body' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Decoded Body & Content</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Extracted plaintext and sanitized HTML representations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Plaintext Output</span>
              <pre className="text-xs font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
{`Dear customer,

We detected an unusual transaction of $349.00 USD on your account. If you did not authorize this charge, please review and cancel the invoice immediately:

View Invoice: https://paypal1-secure.com/invoice

PayPal Fraud Dept.`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">NLP Linguistics Analysis</span>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span>Urgency Score:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">92 / 100 (Extremely High)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span>Sentiment:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Coercive / Threatening</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span>Grammar Discrepancies:</span>
                  <span>Missing comma, generic greeting</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Target Currency:</span>
                  <span className="font-mono">USD ($349.00)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. URLS TAB */}
      {activeTab === 'urls' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Extracted URLs (3)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">All hyperlinks discovered inside HTML and plaintext parts</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                url: 'https://paypal1-secure.com/invoice',
                status: 'Malicious',
                category: 'Credential Phishing',
                ip: '185.220.101.5',
                registrar: 'Panama Privacy Protect',
                risk: '98/100',
              },
              {
                url: 'https://www.paypal.com/legal/privacy',
                status: 'Benign',
                category: 'Legitimate Domain (Lure Decorator)',
                ip: '151.101.65.140',
                registrar: 'PayPal Inc.',
                risk: '2/100',
              },
              {
                url: 'https://fonts.googleapis.com/css2?family=PayPal+Sans',
                status: 'Benign',
                category: 'Google Font CDN',
                ip: '142.250.190.42',
                registrar: 'Google LLC',
                risk: '0/100',
              },
            ].map((u, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#090e1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">{u.url}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status === 'Malicious' ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {u.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Category: {u.category} • IP: {u.ip} • Registrar: {u.registrar}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Risk: {u.risk}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(u.url);
                      uiStore.addToast('info', 'URL copied');
                    }}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. ATTACHMENTS TAB */}
      {activeTab === 'attachments' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">File Attachments (1)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Extracted binary attachments and malware static inspection</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#090e1a] flex items-center justify-between text-xs transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#0c1322] border border-transparent flex items-center justify-center text-slate-800 dark:text-white">
                <Paperclip className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">invoice.pdf</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Size: 42.4 KB • MIME: application/pdf • VirusTotal: 0/72 Clean</p>
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">SHA-256: d2a84f6e3c...71b4e9</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => uiStore.addToast('info', 'Attachment static sandbox verdict: No embedded JS / Macros')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Sandbox Report
            </button>
          </div>
        </div>
      )}

      {/* 11. GEOLOCATION TAB */}
      {activeTab === 'geolocation' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800/70 pb-3 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Network Geolocation & Route Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Visual mapping of autonomous trace routes and autonomous system (AS) numbers</p>
            </div>
            
            <div className="flex items-center gap-2">
              {isPointerMode && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mr-1">COLOR:</span>
                  {(['red', 'amber', 'emerald', 'blue'] as const).map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedPinColor(color)}
                      className={`w-4 h-4 rounded-full border-2 ${selectedPinColor === color ? 'border-slate-500 dark:border-slate-300 scale-110' : 'border-transparent opacity-70 hover:opacity-100'} transition-all cursor-pointer`}
                      style={{
                        backgroundColor: color === 'red' ? '#f43f5e' : color === 'amber' ? '#f59e0b' : color === 'emerald' ? '#10b981' : '#3b82f6'
                      }}
                      title={`Drop ${color} pin`}
                    />
                  ))}
                  <button 
                    onClick={() => setCustomPins([])}
                    className="ml-2 text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    CLEAR
                  </button>
                </div>
              )}
              <button
                onClick={() => setIsPointerMode(!isPointerMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  isPointerMode 
                    ? 'bg-slate-100 dark:bg-slate-800 border-blue-500/50 text-blue-600 dark:text-sky-400' 
                    : 'bg-white dark:bg-[#0c1322] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {isPointerMode ? 'Done' : 'Add Pins'}
              </button>
            </div>
          </div>
          <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
            {isPointerMode && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-slate-900/80 text-white text-[10px] font-bold rounded-full backdrop-blur-sm pointer-events-none">
                Click anywhere on the map to drop a pin
              </div>
            )}
            <GeospatialMap
              nodes={caseMapNodes}
              routes={caseMapRoutes}
              initialCenter={[56.1684, 25.5463]}
              initialZoom={1.5}
              className={`w-full h-full ${isPointerMode ? 'cursor-crosshair' : ''}`}
              onMapClick={(lngLat) => {
                if (isPointerMode) {
                  setCustomPins(prev => [...prev, {
                    id: `custom-pin-${Date.now()}`,
                    lng: lngLat.lng,
                    lat: lngLat.lat,
                    color: selectedPinColor
                  }]);
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090e1a] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Origin Sender</h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Bengaluru, India</span>
                </div>
              </div>
              <div className="text-xs space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <p>IP: <span className="font-mono font-semibold">103.21.244.88</span></p>
                <p>ASN: <span className="font-mono">AS13335 (Cloudflare Inc.)</span></p>
                <p>Latency: <span className="font-mono text-emerald-600 dark:text-emerald-400">42ms</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090e1a] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇸🇬</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Intermediate Relay</h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Jurong East, Singapore</span>
                </div>
              </div>
              <div className="text-xs space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <p>IP: <span className="font-mono font-semibold">45.117.12.34</span></p>
                <p>ASN: <span className="font-mono">AS45899 (VNPT Corp)</span></p>
                <p>Latency: <span className="font-mono text-emerald-600 dark:text-emerald-400">89ms</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090e1a] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇩🇪</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Tor Exit & Final Egress</h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Frankfurt, Germany</span>
                </div>
              </div>
              <div className="text-xs space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <p>IP: <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">185.220.101.5</span></p>
                <p>ASN: <span className="font-mono">AS205100 (Tor Exit Node)</span></p>
                <p>Latency: <span className="font-mono text-amber-600 dark:text-amber-400">184ms</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. HISTORICAL CONTEXT TAB */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800/70 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Historical Threat Correlations (3)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Related cluster signatures and past campaign attacks in the CDGI SOC repository</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090e1a] hover:border-blue-400 dark:hover:border-sky-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Campaign: "Invoice-Phish-Wave-DE"</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">96% Similarity</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Shares identical German Tor Exit relay (185.220.101.5) and registrar profile observed on 11 Aug 2025.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090e1a] hover:border-blue-400 dark:hover:border-sky-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Cluster: "Lookalike Financial Brands"</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">88% Similarity</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Domain naming syntax matches previous attacks mimicking Wells Fargo and Bank of America.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090e1a] hover:border-blue-400 dark:hover:border-sky-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Target Correlation: "Finance & Accounting Sector"</span>
                <span className="text-blue-600 dark:text-sky-400 font-bold">81% Similarity</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Recipients across 4 different corporate mailboxes received duplicate invoice lure variations within 1 hour.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 13. REPORT TAB */}
      {activeTab === 'report' && (
        <div id="case-forensic-report-container" className="space-y-4">
          <ForensicReportPage caseId={caseId} embedded={true} />
        </div>
      )}
    </div>
  );
};
