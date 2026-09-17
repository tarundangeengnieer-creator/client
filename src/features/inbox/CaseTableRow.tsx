import React, { memo } from 'react';
import { CaseViewModel, TableDensityMode } from '../../domain/case.ts';
import { Verdict } from '../../contracts/backend.ts';
import { defangEmail } from '../../lib/defang.ts';
import {
  Eye,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  MoreHorizontal,
  ChevronRight,
  User,
} from 'lucide-react';

interface CaseTableRowProps {
  caseItem: CaseViewModel;
  density: TableDensityMode;
  isSelected: boolean;
  isFocused: boolean;
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onQuickPeek: (id: string, e: React.MouseEvent) => void;
  onOpenWorkspace: (caseItem: CaseViewModel, e: React.MouseEvent) => void;
}

export const CaseTableRow: React.FC<CaseTableRowProps> = memo(
  ({
    caseItem,
    density,
    isSelected,
    isFocused,
    onToggleSelect,
    onQuickPeek,
    onOpenWorkspace,
  }) => {
    const getShortTime = (iso: string) => {
      try {
        const d = new Date(iso);
        return d.toLocaleDateString([], { day: '2-digit', month: 'short' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return 'N/A';
      }
    };

    const getAgeMins = (iso: string) => {
      try {
        return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
      } catch {
        return 0;
      }
    };

    const getSeverityIcon = (severity?: string) => {
      switch (severity) {
        case 'CRITICAL': return <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />;
        case 'HIGH': return <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />;
        case 'MEDIUM': return <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
        case 'LOW': return <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />;
        default: return <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />;
      }
    };

    const getAuthBadge = (label: string, verdict?: string) => {
      if (!verdict) return null;
      switch (verdict) {
        case 'PASS':
          return (
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-transparent text-emerald-600 dark:text-emerald-400 font-bold text-[9px] border border-emerald-500/30">
              {label}:P
            </span>
          );
        case 'FAIL':
          return (
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-transparent text-rose-600 dark:text-rose-400 font-bold text-[9px] border border-rose-500/30">
              {label}:F
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-transparent text-slate-500 dark:text-slate-400 text-[9px] border border-slate-200 dark:border-slate-800">
              {label}:{verdict[0]}
            </span>
          );
      }
    };

    const getVerdictPill = (verdict: Verdict) => {
      switch (verdict) {
        case Verdict.MALICIOUS:
          return (
            <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Malicious</span>
            </span>
          );
        case Verdict.SUSPICIOUS:
          return (
            <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Suspicious</span>
            </span>
          );
        case Verdict.BENIGN:
          return (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Benign</span>
            </span>
          );
        case Verdict.INCONCLUSIVE:
        default:
          return (
            <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span>Inconclusive</span>
            </span>
          );
      }
    };

    const getStatusPill = (caseItem: CaseViewModel) => {
      if (caseItem.verdict === Verdict.BENIGN) {
        return (
          <span className="px-2 py-0.5 rounded-full bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold text-[10px] uppercase tracking-wider">
            Closed
          </span>
        );
      }
      if (caseItem.verdict === Verdict.SUSPICIOUS) {
        return (
          <span className="px-2 py-0.5 rounded-full bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold text-[10px] uppercase tracking-wider">
            Investigating
          </span>
        );
      }
      return (
        <span className="px-2 py-0.5 rounded-full bg-transparent text-blue-600 dark:text-sky-400 border border-blue-500/30 font-semibold text-[10px] uppercase tracking-wider">
          Open
        </span>
      );
    };

    const baseRowClass = `group border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer select-none bg-white dark:bg-[#0c1322] ${
      isFocused
        ? 'bg-slate-50 dark:bg-slate-800/50'
        : isSelected
        ? 'bg-slate-100/90 dark:bg-slate-800/80 border-l-2 border-l-blue-500'
        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
    }`;

    // ==========================================
    // 1. COMPACT DENSITY (38px single-line)
    // ==========================================
    if (density === 'compact') {
      return (
        <tr
          id={`case-row-${caseItem.id}`}
          className={`${baseRowClass} h-10 text-xs`}
          onClick={(e) => onOpenWorkspace(caseItem, e)}
        >
          {/* Checkbox */}
          <td
            className="w-8 px-3 text-center"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(caseItem.id, e);
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              aria-label={`Select case ${caseItem.id}`}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
            />
          </td>

          {/* Severity / Age */}
          <td className="w-24 px-3 font-medium text-slate-900 dark:text-slate-200">
            <div className="flex items-center gap-2">
              {getSeverityIcon(caseItem.severity)}
              <span className="text-[11px] font-mono text-slate-500">{getAgeMins(caseItem.timestamp)}m</span>
              {caseItem.isSlaBreached && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="SLA Breached" />
              )}
            </div>
          </td>

          {/* Subject / Sender */}
          <td className="px-3 font-medium text-slate-800 dark:text-slate-200 truncate max-w-sm" title={`${caseItem.subject} - ${caseItem.sender}`}>
            <span className="mr-2">#{caseItem.id}</span>
            {caseItem.subject}
            <span className="ml-2 text-slate-400 font-normal">({defangEmail(caseItem.sender)})</span>
          </td>

          {/* Category / Auth */}
          <td className="w-40 px-3 truncate text-slate-500 dark:text-slate-400 text-[11px]">
            {caseItem.threatCategory || 'Uncategorized'}
          </td>

          {/* Risk */}
          <td className="w-32 px-3">
            {getVerdictPill(caseItem.verdict)}
          </td>

          {/* Assignee / Status */}
          <td className="w-32 px-3 flex items-center justify-between h-10">
            <span className="truncate max-w-[80px] text-slate-500 text-[11px]">
              {caseItem.assignee || 'Unassigned'}
            </span>
            {getStatusPill(caseItem)}
          </td>

          {/* Actions */}
          <td className="w-20 px-3 pr-4 sm:pr-6 text-right">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickPeek(caseItem.id, e);
              }}
              title="Quick Peek (Space)"
              aria-label="Quick peek case details"
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
          </td>
        </tr>
      );
    }

    // ==========================================
    // 2. STANDARD DENSITY (56px two-line)
    // ==========================================
    if (density === 'standard') {
      return (
        <tr
          id={`case-row-${caseItem.id}`}
          className={`${baseRowClass} h-14 text-xs`}
          onClick={(e) => onOpenWorkspace(caseItem, e)}
        >
          {/* Checkbox */}
          <td
            className="w-8 px-3 text-center align-middle"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(caseItem.id, e);
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              aria-label={`Select case ${caseItem.id}`}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
            />
          </td>

          {/* Severity / Age */}
          <td className="w-24 px-3 align-middle">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-800 dark:text-slate-200">
                {getSeverityIcon(caseItem.severity)}
                <span>{caseItem.severity || 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                <Clock className="w-3 h-3" />
                <span>{getAgeMins(caseItem.timestamp)}m</span>
                {caseItem.isSlaBreached && (
                  <span className="ml-1 px-1 py-0.5 rounded bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/40 font-bold text-[8px] tracking-wider animate-pulse">
                    BREACH
                  </span>
                )}
              </div>
            </div>
          </td>

          {/* Subject & Sender */}
          <td className="px-3 align-middle">
            <div className="font-semibold text-slate-900 dark:text-white truncate max-w-md flex items-center gap-2" title={caseItem.subject}>
              <span className="text-blue-600 dark:text-sky-400 font-bold">#{caseItem.id}</span>
              {caseItem.subject}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={caseItem.sender}>
              {defangEmail(caseItem.sender)}
            </div>
          </td>

          {/* Category & Auth */}
          <td className="w-40 px-3 align-middle">
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mb-1">
              {caseItem.threatCategory || 'Uncategorized'}
            </div>
            <div className="flex items-center gap-1 font-mono">
              {getAuthBadge('S', caseItem.authSignals?.spf)}
              {getAuthBadge('D', caseItem.authSignals?.dkim)}
              {getAuthBadge('M', caseItem.authSignals?.dmarc)}
            </div>
          </td>

          {/* Verdict / Risk */}
          <td className="w-32 px-3 align-middle">
            <div className="flex flex-col gap-1">
              {getVerdictPill(caseItem.verdict)}
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Score: {caseItem.riskScore.toFixed(0)}
              </span>
            </div>
          </td>

          {/* Assignee / Status */}
          <td className="w-32 px-3 align-middle">
             <div className="flex flex-col gap-1.5 items-start">
               {getStatusPill(caseItem)}
               <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[80px]">{caseItem.assignee || 'Unassigned'}</span>
               </div>
             </div>
          </td>

          {/* Actions */}
          <td className="w-20 px-3 pr-4 sm:pr-6 align-middle text-right">
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickPeek(caseItem.id, e);
                }}
                title="Quick Peek (Space)"
                aria-label="Quick peek case details"
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="More case actions"
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      );
    }

    // ==========================================
    // 3. PREVIEW DENSITY (Detailed Forensic Row)
    // ==========================================
    return (
      <tr
        id={`case-row-${caseItem.id}`}
        className={`${baseRowClass} h-20 text-xs`}
        onClick={(e) => onOpenWorkspace(caseItem, e)}
      >
        {/* Checkbox */}
        <td
          className="w-8 px-3 text-center align-top pt-4"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(caseItem.id, e);
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            aria-label={`Select case ${caseItem.id}`}
            className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
          />
        </td>

        {/* Severity / Age */}
        <td className="w-24 px-3 align-top pt-3.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-800 dark:text-slate-200">
                {getSeverityIcon(caseItem.severity)}
                <span>{caseItem.severity || 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                <Clock className="w-3 h-3" />
                <span>{getShortTime(caseItem.timestamp)}</span>
              </div>
              {caseItem.isSlaBreached && (
                  <span className="w-min px-1.5 py-0.5 rounded bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/40 font-bold text-[8px] tracking-wider animate-pulse">
                    BREACHED
                  </span>
              )}
            </div>
        </td>

        {/* Subject, Sender & IoC */}
        <td className="px-3 align-top pt-3 space-y-1.5">
          <div className="font-semibold text-slate-900 dark:text-white truncate max-w-lg flex items-center gap-2" title={caseItem.subject}>
            <span className="text-blue-600 dark:text-sky-400 font-bold">#{caseItem.id}</span>
            {caseItem.subject}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>From: {defangEmail(caseItem.sender)}</span>
            {caseItem.originIp && (
              <span className="text-slate-400 dark:text-slate-500">IP: {caseItem.originIp}</span>
            )}
          </div>
          {caseItem.primaryIoc && (
            <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 bg-transparent border border-rose-500/30 px-2 py-0.5 rounded inline-block max-w-sm truncate">
              IoC: {caseItem.primaryIoc}
            </div>
          )}
        </td>

        {/* Category & Auth */}
        <td className="w-40 px-3 align-top pt-3 space-y-2">
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
              {caseItem.threatCategory || 'Uncategorized'}
            </div>
            <div className="flex items-center gap-1 font-mono">
              {getAuthBadge('S', caseItem.authSignals?.spf)}
              {getAuthBadge('D', caseItem.authSignals?.dkim)}
              {getAuthBadge('M', caseItem.authSignals?.dmarc)}
            </div>
        </td>

        {/* Verdict / Risk */}
        <td className="w-32 px-3 align-top pt-3.5 space-y-2">
           {getVerdictPill(caseItem.verdict)}
           <div className="text-[10px] font-mono flex items-center gap-1.5">
               <span className={`px-1.5 py-0.5 rounded font-bold border ${
                    caseItem.riskScore >= 90 ? 'bg-transparent text-rose-600 border-rose-500/40' :
                    caseItem.riskScore >= 75 ? 'bg-transparent text-orange-600 border-orange-500/40' :
                    'bg-transparent text-slate-600 border-slate-300'
               }`}>
                   {caseItem.riskScore.toFixed(0)} Score
               </span>
           </div>
        </td>

        {/* Assignee / Status */}
        <td className="w-32 px-3 align-top pt-3.5 space-y-2">
           {getStatusPill(caseItem)}
           <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
               <User className="w-3.5 h-3.5" />
               <span className="truncate font-medium">{caseItem.assignee || 'Unassigned'}</span>
           </div>
        </td>

        {/* Actions */}
        <td className="w-20 px-3 pr-4 sm:pr-6 align-top pt-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickPeek(caseItem.id, e);
              }}
              title="Quick Peek (Space)"
              aria-label="Quick peek case details"
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </div>
        </td>
      </tr>
    );
  }
);

CaseTableRow.displayName = 'CaseTableRow';
