import React, { useState } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { casesStore } from '../../stores/cases-store.ts';
import { AshielderLogo } from '../../components/ui/AshielderLogo.tsx';
import {
  Printer,
  ArrowLeft,
  ChevronDown,
  Download,
  FileDown,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import {
  EXACT_REPORT_DATA,
  getReportDataForCase,
  generateStandaloneReportHtml,
} from './forensicReportData.ts';
import { downloadPdfReport, downloadEvidenceManifest } from './exporters.ts';

export interface ForensicReportPageProps {
  caseId?: string;
  embedded?: boolean;
}

export const ForensicReportPage: React.FC<ForensicReportPageProps> = ({
  caseId: propCaseId,
  embedded = false,
}) => {
  const ui = useUI();
  const effectiveCaseId = propCaseId || ui.activeCaseId || 'A2291';
  const caseData = casesStore.getCase(effectiveCaseId);
  const investigation = casesStore.getInvestigation(effectiveCaseId);
  const d = getReportDataForCase(effectiveCaseId, caseData, investigation);

  const [activeSectionDropdown, setActiveSectionDropdown] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Smooth scroll with brief highlight effect
  const scrollToAnchor = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedId(targetId);
      setTimeout(() => setHighlightedId(null), 2500);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    uiStore.addToast('info', `Copied to clipboard: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Download Standalone Self-Contained HTML File
  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneReportHtml(d);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ASHIELDER-Forensic-Report-${d.metadata.caseId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    uiStore.addToast('success', `Standalone forensic HTML dossier downloaded for Case #${d.metadata.caseId}.`);
  };

  // Download Structured JSON Manifest
  const handleDownloadJson = () => {
    downloadEvidenceManifest(d);
    uiStore.addToast('success', `Forensic JSON Evidence Corpus downloaded for Case #${d.metadata.caseId}.`);
  };

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Download the Main Exact Report using html2canvas & jsPDF
  const handleDownloadMainReport = async () => {
    setIsDownloadingPdf(true);
    uiStore.addToast('info', `Compiling main exact forensic report for Case #${d.metadata.caseId}...`);
    try {
      await downloadPdfReport('exact-forensic-report-main', d.metadata.caseId, (msg) => {
        // Optional progress updates
      }, caseData, investigation);
      uiStore.addToast('success', `Main Forensic Report downloaded for Case #${d.metadata.caseId}.`);
    } catch (err: any) {
      console.error('Failed to export main report:', err);
      if (err instanceof Error && err.message.includes('Rate limit')) {
        uiStore.addToast('error', err.message);
      } else {
        uiStore.addToast('error', 'Failed to generate exact PDF report.');
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const sectionsNav = [
    { id: 'sec-abstract', label: 'Formal Forensic Abstract' },
    { id: 'sec-1-0', label: '1.0 Cover / Case Summary' },
    { id: 'sec-2-0', label: '2.0 Executive Summary' },
    { id: 'sec-3-0', label: '3.0 Case Scope & Methodology' },
    { id: 'sec-4-0', label: '4.0 Evidence Register' },
    { id: 'sec-5-0', label: '5.0 Chain of Custody & Chronology' },
    { id: 'sec-6-0', label: '6.0 Original Email Overview' },
    { id: 'sec-7-0', label: '7.0 Email Header Analysis' },
    { id: 'sec-8-0', label: '8.0 SPF / DKIM / DMARC Analysis' },
    { id: 'sec-9-0', label: '9.0 URL Analysis' },
    { id: 'sec-10-0', label: '10.0 Attachment Analysis' },
    { id: 'sec-11-0', label: '11.0 Threat Intelligence' },
    { id: 'sec-12-0', label: '12.0 AI / ML Analysis' },
    { id: 'sec-13-0', label: '13.0 Analyst Review & Disposition' },
    { id: 'sec-14-0', label: '14.0 Correlation & Risk Assessment' },
    { id: 'sec-15-0', label: '15.0 Final Findings' },
    { id: 'sec-16-0', label: '16.0 Conclusion & Recommendation' },
    { id: 'sec-17-0', label: '17.0 Investigation Limitations' },
    { id: 'sec-18-0', label: '18.0 Appendix — Evidence References' },
  ];

  return (
    <div
      className={`${
        embedded ? 'w-full pb-8' : 'min-h-screen bg-slate-100 dark:bg-[#070e1a] pb-24'
      } text-slate-900 dark:text-slate-100 font-sans print:bg-white print:text-black print:pb-0`}
    >
      {/* =========================================================================
          OPERATIONAL UTILITY TOOLBAR (Hidden in Print)
          ========================================================================= */}
      <header
        id="report-persistent-header"
        className={`${
          embedded
            ? 'rounded-xl mb-4'
            : 'sticky top-0 z-40'
        } bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-6 py-2.5 print:hidden`}
      >
        <div className={`${embedded ? 'w-full' : 'max-w-5xl mx-auto'} flex flex-wrap items-center justify-between gap-3`}>
          {/* Left: Brand & Case ID */}
          <div className="flex items-center gap-3 min-w-0">
            {!embedded && (
              <button
                type="button"
                onClick={() => uiStore.navigate('/inbox')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Return to Case Inbox"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <AshielderLogo size="sm" variant="icon" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white font-sans">
                    Ashielder Forensics
                  </span>
                  <span className="text-xs uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    NIST SP 800-86
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>
                    CASE: <strong className="text-slate-800 dark:text-slate-200">{d.metadata.caseId}</strong>
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline">{d.metadata.generated}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Section Jump & Export Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Section Navigator Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveSectionDropdown(!activeSectionDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold border border-transparent shadow-sm cursor-pointer transition-colors"
              >
                <span>Jump to Section</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeSectionDropdown && (
                <div
                  className="absolute right-0 mt-1 w-64 max-h-96 overflow-y-auto bg-white dark:bg-[#0e172a] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs font-medium font-sans"
                  onMouseLeave={() => setActiveSectionDropdown(false)}
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Forensic Dossier Sections
                  </div>
                  {sectionsNav.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        scrollToAnchor(sec.id);
                        setActiveSectionDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="truncate">{sec.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Standalone HTML Export */}
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Download standalone offline HTML file"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>HTML Dossier</span>
            </button>

            {/* JSON Corpus Export */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Download structured JSON manifest"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Corpus</span>
            </button>

            {/* Download Report (Exact Main Report - Identical to Header Button) */}
            <button
              type="button"
              id="btn-report-download-main"
              onClick={handleDownloadMainReport}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 transition-all cursor-pointer disabled:opacity-60"
              title="Download Main Exact Forensic Report (NIST SP 800-86)"
            >
              <FileDown className={`w-3.5 h-3.5 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingPdf ? 'Generating Report...' : 'Download Report'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          EXACT REPORT DOCUMENT CANVAS (High-Fidelity Clone)
          ========================================================================= */}
      <main id="exact-forensic-report-main" className="max-w-4xl mx-auto mt-4 sm:mt-6 pl-4 pr-16 sm:px-8 py-8 sm:py-12 bg-white dark:bg-[#0b1322] border border-slate-200 dark:border-slate-800 shadow-lg rounded-sm print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:bg-white print:text-black">
        {/* =======================================================================
            PAGE 1: COVER, METADATA, ABSTRACT, 1.0 COVER / CASE SUMMARY, 2.0 PART 1
            ======================================================================= */}
        <section
          id="sec-cover"
          data-pdf-section="sec-cover"
          className="mb-8 scroll-mt-24">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4">
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 font-mono uppercase">
                {d.division}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
                {d.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                {d.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-500 animate-pulse" />
                <span>{d.verdictBadge}</span>
              </div>
              <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {d.notice}
              </div>
            </div>
          </div>

          {/* Metadata Grid (4 cols x 2 rows) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 py-3 border-y border-slate-200 dark:border-slate-800 text-xs my-4 font-sans">
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                CASE ID
              </span>
              <strong className="font-mono text-slate-900 dark:text-slate-100">{d.metadata.caseId}</strong>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                INVESTIGATION ID
              </span>
              <strong className="font-mono text-slate-900 dark:text-slate-100">{d.metadata.investigationId}</strong>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                REPORT STATUS
              </span>
              <strong className="text-slate-900 dark:text-slate-100">{d.metadata.reportStatus}</strong>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                GENERATED
              </span>
              <span className="text-slate-700 dark:text-slate-300">{d.metadata.generated}</span>
            </div>

            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                ANALYST SIGN-OFF
              </span>
              <span className="text-slate-700 dark:text-slate-300">{d.metadata.analystSignOff}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                DATASET ORIGIN
              </span>
              <span className="text-slate-700 dark:text-slate-300">{d.metadata.datasetOrigin}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                PRESERVED EVIDENCE
              </span>
              <strong className="text-slate-900 dark:text-slate-100">{d.metadata.preservedEvidence}</strong>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                CONFIDENCE RATING
              </span>
              <strong className="text-slate-900 dark:text-slate-100">{d.metadata.confidenceRating}</strong>
            </div>
          </div>
        </section>

        {/* =======================================================================
            FORMAL FORENSIC ABSTRACT
            ======================================================================= */}
        <section
          id="sec-abstract"
          data-pdf-section="sec-abstract"
          className={`mb-8 p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 transition-all ${
            highlightedId === 'sec-abstract' ? 'ring-2 ring-blue-500' : ''
          } scroll-mt-24`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-sans">
            FORMAL FORENSIC ABSTRACT
          </div>
          <div className="font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200 text-justify">
            <p>
              <strong className="font-sans font-bold">Abstract—</strong>
              {d.abstract}
            </p>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-sans border-t border-slate-200/70 dark:border-slate-800/70 pt-2">
            <strong className="text-slate-700 dark:text-slate-300">Keywords:</strong> {d.keywords}
          </div>
        </section>

        {/* =======================================================================
            1.0 COVER / CASE SUMMARY
            ======================================================================= */}
        <section
          id="sec-1-0"
          data-pdf-section="sec-1-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-1-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              1.0
            </span>
            <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white">
              Cover / Case Summary
            </h2>
          </div>

          <div className="p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              TRIAGE & SIGNAL IDENTIFICATION:
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
              {d.triageSummary}
            </p>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              KEY FINDINGS & DIRECT EVIDENCE CORROBORATION:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {d.keyFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700/80 rounded p-3"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`font-mono font-bold ${
                        finding.status === 'FAIL'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {finding.id} {finding.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      &rarr; {finding.ref}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {finding.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {finding.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================================
            2.0 EXECUTIVE SUMMARY
            ======================================================================= */}
        <section
          id="sec-2-0"
          data-pdf-section="sec-2-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-2-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              2.0
            </span>
            <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
              EXECUTIVE SUMMARY
            </h2>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                VERDICT
              </span>
              <div className="flex items-center gap-1.5 text-base font-extrabold text-rose-600 dark:text-rose-400 my-1">
                <span>&bull;</span>
                <span>{d.executive.verdict}</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {d.executive.verdictSub}
              </span>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                RISK SCORE
              </span>
              <div className="text-base font-extrabold text-rose-600 dark:text-rose-400 my-1">
                {d.executive.riskScore}{' '}
                <span className="text-xs font-normal text-slate-400">
                  {d.executive.riskMax}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {d.executive.riskSub}
              </span>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                CONFIDENCE
              </span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white my-1">
                {d.executive.confidence}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {d.executive.confidenceSub}
              </span>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                PRIMARY THREAT TYPE
              </span>
              <div className="my-1.5">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {d.executive.threatType}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {d.executive.threatSub}
              </span>
            </div>
          </div>

          {/* Narrative & Flags Box */}
          <div className="p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              EXECUTIVE SYNTHESIS & CASE NARRATIVE:
            </div>
            <p className="font-serif text-xs leading-relaxed text-slate-800 dark:text-slate-200 text-justify mb-4">
              {d.executive.narrative}
            </p>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              WHY ASHIELDER FLAGGED THIS EMAIL:
            </div>
            <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 mb-4">
              {d.executive.flaggedReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">&bull;</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800/70">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Corroborating Evidence:
              </span>
              {d.executive.corroboratingEvidence.map((ev) => (
                <button
                  key={ev}
                  type="button"
                  onClick={() => scrollToAnchor('sec-4-0')}
                  className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-mono text-xs hover:border-blue-500 hover:underline cursor-pointer transition-colors"
                >
                  {ev}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================================
            3.0 CASE SCOPE & METHODOLOGY
            ======================================================================= */}
        <section
          id="sec-3-0"
          data-pdf-section="sec-3-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-3-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              3.0
            </span>
            <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
              CASE SCOPE & METHODOLOGY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs text-slate-900 dark:text-white mb-1">
                Investigation Objective:
              </strong>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {d.methodology.objective}
              </p>
            </div>
            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs text-slate-900 dark:text-white mb-1">
                Evidence Acquisition Method:
              </strong>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {d.methodology.acquisitionMethod}
              </p>
            </div>
            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs text-slate-900 dark:text-white mb-1">
                Source Ingestion Endpoint:
              </strong>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {d.methodology.sourceEndpoint}
              </p>
            </div>
            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs text-slate-900 dark:text-white mb-1">
                Analysis Scope:
              </strong>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {d.methodology.scope}
              </p>
            </div>
          </div>

          {/* Pipeline Breadcrumbs */}
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              FORENSIC PROCESSING PIPELINE:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              {d.methodology.pipeline.map((step, idx) => (
                <React.Fragment key={step}>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700 text-xs">
                    {step}
                  </span>
                  {idx < d.methodology.pipeline.length - 1 && (
                    <span className="text-slate-400">&rarr;</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================================
            4.0 EVIDENCE REGISTER
            ======================================================================= */}
        <section
          id="sec-4-0"
          data-pdf-section="sec-4-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-4-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                4.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                EVIDENCE REGISTER
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              7 Chain-Preserved Artifacts
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-50 dark:bg-[#08101d] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 leading-relaxed">EVIDENCE ID</th>
                  <th className="py-3 px-4 leading-relaxed">TYPE</th>
                  <th className="py-3 px-4 leading-relaxed">DESCRIPTION</th>
                  <th className="py-3 px-4 leading-relaxed">SOURCE</th>
                  <th className="py-3 px-4 leading-relaxed">SHA-256 CHECKSUM (DEMO)</th>
                  <th className="py-3 px-4 leading-relaxed">ACQUIRED</th>
                  <th className="py-3 px-4 leading-relaxed">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0b1322]">
                {d.evidenceRegister.map((e) => (
                  <tr
                    key={e.id}
                    id={`artifact-${e.id.replace(/[[\]]/g, '')}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#0e192c]/50 transition-colors"
                  >
                    <td className="py-3 px-4 leading-relaxed font-mono font-bold text-slate-900 dark:text-white">
                      {e.id}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {e.type}
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-600 dark:text-slate-300 max-w-xs">
                      {e.description}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {e.source}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(e.sha256, e.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Click to copy hash"
                      >
                        <span>{e.sha256}</span>
                        {copiedKey === e.id ? (
                          <Check className="w-3 h-3 text-emerald-500 inline" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 opacity-40 inline" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {e.acquired}
                    </td>
                    <td className="py-3 px-4 leading-relaxed whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-400 italic mt-1.5 font-sans">
            Notice: All hashes are synthetic DEMO HASH VALUES used to illustrate cryptographic custody and state verification.
          </div>
        </section>

        {/* =======================================================================
            5.0 CHAIN OF CUSTODY & INVESTIGATION CHRONOLOGY
            ======================================================================= */}
        <section
          id="sec-5-0"
          data-pdf-section="sec-5-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-5-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              5.0
            </span>
            <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
              CHAIN OF CUSTODY & INVESTIGATION CHRONOLOGY
            </h2>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              LINEAR FORENSIC CUSTODY FLOW:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              {d.custodyFlow.map((step, idx) => (
                <React.Fragment key={step}>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700 text-xs">
                    {step}
                  </span>
                  {idx < d.custodyFlow.length - 1 && (
                    <span className="text-slate-400">&darr;</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-50 dark:bg-[#08101d] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 leading-relaxed">TIMESTAMP (UTC)</th>
                  <th className="py-3 px-4 leading-relaxed">ACTION / EVENT</th>
                  <th className="py-3 px-4 leading-relaxed">ACTOR</th>
                  <th className="py-3 px-4 leading-relaxed">EVIDENCE REF</th>
                  <th className="py-3 px-4 leading-relaxed">RESULTING STATE / STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0b1322]">
                {d.custodyChronology.map((c, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#0e192c]/50 transition-colors"
                  >
                    <td className="py-3 px-4 leading-relaxed font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {c.timestamp}
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                      {c.action}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {c.actor}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono text-xs text-slate-700 dark:text-slate-300">
                      {c.evidenceRef}
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-xs text-slate-600 dark:text-slate-400">
                      {c.resultingState}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =======================================================================
            6.0 ORIGINAL EMAIL OVERVIEW
            ======================================================================= */}
        <section
          id="sec-6-0"
          data-pdf-section="sec-6-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-6-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                6.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                ORIGINAL EMAIL OVERVIEW
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              [E-001] Original Email
            </span>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3 font-sans">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">FROM:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{d.originalEmail.from}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">TO:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{d.originalEmail.to}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">SUBJECT:</span>
              <strong className="text-slate-900 dark:text-white">{d.originalEmail.subject}</strong>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">RECEIVED (UTC):</span>
              <span className="text-slate-700 dark:text-slate-300">{d.originalEmail.received}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">MESSAGE-ID:</span>
              <span className="font-mono text-slate-600 dark:text-slate-400 text-xs">{d.originalEmail.messageId}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">REPLY-TO / RETURN-PATH:</span>
              <span className="font-mono text-slate-600 dark:text-slate-400 text-xs">{d.originalEmail.replyTo}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              DECODED MESSAGE BODY (DEFANGED TEXT PREVIEW):
            </div>
            <pre className="p-3 rounded bg-white dark:bg-[#0e1728] border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {d.originalEmail.bodyText}
            </pre>
          </div>
        </section>

        {/* =======================================================================
            7.0 EMAIL HEADER ANALYSIS
            ======================================================================= */}
        <section
          id="sec-7-0"
          data-pdf-section="sec-7-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-7-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                7.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                EMAIL HEADER ANALYSIS
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              [E-002] Headers
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md mb-4">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-50 dark:bg-[#08101d] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 leading-relaxed">HEADER FIELD</th>
                  <th className="py-3 px-4 leading-relaxed">VALUE</th>
                  <th className="py-3 px-4 leading-relaxed">ASSESSMENT</th>
                  <th className="py-3 px-4 leading-relaxed">STATUS</th>
                  <th className="py-3 px-4 leading-relaxed">EVIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0b1322]">
                {d.headersAnalysis.map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-[#0e192c]/50 transition-colors">
                    <td className="py-3 px-4 leading-relaxed font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {h.field}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono text-xs text-slate-700 dark:text-slate-300 max-w-xs">
                      {h.value}
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-600 dark:text-slate-300">
                      {h.assessment}
                    </td>
                    <td className="py-3 px-4 leading-relaxed whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          h.status === 'FAIL'
                            ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : h.status === 'FLAGGED'
                            ? 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : h.status === 'VALID'
                            ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-transparent text-slate-600 dark:text-slate-400 border border-slate-500/30'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {h.evidenceRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4 Hop Relay Cards */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              TRANSPORT RELAY HOPS SEQUENCE (RFC 5737 SAFE DOCUMENTATION IPS):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {d.relayHops.map((hop) => (
                <div
                  key={hop.hopNumber}
                  className="p-3 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono font-bold mb-1">
                    <span>{hop.hopNumber}</span>
                    <span>{hop.time}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {hop.role}
                  </div>
                  <div className="font-mono text-blue-600 dark:text-sky-400 font-semibold text-xs my-0.5">
                    {hop.ip}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {hop.host}
                  </div>
                  <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2">
                    {hop.state}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================================
            8.0 SPF / DKIM / DMARC ANALYSIS
            ======================================================================= */}
        <section
          id="sec-8-0"
          data-pdf-section="sec-8-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-8-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                8.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                SPF / DKIM / DMARC ANALYSIS
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              [E-005] Authentication
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {(['spf', 'dkim', 'dmarc'] as const).map((key) => {
              const proto = d.authProtocols[key];
              return (
                <div
                  key={key}
                  className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white uppercase">
                      {key}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      {proto.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mb-2">
                    Specification: {proto.spec}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">Interpretation:</strong>{' '}
                    {proto.interpretation}
                  </p>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    RAW HEADER LINE EXCERPT:
                  </div>
                  <pre className="p-2 rounded bg-white dark:bg-[#0e1728] border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-tight break-all mb-2">
                    {proto.rawHeader}
                  </pre>
                  <div className="text-xs text-slate-400 font-mono">
                    Evidence Reference: <strong>{proto.ref}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 italic">
            <strong className="font-sans not-italic text-slate-800 dark:text-slate-200">
              Forensic Protocol Explanation:
            </strong>{' '}
            {d.authProtocols.explanation}
          </div>
        </section>

        {/* =======================================================================
            9.0 URL ANALYSIS
            ======================================================================= */}
        <section
          id="sec-9-0"
          data-pdf-section="sec-9-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-9-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                9.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                URL ANALYSIS
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              [E-003] Extracted URL
            </span>
          </div>

          <div className="p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70 mb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  DISPLAY-SAFE TARGET URL:
                </span>
                <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm mt-0.5 break-all">
                  {d.urlAnalysis.targetUrl}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Defanged: {d.urlAnalysis.defangedUrl}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  VERDICT: {d.urlAnalysis.verdict}
                </span>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  URL RISK: {d.urlAnalysis.riskScore}
                </div>
              </div>
            </div>

            {/* Workflow sequence steps */}
            <div className="mb-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                ARTIFACT ANALYSIS WORKFLOW SEQUENCE:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                {d.urlAnalysis.workflow.map((w) => (
                  <div
                    key={w.step}
                    className="p-2 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700/80"
                  >
                    <div className="text-xs font-mono font-bold text-slate-400">
                      {w.step} {w.label}
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 text-xs font-medium mt-0.5 truncate">
                      {w.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              {d.urlAnalysis.bulletPoints.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400">&bull;</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =======================================================================
            10.0 ATTACHMENT ANALYSIS
            ======================================================================= */}
        <section
          id="sec-10-0"
          data-pdf-section="sec-10-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-10-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                10.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                ATTACHMENT ANALYSIS
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              [E-004] Attachment
            </span>
          </div>

          <div className="p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-slate-800/70 mb-3">
              <div>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {d.attachmentAnalysis.filename}
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  MIME: {d.attachmentAnalysis.mime} • Size: {d.attachmentAnalysis.size}
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  SHA-256: {d.attachmentAnalysis.sha256}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {d.attachmentAnalysis.resultBadge}
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {d.attachmentAnalysis.confidence}
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              STATIC PDF OBJECT STRUCTURE HEURISTIC DETECTIONS:
            </div>
            <div className="space-y-1.5 mb-3">
              {d.attachmentAnalysis.heuristics.map((h) => (
                <div
                  key={h.name}
                  className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700/80 text-xs"
                >
                  <div>
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {h.name}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 ml-1.5">
                      — {h.detail}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      h.severity === 'Critical' || h.severity === 'High'
                        ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {h.severity}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-400 italic">
              {d.attachmentAnalysis.notice}
            </div>
          </div>
        </section>

        {/* =======================================================================
            11.0 THREAT INTELLIGENCE
            ======================================================================= */}
        <section
          id="sec-11-0"
          data-pdf-section="sec-11-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-11-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                11.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                THREAT INTELLIGENCE
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Synthetic Local Correlator
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-50 dark:bg-[#08101d] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 leading-relaxed">INDICATOR</th>
                  <th className="py-3 px-4 leading-relaxed">TYPE</th>
                  <th className="py-3 px-4 leading-relaxed">SOURCE (DEMO)</th>
                  <th className="py-3 px-4 leading-relaxed">RESULT</th>
                  <th className="py-3 px-4 leading-relaxed">CONFIDENCE</th>
                  <th className="py-3 px-4 leading-relaxed">CHECKED (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0b1322]">
                {d.threatIntel.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-[#0e192c]/50 transition-colors">
                    <td className="py-3 px-4 leading-relaxed font-mono font-bold text-slate-900 dark:text-white">
                      {t.indicator}
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      {t.type}
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-500 dark:text-slate-400">
                      {t.source}
                    </td>
                    <td className="py-3 px-4 leading-relaxed whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          t.result === 'Malicious'
                            ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {t.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700 dark:text-slate-300">
                      {t.confidence}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {t.checked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-400 italic mt-1.5 font-sans">
            Notice: Indicators originate from internal synthetic demo repositories; no real external commercial threat feeds were queried.
          </div>
        </section>

        {/* =======================================================================
            12.0 AI / ML ANALYSIS
            ======================================================================= */}
        <section
          id="sec-12-0"
          data-pdf-section="sec-12-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-12-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                12.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                AI / ML ANALYSIS
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              [E-007] Model Results
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {d.aiAnalysis.models.map((m) => (
              <div
                key={m.name}
                className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {m.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      m.verdictSeverity === 'MALICIOUS'
                        ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {m.verdict}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-300 mb-2">
                  Conf: <strong className="text-slate-900 dark:text-white">{m.conf}</strong>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 mb-2">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              ENSEMBLE MULTI-SIGNAL REASONING DRIVER:
            </div>
            <p className="font-serif text-xs text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
              {d.aiAnalysis.driver}
            </p>
          </div>

          <div className="text-xs text-slate-400 italic font-sans">
            {d.aiAnalysis.notice}
          </div>
        </section>

        {/* =======================================================================
            13.0 ANALYST REVIEW & DISPOSITION
            ======================================================================= */}
        <section
          id="sec-13-0"
          data-pdf-section="sec-13-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-13-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                13.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                ANALYST REVIEW & DISPOSITION
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              {d.analystReview.badge}
            </span>
          </div>

          <div className="p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70 mb-3 text-xs">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  REVIEWING EXAMINER
                </span>
                <strong className="text-slate-900 dark:text-white mt-0.5 block">
                  {d.analystReview.examiner}
                </strong>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  ANALYST VERDICT DISPOSITION
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-bold mt-0.5 flex items-center gap-1">
                  <span>&bull;</span>
                  <span>{d.analystReview.verdict}</span>
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  SIGN-OFF TIMESTAMP (UTC)
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-300 mt-0.5 block">
                  {d.analystReview.timestamp}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-sans">
                FREEFORM ANALYST EXAMINATION NOTES:
              </div>
              <p className="font-serif text-xs text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
                {d.analystReview.notes}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-xs">
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                Digital Sign-Off Digest:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {d.analystReview.digest}
                </strong>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                DISPOSITION RECORDED & SEALED
              </span>
            </div>
          </div>
        </section>

        {/* =======================================================================
            14.0 CORRELATION & RISK ASSESSMENT
            ======================================================================= */}
        <section
          id="sec-14-0"
          data-pdf-section="sec-14-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-14-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              14.0
            </span>
            <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
              CORRELATION & RISK ASSESSMENT
            </h2>
          </div>

          <div className="p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 mb-4">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              MULTI-SIGNAL FUSION ARCHITECTURE:
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/2 space-y-2">
                {d.fusionSignals.map((sig) => (
                  <div
                    key={sig.label}
                    className="flex justify-between items-center p-2 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700/80 text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {sig.label}
                    </span>
                    <span className="font-mono font-bold text-blue-600 dark:text-sky-400">
                      &rarr; {sig.weight}
                    </span>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block text-2xl text-slate-300 dark:text-slate-700 font-bold">
                &rarr;
              </div>

              <div className="w-full sm:w-1/2 p-4 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  CONSOLIDATED DISPOSITION
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white my-1">
                  Signal correlation complete.
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Refer to Section 2.0 (Executive Summary) for aggregate verdict, risk score, and primary classification.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-50 dark:bg-[#08101d] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 leading-relaxed">SIGNAL COMPONENT</th>
                  <th className="py-3 px-4 leading-relaxed">DEMO WEIGHT</th>
                  <th className="py-3 px-4 leading-relaxed">SCORE CONTRIBUTION</th>
                  <th className="py-3 px-4 leading-relaxed">STATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0b1322]">
                {d.riskWeights.map((rw) => (
                  <tr key={rw.component} className="hover:bg-slate-50/80 dark:hover:bg-[#0e192c]/50 transition-colors">
                    <td className="py-3 px-4 leading-relaxed font-semibold text-slate-900 dark:text-white">
                      {rw.component}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono text-slate-600 dark:text-slate-400">
                      {rw.weight}
                    </td>
                    <td className="py-3 px-4 leading-relaxed font-mono font-bold text-slate-900 dark:text-white">
                      {rw.scoreContribution}
                    </td>
                    <td className="py-3 px-4 leading-relaxed whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          rw.state === 'Fail' || rw.state === 'Malicious'
                            ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : rw.state === 'Suspicious' || rw.state === 'Untrusted'
                            ? 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-transparent text-slate-600 dark:text-slate-400 border border-slate-500/30'
                        }`}
                      >
                        {rw.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =======================================================================
            15.0 FINAL FINDINGS
            ======================================================================= */}
        <section
          id="sec-15-0"
          data-pdf-section="sec-15-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-15-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                15.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                FINAL FINDINGS
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              For overall threat score & verdict, see <strong>Section 2.0</strong>
            </span>
          </div>

          <div className="space-y-3">
            {d.findings.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    <span className="font-mono mr-1">{f.id}</span> {f.title}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                      f.severity === 'MALICIOUS'
                        ? 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {f.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {f.summary}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/70 dark:border-slate-800/70">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Corroborating Evidence:
                  </span>
                  {(f.corroboratingEvidence ?? []).map((ev) => (
                    <button
                      key={ev}
                      type="button"
                      onClick={() => scrollToAnchor('sec-4-0')}
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0d1726] border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-mono text-xs hover:border-blue-500 hover:underline cursor-pointer"
                    >
                      {ev}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =======================================================================
            16.0 CONCLUSION & RECOMMENDATION
            ======================================================================= */}
        <section
          id="sec-16-0"
          data-pdf-section="sec-16-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-16-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              16.0
            </span>
            <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
              CONCLUSION & RECOMMENDATION
            </h2>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                CASE DISPOSITION CROSS-REFERENCE
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                Following multi-vector correlation and analyst sign-off, see{' '}
                <strong className="text-slate-900 dark:text-white">
                  Section 2.0 (Executive Summary)
                </strong>{' '}
                for aggregate verdict, risk score, and primary threat classification.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap">
              Disposition Finalized
            </span>
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            RECOMMENDED INCIDENT RESPONSE ACTIONS:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {d.recommendations.map((rec) => (
              <div
                key={rec.action}
                className="p-3.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 text-xs"
              >
                <div className="font-bold text-slate-900 dark:text-white mb-1">
                  {rec.action}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rec.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 italic">
            <strong className="font-sans not-italic text-slate-800 dark:text-slate-200">
              OPERATIONAL SECURITY DISCLAIMER:
            </strong>{' '}
            {d.disclaimer}
          </div>
        </section>

        {/* =======================================================================
            17.0 INVESTIGATION LIMITATIONS
            ======================================================================= */}
        <section
          id="sec-17-0"
          data-pdf-section="sec-17-0"
          className={`mb-8 transition-all ${
            highlightedId === 'sec-17-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          } scroll-mt-24`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              17.0
            </span>
            <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
              INVESTIGATION LIMITATIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {d.limitations.map((limit, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                {limit}
              </div>
            ))}
          </div>
        </section>

        {/* =======================================================================
            18.0 APPENDIX — EVIDENCE REFERENCES
            ======================================================================= */}
        <section
          id="sec-18-0"
          data-pdf-section="sec-18-0"
          className={`mb-10 transition-all ${
            highlightedId === 'sec-18-0' ? 'ring-2 ring-blue-500 rounded p-1' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-black text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                18.0
              </span>
              <h2 className="font-sans font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                APPENDIX — EVIDENCE REFERENCES
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Cross-Referenced Corpus
            </span>
          </div>

          <div className="space-y-2">
            {d.appendix.map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-md bg-slate-50 dark:bg-[#08101d] border border-slate-200 dark:border-slate-800 text-xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">
                    <span className="font-mono text-blue-600 dark:text-sky-400 mr-1.5">
                      {app.id}
                    </span>
                    {app.title}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {app.hash}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-1">{app.desc}</p>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {app.meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =======================================================================
            RUNNING DOCUMENT CERTIFIED FOOTER
            ======================================================================= */}
        <footer className="pt-4 border-t-2 border-slate-900 dark:border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
          <div>
            <strong>{d.footer.engine}</strong> • {d.footer.caseString} • {d.footer.timestamp}
          </div>
          <div className="flex items-center gap-2">
            <span>{d.footer.pageInfo}</span>
            <span>•</span>
            <span>{d.footer.manifestCheck}</span>
            <span>•</span>
            <strong className="text-slate-900 dark:text-white uppercase">
              {d.footer.certified}
            </strong>
          </div>
        </footer>
      </main>
    </div>
  );
};

