import React, { useEffect, useRef, useCallback } from 'react';
import { useCases, casesStore, RiskFilter, ConfidenceFilter, SortField } from '../../stores/cases-store.ts';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { CaseViewModel, TableDensityMode } from '../../domain/case.ts';
import { Verdict } from '../../contracts/backend.ts';
import { useCapabilities } from '../auth/capabilities.ts';
import { CaseTableRow } from './CaseTableRow.tsx';
import { QuickPeekDrawer } from './QuickPeekDrawer.tsx';
import {
  Inbox,
  Plus,
  Download,
  Filter,
  Search,
  Zap,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowUpDown,
  RotateCcw,
  CheckSquare,
  Trash2,
  Lock,
  CheckCircle2,
  SlidersHorizontal,
  Mail,
  ArrowUpRight,
} from 'lucide-react';

export const CaseInboxPage: React.FC = () => {
  const ui = useUI();
  const casesState = useCases();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCases = casesStore.getFilteredCases();
  const metrics = casesStore.getMetrics();
  const selectedCount = casesState.selectedCaseIds.size;
  const capabilities = useCapabilities();
  const isAllSelected =
    filteredCases.length > 0 &&
    filteredCases.every((c) => casesState.selectedCaseIds.has(c.id));

  // Open workspace for a case
  const handleOpenWorkspace = useCallback((caseItem: CaseViewModel) => {
    uiStore.setActiveCase(
      caseItem.id,
      caseItem.subject,
      caseItem.verdict,
      caseItem.riskScore,
      caseItem.confidence
    );
    uiStore.navigate(`/case/${caseItem.id}`);
  }, []);

  // Quick peek
  const handleQuickPeek = useCallback((caseId: string) => {
    uiStore.openQuickPeek(caseId);
  }, []);

  // Keyboard navigation for Inbox (`J`, `K`, `Space`, `Enter`, `X`, `/`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (ui.isQuickPeekOpen) {
        return;
      }

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        casesStore.moveFocus(1, filteredCases.length);
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        casesStore.moveFocus(-1, filteredCases.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        const focusedCase = filteredCases[casesState.focusedIndex];
        if (focusedCase) {
          handleQuickPeek(focusedCase.id);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const focusedCase = filteredCases[casesState.focusedIndex];
        if (focusedCase) {
          handleOpenWorkspace(focusedCase);
        }
      } else if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        const focusedCase = filteredCases[casesState.focusedIndex];
        if (focusedCase) {
          casesStore.toggleSelect(focusedCase.id);
        }
      } else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCases, casesState.focusedIndex, ui.isQuickPeekOpen, handleQuickPeek, handleOpenWorkspace]);

  // Export handlers
  const handleExportCsv = () => {
    const headers = [
      'Case ID',
      'Verdict',
      'Risk Score',
      'Confidence',
      'Sender',
      'Recipient',
      'Subject',
      'Timestamp',
      'Primary IOC',
    ];
    const rows = filteredCases.map((c) => [
      c.id,
      c.verdict,
      c.riskScore,
      c.confidence,
      `"${c.sender.replace(/"/g, '""')}"`,
      `"${c.recipient.replace(/"/g, '""')}"`,
      `"${c.subject.replace(/"/g, '""')}"`,
      c.timestamp,
      `"${(c.primaryIoc || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ashielder_cases_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    uiStore.addToast('success', `Exported ${filteredCases.length} cases to CSV`);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredCases, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `ashielder_cases_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    uiStore.addToast('success', `Exported ${filteredCases.length} cases to JSON`);
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-5 lg:p-6 pb-24 space-y-5 lg:space-y-6">
      {/* 1. FILTER TABS (GMAIL STYLE) */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] overflow-x-auto no-scrollbar pt-2 px-2">
        {[
          { 
            id: 'ALL', filter: 'ALL' as const, label: 'All Cases', count: metrics.total, 
            icon: <Inbox className="w-4 h-4" />, 
            subtext: 'Complete investigation queue',
            badgeColor: 'bg-blue-600 text-white',
            activeColor: 'text-blue-600 dark:text-sky-400 border-blue-600 dark:border-sky-400'
          },
          { 
            id: Verdict.MALICIOUS, filter: Verdict.MALICIOUS, label: 'Malicious', count: metrics.malicious, 
            icon: <AlertTriangle className="w-4 h-4" />,
            subtext: 'Confirmed threats requiring action',
            badgeColor: 'bg-rose-600 text-white',
            activeColor: 'text-rose-600 dark:text-rose-400 border-rose-600 dark:border-rose-400'
          },
          { 
            id: Verdict.SUSPICIOUS, filter: Verdict.SUSPICIOUS, label: 'Suspicious', count: metrics.suspicious, 
            icon: <ShieldAlert className="w-4 h-4" />,
            subtext: 'Anomalies under investigation',
            badgeColor: 'bg-amber-600 text-white',
            activeColor: 'text-amber-600 dark:text-amber-400 border-amber-600 dark:border-amber-400'
          },
          { 
            id: Verdict.BENIGN, filter: Verdict.BENIGN, label: 'Benign', count: metrics.benign, 
            icon: <CheckCircle2 className="w-4 h-4" />,
            subtext: 'Verified safe communications',
            badgeColor: 'bg-emerald-600 text-white',
            activeColor: 'text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400'
          },
          { 
            id: Verdict.INCONCLUSIVE, filter: Verdict.INCONCLUSIVE, label: 'Inconclusive', count: metrics.inconclusive, 
            icon: <Search className="w-4 h-4" />,
            subtext: 'Awaiting further signals',
            badgeColor: 'bg-slate-500 text-white',
            activeColor: 'text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300'
          },
        ].map((tab) => {
          const isActive = casesState.verdictFilter === tab.filter;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => casesStore.setVerdictFilter(tab.filter)}
              className={`group flex items-start gap-3 px-4 py-3 min-w-[200px] max-w-[280px] border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? tab.activeColor
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className={`mt-0.5 ${isActive ? tab.activeColor : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                {tab.icon}
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <div className="flex items-center gap-2 w-full">
                  <span className={`text-sm font-semibold truncate ${isActive ? tab.activeColor : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>
                    {tab.label}
                  </span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isActive ? tab.badgeColor : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {tab.count} {tab.count === 1 ? 'case' : 'cases'}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate w-full text-left mt-0.5 font-normal">
                  {tab.subtext}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. TOOLBAR & CONTROLS CARD */}
      <div className="bg-white dark:bg-[#0c1322] rounded-xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        {/* Left: Search input (Standard height: h-9) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Case ID, Sender, Subject, IoC (press '/' to focus)..."
            value={casesState.searchQuery}
            onChange={(e) => casesStore.setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 bg-slate-50 dark:bg-[#090e1a] hover:bg-slate-100/60 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all flex items-center"
          />
          {casesState.searchQuery && (
            <button
              type="button"
              onClick={() => casesStore.setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm p-0.5 cursor-pointer leading-none"
              title="Clear search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Right: Filters & Action Buttons (All standardized to h-9 for clean baseline alignment) */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Severity Filter - h-9 */}
          <div className="h-9 inline-flex items-center gap-1.5 bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 rounded-lg px-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs">Severity:</span>
            <select
              value={casesState.severityFilter}
              onChange={(e) =>
                casesStore.setFilters({ severity: e.target.value })
              }
              aria-label="Filter by severity"
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-0 leading-tight"
            >
              <option value="ALL" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">ALL</option>
              <option value="CRITICAL" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Critical</option>
              <option value="HIGH" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">High</option>
              <option value="MEDIUM" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Medium</option>
              <option value="LOW" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Low</option>
            </select>
          </div>

          {/* Verdict Filter - h-9 */}
          <div className="h-9 inline-flex items-center gap-1.5 bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 rounded-lg px-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs">Verdict:</span>
            <select
              value={casesState.verdictFilter}
              onChange={(e) =>
                casesStore.setVerdictFilter(e.target.value as 'ALL' | Verdict)
              }
              aria-label="Filter by verdict"
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-0 leading-tight"
            >
              <option value="ALL" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">ALL</option>
              <option value={Verdict.MALICIOUS} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Malicious</option>
              <option value={Verdict.SUSPICIOUS} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Suspicious</option>
              <option value={Verdict.BENIGN} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Benign</option>
              <option value={Verdict.INCONCLUSIVE} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Inconclusive</option>
            </select>
          </div>

          {/* Density Mode - h-9 */}
          <div className="h-9 inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090e1a] p-1">
            <button
              type="button"
              onClick={() => casesStore.setDensityMode('compact')}
              className={`h-7 px-2.5 inline-flex items-center justify-center rounded-md text-xs font-medium cursor-pointer transition-colors ${
                casesState.densityMode === 'compact'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Compact
            </button>
            <button
              type="button"
              onClick={() => casesStore.setDensityMode('standard')}
              className={`h-7 px-2.5 inline-flex items-center justify-center rounded-md text-xs font-medium cursor-pointer transition-colors ${
                casesState.densityMode === 'standard'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => casesStore.setDensityMode('preview')}
              className={`h-7 px-2.5 inline-flex items-center justify-center rounded-md text-xs font-medium cursor-pointer transition-colors ${
                casesState.densityMode === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Export CSV - Standard Secondary Button (h-9) */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>

          {/* Ingest EML - Standard Primary Button (h-9) */}
          {capabilities.canCreateInvestigation && (
            <button
              type="button"
              onClick={() => uiStore.navigate('/ingest')}
              className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest .eml</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. BATCH OPERATIONS BAR (if 1+ cases selected) */}
      {selectedCount > 0 && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold">
            <CheckSquare className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>{selectedCount} case{selectedCount > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex items-center gap-2">
            {capabilities.canManageCases && <>
            {/* Standard Danger Button */}
            <button
              type="button"
              onClick={() => {
                casesStore.bulkQuarantine();
                uiStore.addToast('warning', `Quarantined ${selectedCount} cases`);
              }}
              className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-medium text-xs transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Quarantine Selected</span>
            </button>

            {/* Standard Secondary Button */}
            <button
              type="button"
              onClick={() => {
                casesStore.bulkMarkReviewed();
                uiStore.addToast('success', `Marked ${selectedCount} cases reviewed`);
              }}
              className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Mark Reviewed</span>
            </button>

            <button
              type="button"
              onClick={() => casesStore.clearSelection()}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline ml-2 cursor-pointer"
            >
              Clear
            </button>
            </>}
          </div>
        </div>
      )}

      {/* 4. MASTER TRIAGE TABLE CARD */}
      <div className="bg-white dark:bg-[#0c1322] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-[#090e1a] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[11px] select-none">
              <tr>
                <th className="w-8 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() =>
                      casesStore.selectAll(filteredCases.map((c) => c.id))
                    }
                    aria-label="Select all cases in view"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="w-24 px-3 py-3">Severity / Age</th>
                <th className="px-3 py-3">Subject / Sender</th>
                <th className="w-40 px-3 py-3">Category / Auth</th>
                <th className="w-32 px-3 py-3">Risk</th>
                <th className="w-32 px-3 py-3">Assignee / Status</th>
                <th className="w-20 px-3 pr-4 sm:pr-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Filter className="w-8 h-8 text-slate-400" />
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No cases match the active filter criteria</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Try resetting your search query or selecting ALL verdicts.
                      </p>
                      <button
                        type="button"
                        onClick={() => casesStore.resetFilters()}
                        className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 mt-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors shadow-2xs cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem, idx) => (
                  <CaseTableRow
                    key={caseItem.id}
                    caseItem={caseItem}
                    density={casesState.densityMode}
                    isSelected={casesState.selectedCaseIds.has(caseItem.id)}
                    isFocused={casesState.focusedIndex === idx}
                    onToggleSelect={(id) => casesStore.toggleSelect(id)}
                    onQuickPeek={(id) => handleQuickPeek(id)}
                    onOpenWorkspace={(item) => handleOpenWorkspace(item)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Peek Drawer */}
      <QuickPeekDrawer />
    </div>
  );
};
