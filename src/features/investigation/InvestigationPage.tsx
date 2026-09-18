import React, { useState, useRef, useEffect } from 'react';
import { uiStore } from '../../stores/ui-store.ts';
import { casesStore, useCases } from '../../stores/cases-store.ts';
import { ForensicWorkflowModal, IngestionSource } from './ForensicWorkflowModal.tsx';
import { OfficialGmailLogo, OfficialMicrosoftLogo, OfficialOutlookLogo } from '../../components/ui/BrandLogos.tsx';
import {
  Plus,
  ChevronDown,
  Clock,
  ArrowRight,
  MoreVertical,
  FileText,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  Copy,
  RotateCcw,
} from 'lucide-react';

interface RecentInvestigationRow {
  id: string;
  caseId?: string;
  subject: string;
  source: 'gmail' | 'microsoft' | 'eml' | 'server';
  sourceLabel: string;
  status: 'Malicious' | 'Clean' | 'Suspicious' | 'Inconclusive';
  riskScore: number;
  date: string;
}

export const InvestigationPage: React.FC = () => {
  const { cases } = useCases();

  // Dropdown menu state for "+ Add Email ▾"
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Workflow Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<IngestionSource>('gmail');

  // Row 3-dots action menu popover
  const [openActionRowId, setOpenActionRowId] = useState<string | null>(null);

  // Default initial rows matching the exact reference image
  const [recentRows, setRecentRows] = useState<RecentInvestigationRow[]>([
    {
      id: 'row-1',
      caseId: 'A2291',
      subject: 'Urgent: Account Verification Required',
      source: 'gmail',
      sourceLabel: 'Gmail',
      status: 'Malicious',
      riskScore: 92,
      date: '7 Sep 2026, 10:24 AM',
    },
    {
      id: 'row-2',
      caseId: 'A2292',
      subject: 'Meeting Schedule - Project Update',
      source: 'microsoft',
      sourceLabel: 'Outlook',
      status: 'Clean',
      riskScore: 12,
      date: '6 Sep 2026, 04:18 PM',
    },
    {
      id: 'row-3',
      caseId: 'A2293',
      subject: 'Invoice #78291',
      source: 'eml',
      sourceLabel: 'Uploaded (.eml)',
      status: 'Suspicious',
      riskScore: 68,
      date: '5 Sep 2026, 11:02 AM',
    },
  ]);

  // Sync recent rows with newly ingested cases if available
  useEffect(() => {
    if (cases && cases.length > 0) {
      const topCases = cases.slice(0, 3).map((c, idx) => {
        let statusText: 'Malicious' | 'Clean' | 'Suspicious' | 'Inconclusive' = 'Clean';
        if (c.verdict.toUpperCase().includes('MALICIOUS')) statusText = 'Malicious';
        else if (c.verdict.toUpperCase().includes('SUSPICIOUS')) statusText = 'Suspicious';
        else if (c.verdict.toUpperCase().includes('INCONCLUSIVE')) statusText = 'Inconclusive';

        let source: 'gmail' | 'microsoft' | 'eml' | 'server' = 'eml';
        let sourceLabel = 'Uploaded (.eml)';
        if (c.attackHypotheses?.some((t) => t.toLowerCase().includes('gmail')) || c.sender.toLowerCase().includes('gmail')) {
          source = 'gmail';
          sourceLabel = 'Gmail';
        } else if (c.attackHypotheses?.some((t) => t.toLowerCase().includes('outlook') || t.toLowerCase().includes('microsoft')) || c.sender.toLowerCase().includes('outlook')) {
          source = 'microsoft';
          sourceLabel = 'Outlook';
        }

        const formattedDate = c.timestamp
          ? new Date(c.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : '7 Sep 2026, 10:24 AM';

        return {
          id: `case-${c.id}`,
          caseId: c.id,
          subject: c.subject,
          source,
          sourceLabel,
          status: statusText,
          riskScore: Math.round(c.riskScore),
          date: formattedDate,
        };
      });

      // Merge unique
      setRecentRows((prev) => {
        const merged: RecentInvestigationRow[] = [...topCases];
        for (const r of prev) {
          if (!merged.some((m) => m.subject === r.subject)) {
            merged.push(r);
          }
        }
        return merged.slice(0, 5);
      });
    }
  }, [cases]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
      // close row popover if click outside
      setOpenActionRowId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const openModalWithSource = (source: IngestionSource) => {
    setModalSource(source);
    setIsModalOpen(true);
    setIsAddMenuOpen(false);
  };

  return (
    <div id="investigation-page-root" className="min-h-full w-full bg-[#f8fafc] dark:bg-[#070b14] text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Row: Breadcrumb on left, + Add Email button on right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {/* Page Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
              Forensic Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyze suspicious emails, trace threats, and uncover the truth.
            </p>
          </div>

          {/* Top Right: "+ Add Email ▾" Action Button with Dropdown */}
          <div className="relative shrink-0" ref={addMenuRef}>
            <button
              id="add-email-dropdown-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddMenuOpen((prev) => !prev);
              }}
              className="bg-[#1a68ff] hover:bg-[#1554d1] active:bg-[#1144a8] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Email</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isAddMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu (Open as shown in the reference image) */}
            {isAddMenuOpen && (
              <div
                id="add-email-dropdown-menu"
                className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#0d1627] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
              >
                {/* 1. Connect Gmail */}
                <button
                  type="button"
                  onClick={() => openModalWithSource('gmail')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {/* Official Multi-color Gmail Logo */}
                    <OfficialGmailLogo className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      Connect Gmail
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Import and analyze emails
                    </p>
                  </div>
                </button>

                {/* 2. Microsoft / Outlook */}
                <button
                  type="button"
                  onClick={() => openModalWithSource('microsoft')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {/* Official Microsoft Logo */}
                    <OfficialMicrosoftLogo className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      Microsoft
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Outlook / Office 365
                    </p>
                  </div>
                </button>

                {/* 3. Upload .EML File */}
                <button
                  type="button"
                  onClick={() => openModalWithSource('eml')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      Upload .EML File
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Drag &amp; drop or browse
                    </p>
                  </div>
                </button>

                {/* 4. Send Email to Server */}
                <button
                  type="button"
                  onClick={() => openModalWithSource('server')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      Send Email to Server
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Forward suspicious email
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Central Workspace Card: Start an Investigation */}
        <div className="bg-white dark:bg-[#0b1220] border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs text-center transition-all">
          {/* Circular Badge with Blue Envelope Icon */}
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0b1220] border border-transparent flex items-center justify-center mx-auto text-slate-800 dark:text-white shadow-2xs">
            <Mail className="w-5 h-5" />
          </div>

          {/* Heading and Subheading */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3">
            Start an Investigation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose how you want to analyze an email
          </p>

          {/* Row of 4 Ingestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 sm:mt-8">
            {/* Card 1: Connect Gmail */}
            <div
              id="card-connect-gmail"
              onClick={() => openModalWithSource('gmail')}
              className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0e1627] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0e1627] border border-transparent flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                {/* Official Google Gmail Logo */}
                <OfficialGmailLogo className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-2">
                Connect Gmail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Import and analyze emails from your inbox
              </p>
            </div>

            {/* Card 2: Connect Microsoft */}
            <div
              id="card-connect-microsoft"
              onClick={() => openModalWithSource('microsoft')}
              className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0e1627] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0e1627] border border-transparent flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                {/* Official Microsoft Logo */}
                <OfficialMicrosoftLogo className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-2">
                Connect Microsoft
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Outlook / Office 365 integration
              </p>
            </div>

            {/* Card 3: Upload .EML File */}
            <div
              id="card-upload-eml"
              onClick={() => openModalWithSource('eml')}
              className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0e1627] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0e1627] border border-transparent flex items-center justify-center text-slate-800 dark:text-white mb-1 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-2">
                Upload .EML File
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Drag &amp; drop or browse from your device
              </p>
            </div>

            {/* Card 4: Send Email to Server */}
            <div
              id="card-send-server"
              onClick={() => openModalWithSource('server')}
              className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0e1627] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0e1627] border border-transparent flex items-center justify-center text-slate-800 dark:text-white mb-1 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-2">
                Send Email to Server
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Forward suspicious email to analyze
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Investigations Table */}
        <div className="bg-white dark:bg-[#0b1220] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-all">
          {/* Header Row */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <Clock className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Recent Investigations</span>
            </div>

            <button
              type="button"
              onClick={() => uiStore.navigate('/inbox')}
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="px-5 sm:px-6 py-3">Subject</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Risk Score</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recentRows.map((row) => {
                  const isActionOpen = openActionRowId === row.id;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer"
                      onClick={() => {
                        if (row.caseId) {
                          uiStore.navigate(`/case/${row.caseId}`);
                        } else {
                          uiStore.navigate('/inbox');
                        }
                      }}
                    >
                      {/* Subject */}
                      <td className="px-5 sm:px-6 py-3.5 font-medium text-slate-900 dark:text-white max-w-xs sm:max-w-md truncate">
                        <span className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                          {row.subject}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          {row.source === 'gmail' ? (
                            <OfficialGmailLogo className="w-3.5 h-3.5 shrink-0" />
                          ) : row.source === 'microsoft' ? (
                            <OfficialMicrosoftLogo className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <span className="text-xs">{row.sourceLabel}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${
                            row.status === 'Malicious'
                              ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold'
                              : row.status === 'Clean'
                              ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                              : 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded text-xs font-bold border ${
                            row.riskScore >= 80
                              ? 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/40 font-extrabold'
                              : row.riskScore >= 50
                              ? 'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/40'
                              : 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          {row.riskScore}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {row.date}
                      </td>

                      {/* Actions 3-dots */}
                      <td className="px-4 py-3.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setOpenActionRowId(isActionOpen ? null : row.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          aria-label="Row actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Action Popover */}
                        {isActionOpen && (
                          <div className="absolute right-4 top-full mt-1 w-44 bg-white dark:bg-[#0d1627] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1 z-30 text-xs text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionRowId(null);
                                if (row.caseId) uiStore.navigate(`/case/${row.caseId}`);
                                else uiStore.navigate('/inbox');
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View Case Workspace</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionRowId(null);
                                openModalWithSource(row.source);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Re-run Analysis</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionRowId(null);
                                navigator.clipboard.writeText(row.caseId || row.id);
                                uiStore.addToast('info', `Copied Case ID ${row.caseId || row.id}`);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Case ID</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Complete Forensic Pipeline Modal: INGEST -> PLAN -> INVESTIGATE -> RESULTS */}
      <ForensicWorkflowModal
        isOpen={isModalOpen}
        initialSource={modalSource}
        onClose={() => setIsModalOpen(false)}
        onCompletedCase={(caseId) => {
          // Row automatically reflects via cases store subscription
        }}
      />
    </div>
  );
};
