import React, { useState } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { useAuth } from '../../stores/auth-store.ts';
import { casesStore } from '../../stores/cases-store.ts';
import { DynamicEmailVolumeGraph } from './DynamicEmailVolumeGraph.tsx';
import { ThreatWorldMap } from './ThreatWorldMap.tsx';
import { ThreatDistributionPieChart } from './ThreatDistributionPieChart.tsx';
import {
  Mail,
  ShieldAlert,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  MoreHorizontal,
  Send,
  Globe,
} from 'lucide-react';

export const SecurityOverviewPage: React.FC = () => {
  const auth = useAuth();
  const username = auth.currentUser?.name || 'Tarun Dange';
  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const [threatPeriod, setThreatPeriod] = useState<'24h' | '7d' | '14d' | '30d'>('30d');
  const [selectedGeoPeriod, setSelectedGeoPeriod] = useState('Last 30 days');
  const [selectedBrandPeriod, setSelectedBrandPeriod] = useState('Last 30 days');
  const [selectedTypePeriod, setSelectedTypePeriod] = useState('Last 30 days');

  const threatTimeframeData: Record<
    '24h' | '7d' | '14d' | '30d',
    {
      malicious: { count: number; pct: number };
      suspicious: { count: number; pct: number };
      benign: { count: number; pct: number };
      inconclusive: { count: number; pct: number };
      posture: string;
      postureColor: string;
      postureBg: string;
      postureBorder: string;
      note: string;
    }
  > = {
    '24h': {
      malicious: { count: 8, pct: 31 },
      suspicious: { count: 12, pct: 46 },
      benign: { count: 5, pct: 19 },
      inconclusive: { count: 1, pct: 4 },
      posture: 'Elevated',
      postureColor: 'text-rose-600',
      postureBg: 'bg-transparent',
      postureBorder: 'border-rose-500/30',
      note: 'Active credential-phishing lures detected during business hours today.',
    },
    '7d': {
      malicious: { count: 24, pct: 32 },
      suspicious: { count: 34, pct: 45 },
      benign: { count: 14, pct: 19 },
      inconclusive: { count: 3, pct: 4 },
      posture: 'Guarded',
      postureColor: 'text-amber-600',
      postureBg: 'bg-transparent',
      postureBorder: 'border-amber-500/30',
      note: 'Mid-week surge in deceptive banking notification emails contained.',
    },
    '14d': {
      malicious: { count: 35, pct: 33 },
      suspicious: { count: 48, pct: 45 },
      benign: { count: 18, pct: 17 },
      inconclusive: { count: 5, pct: 5 },
      posture: 'Elevated',
      postureColor: 'text-rose-600',
      postureBg: 'bg-transparent',
      postureBorder: 'border-rose-500/30',
      note: 'Most recent increase is associated with credential-phishing and malicious URL activity.',
    },
    '30d': {
      malicious: { count: 48, pct: 33 },
      suspicious: { count: 67, pct: 46 },
      benign: { count: 25, pct: 17 },
      inconclusive: { count: 6, pct: 4 },
      posture: 'Elevated',
      postureColor: 'text-rose-600',
      postureBg: 'bg-transparent',
      postureBorder: 'border-rose-500/30',
      note: '30-day baseline shows steady threat containment with 78% automated triage rate.',
    },
  };

  const activeThreats = threatTimeframeData[threatPeriod];

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Active chart hover index
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(4); // default Aug 14

  const trendData = [
    { label: 'Aug 01', value: 8, cases: 2 },
    { label: 'Aug 04', value: 14, cases: 4 },
    { label: 'Aug 07', value: 19, cases: 3 },
    { label: 'Aug 10', value: 22, cases: 5 },
    { label: 'Aug 13', value: 25, cases: 4 },
    { label: 'Aug 14', value: 32, cases: 7 },
    { label: 'Aug 16', value: 26, cases: 3 },
  ];

  const handleAiQuery = (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsAiLoading(false);
      const lower = queryText.toLowerCase();
      if (lower.includes('summarize') || lower.includes('recent')) {
        setAiResponse(
          '**Executive Threat Summary:** Over the past 48 hours, 5 high-priority cases were ingested. **Case #A2291** (PayPal lookalike with Tor relay) represents an active credential phishing attack targeting accounts. 2 cases were automatically isolated and 18 cases safely closed.'
        );
      } else if (lower.includes('domain') || lower.includes('block')) {
        setAiResponse(
          '**Active Blocked Domains & IoCs:**\n• `paypal1-secure.com` (Phishing Lookalike / IP 185.220.101.5)\n• `secure-login.net` (Credential Harvest)\n• `account-security.com` (Urgency Alert Lure)'
        );
      } else if (lower.includes('threat') || lower.includes('top')) {
        setAiResponse(
          '**Top Attack Vectors:**\n1. **Credential Phishing** (38 incidents / 40.4%)\n2. **Malicious URLs** (27 incidents / 28.7%)\n3. **Brand Impersonation** (19 incidents / 20.2%)\nPrimary target: Financial workflows & executive impersonation.'
        );
      } else {
        setAiResponse(
          `**Analysis for "${queryText}":** Found 3 correlated cases matching this signature in the CDGI SOC repository. Threat posture is Elevated. Origin IPs trace to Tor relay infrastructure in Germany and Russia.`
        );
      }
    }, 450);
  };

  const handleCaseClick = (caseId: string) => {
    uiStore.setActiveCase(caseId);
    uiStore.navigate(`/case/${caseId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Dynamic Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Active Operations Overview</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, {username}. Here is the real-time forensic snapshot.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            CDGI SOC Partition • Security Posture is{' '}
            <span className={`font-semibold ${activeThreats.postureColor}`}>
              {activeThreats.posture}
            </span>{' '}
            with 24 active cases under triage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-xs font-medium text-slate-600 dark:text-slate-400 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateFormatted}</span>
          </div>

          <button
            type="button"
            onClick={() => uiStore.navigate('/inbox')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 border border-white rounded-xs" />
            <span>Triage Queue</span>
            <span className="ml-1 px-1.5 py-0.2 bg-blue-700/60 dark:bg-sky-950/80 border border-sky-400/40 text-sky-200 rounded-full text-[10px] font-mono font-bold">
              24
            </span>
          </button>
        </div>
      </div>

      {/* 1. TOP 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 [&>*]:min-w-0">
        {/* Card 1: OPEN CASES */}
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c1322] border border-transparent flex items-center justify-center text-slate-800 dark:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-transparent border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +4 today
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              OPEN CASES
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">24</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active investigations</p>
          </div>
        </div>

        {/* Card 2: MALICIOUS */}
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c1322] border border-transparent flex items-center justify-center text-slate-800 dark:text-white transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              MALICIOUS
            </span>
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">08</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High-confidence threats</p>
          </div>
        </div>

        {/* Card 3: SUSPICIOUS */}
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c1322] border border-transparent flex items-center justify-center text-slate-800 dark:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              SUSPICIOUS
            </span>
            <div className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">11</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Requires analyst review</p>
          </div>
        </div>

        {/* Card 4: INVESTIGATING */}
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c1322] border border-transparent flex items-center justify-center text-slate-800 dark:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              INVESTIGATING
            </span>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-sky-400 mt-1">05</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adaptive analysis running</p>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 [&>*]:min-w-0">
        {/* Threat Distribution Pie Chart Card */}
        <ThreatDistributionPieChart
          threatPeriod={threatPeriod}
          onPeriodChange={setThreatPeriod}
          activeThreats={activeThreats}
        />

        {/* Dynamic Email Volume Trend Card */}
        <DynamicEmailVolumeGraph />
      </div>

      {/* 3. RECENT CASES & THREAT GEOLOCATION SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 [&>*]:min-w-0">
        {/* Left: Recent Cases Table Card */}
        <div className="xl:col-span-8 min-w-0 bg-white dark:bg-[#0c1322] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden flex flex-col justify-between transition-colors">
          <div>
            <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Cases</h3>
          </div>
          <button
            type="button"
            onClick={() => uiStore.navigate('/inbox')}
            className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-[#090e1a] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Row 1: A2291 */}
              <tr
                onClick={() => handleCaseClick('A2291')}
                className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">A2291</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                  Invoice Payment Update - Action Required
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">support@paypal1-secure.com</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Malicious</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-transparent border border-blue-500/30 text-blue-600 dark:text-sky-400 font-semibold text-[11px]">
                    Open
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">12 Aug 2025, 10:24</td>
                <td className="py-3.5 px-4 text-right text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  <MoreHorizontal className="w-4 h-4 ml-auto" />
                </td>
              </tr>

              {/* Row 2: A2290 */}
              <tr
                onClick={() => handleCaseClick('A2290')}
                className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">A2290</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                  Your Account Has Been Limited
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">service@account-security.com</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Suspicious</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-transparent border border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold text-[11px]">
                    Investigating
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">12 Aug 2025, 09:18</td>
                <td className="py-3.5 px-4 text-right text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  <MoreHorizontal className="w-4 h-4 ml-auto" />
                </td>
              </tr>

              {/* Row 3: A2289 */}
              <tr
                onClick={() => handleCaseClick('A2289')}
                className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">A2289</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                  Meeting Schedule for Next Week
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">hr@company.com</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Benign</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-transparent border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    Closed
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">12 Aug 2025, 08:41</td>
                <td className="py-3.5 px-4 text-right text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  <MoreHorizontal className="w-4 h-4 ml-auto" />
                </td>
              </tr>

              {/* Row 4: A2288 */}
              <tr
                onClick={() => handleCaseClick('A2288')}
                className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">A2288</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                  Re: Project Documents
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">tarun.dange@cdgi.edu.in</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span>Inconclusive</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-transparent border border-blue-500/30 text-blue-600 dark:text-sky-400 font-semibold text-[11px]">
                    Open
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">11 Aug 2025, 16:20</td>
                <td className="py-3.5 px-4 text-right text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  <MoreHorizontal className="w-4 h-4 ml-auto" />
                </td>
              </tr>

              {/* Row 5: A2287 */}
              <tr
                onClick={() => handleCaseClick('A2287')}
                className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">A2287</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                  Password Reset Request
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">no-reply@secure-login.net</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Malicious</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-transparent border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    Closed
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">11 Aug 2025, 14:03</td>
                <td className="py-3.5 px-4 text-right text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  <MoreHorizontal className="w-4 h-4 ml-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>

        {/* Right: Geolocation of Malicious Senders Card */}
        <div className="xl:col-span-4 min-w-0 bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Globe className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Geolocation of Malicious Senders</h3>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <span>{selectedGeoPeriod}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive World Map with Real Geographic Contours and Attack Hotspots */}
            <div className="my-3">
              <ThreatWorldMap />
            </div>

            {/* Country Statistics */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">United States</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-[#090e1a] rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 w-5 text-right">12</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Russia</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-[#090e1a] rounded-full overflow-hidden">
                    <div className="bg-rose-400 h-full rounded-full" style={{ width: '55%' }} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 w-5 text-right">7</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">India</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-[#090e1a] rounded-full overflow-hidden">
                    <div className="bg-rose-300 h-full rounded-full" style={{ width: '40%' }} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 w-5 text-right">5</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Germany</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-[#090e1a] rounded-full overflow-hidden">
                    <div className="bg-rose-300 h-full rounded-full" style={{ width: '32%' }} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 w-5 text-right">4</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Others</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-[#090e1a] rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 w-5 text-right">11</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM 3 COLUMNS: TOP THREAT TYPES, TOP TARGETED BRANDS, AI ASSISTANT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 [&>*]:min-w-0">
        {/* Card 1: Top Threat Types */}
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Top Threat Types</h3>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <span>{selectedTypePeriod}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 mt-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Credential Phishing</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">38</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Malicious URLs</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">27</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Impersonation</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">19</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Malware Attachments</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">11</span>
            </div>
          </div>
        </div>

        {/* Card 2: Top Targeted Brands */}
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Shield className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Top Targeted Brands</h3>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <span>{selectedBrandPeriod}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 mt-4 text-xs">
            {/* PayPal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-slate-100 dark:bg-[#0c1322] border border-sky-500/40 text-sky-500 dark:text-sky-400 font-black text-xs italic flex items-center justify-center">
                  P
                </div>
                <span className="font-medium text-slate-800 dark:text-slate-200">PayPal</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">28</span>
            </div>

            {/* Microsoft */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 grid grid-cols-2 gap-0.5 p-1 rounded bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
                  <div className="bg-rose-500 rounded-xs" />
                  <div className="bg-emerald-500 rounded-xs" />
                  <div className="bg-blue-500 rounded-xs" />
                  <div className="bg-amber-400 rounded-xs" />
                </div>
                <span className="font-medium text-slate-800 dark:text-slate-200">Microsoft</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">17</span>
            </div>

            {/* Google */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-xs">
                  G
                </div>
                <span className="font-medium text-slate-800 dark:text-slate-200">Google</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">13</span>
            </div>

            {/* DHL */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-slate-100 dark:bg-[#0c1322] border border-amber-500/40 text-amber-500 dark:text-amber-400 font-extrabold text-[9px] flex items-center justify-center">
                  DHL
                </div>
                <span className="font-medium text-slate-800 dark:text-slate-200">DHL</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">8</span>
            </div>
          </div>
        </div>

        {/* Card 3: AI Assistant */}
        <div className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 pb-1">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Assistant</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Ask questions about this data, search cases, or get insights.
            </p>

            {/* Interactive Query Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAiQuery(aiPrompt);
              }}
              className="mt-3 relative"
            >
              <input
                id="ai-assistant-input"
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Show all malicious emails from last week..."
                className="w-full text-xs bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 rounded-lg pl-3 pr-9 py-2 outline-none focus:bg-white dark:focus:bg-[#0c1322] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              />
              <button
                type="submit"
                disabled={!aiPrompt.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-blue-600 dark:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* AI Response Output if active */}
            {isAiLoading && (
              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-[#090e1a] border border-blue-500/30 text-xs text-sky-600 dark:text-sky-400 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-blue-600 dark:border-sky-400 border-t-transparent animate-spin" />
                <span>Analyzing telemetry and generating threat brief...</span>
              </div>
            )}

            {aiResponse && !isAiLoading && (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 animate-fadeIn">
                <div className="whitespace-pre-line leading-relaxed font-sans">{aiResponse}</div>
              </div>
            )}
          </div>

          {/* Clickable Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setAiPrompt('Summarize recent cases');
                handleAiQuery('Summarize recent cases');
              }}
              className="text-[11px] font-medium bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Summarize recent cases
            </button>
            <button
              type="button"
              onClick={() => {
                setAiPrompt('Show blocked domains');
                handleAiQuery('Show blocked domains');
              }}
              className="text-[11px] font-medium bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Show blocked domains
            </button>
            <button
              type="button"
              onClick={() => {
                setAiPrompt('What are top threats?');
                handleAiQuery('What are top threats?');
              }}
              className="text-[11px] font-medium bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            >
              What are top threats?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
