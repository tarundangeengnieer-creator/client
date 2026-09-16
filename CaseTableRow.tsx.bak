import React, { memo } from 'react';
import { CaseViewModel, TableDensityMode } from '../../domain/case.ts';
import { Verdict } from '../../contracts/backend.ts';
import { defangEmail } from '../../lib/defang.ts';
import { formatScore } from '../../lib/formatters.ts';
import {
  Eye,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  Zap,
  MoreHorizontal,
  ChevronRight,
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

    const getVerdictPill = (verdict: Verdict) => {
      switch (verdict) {
        case Verdict.MALICIOUS:
          return (
            <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Malicious</span>
            </span>
          );
        case Verdict.SUSPICIOUS:
          return (
            <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Suspicious</span>
            </span>
          );
        case Verdict.BENIGN:
          return (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Benign</span>
            </span>
          );
        case Verdict.INCONCLUSIVE:
        default:
          return (
            <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span>Inconclusive</span>
            </span>
          );
      }
    };

    const getStatusPill = (caseItem: CaseViewModel) => {
      if (caseItem.verdict === Verdict.BENIGN) {
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
            Closed
          </span>
        );
      }
      if (caseItem.verdict === Verdict.SUSPICIOUS) {
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-transparent text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold text-[11px]">
            Investigating
          </span>
        );
      }
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-transparent text-blue-600 dark:text-sky-400 border border-blue-500/30 font-semibold text-[11px]">
          Open
        </span>
      );
    };

    const baseRowClass = `group border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer select-none bg-white dark:bg-[#0c1322] ${
      isFocused
        ? 'bg-slate-50 dark:bg-slate-800/50'
        : isSelected
        ? 'bg-slate-100/90 dark:bg-slate-800/80'
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

          {/* Case Identifier */}
          <td className="w-28 px-3 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">
            #{caseItem.id}
          </td>

          {/* Subject Line */}
          <td className="px-3 font-medium text-slate-800 dark:text-slate-200 max-w-sm truncate" title={caseItem.subject}>
            {caseItem.subject}
          </td>

          {/* Sender */}
          <td className="w-56 px-3 truncate text-slate-500 dark:text-slate-400" title={caseItem.sender}>
            {defangEmail(caseItem.sender)}
          </td>

          {/* Verdict */}
          <td className="w-32 px-3">
            {getVerdictPill(caseItem.verdict)}
          </td>

          {/* Status */}
          <td className="w-28 px-3">
            {getStatusPill(caseItem)}
          </td>

          {/* Received Time */}
          <td className="w-36 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
            {getShortTime(caseItem.timestamp)}
          </td>

          {/* Actions */}
          <td className="w-16 px-3 text-right">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickPeek(caseItem.id, e);
              }}
              title="Quick Peek (Space)"
              className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

          {/* Case ID */}
          <td className="w-28 px-3 align-middle font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">
            #{caseItem.id}
          </td>

          {/* Subject & Sender */}
          <td className="px-3 align-middle">
            <div className="font-semibold text-slate-900 dark:text-white truncate max-w-md" title={caseItem.subject}>
              {caseItem.subject}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={caseItem.sender}>
              {defangEmail(caseItem.sender)}
            </div>
          </td>

          {/* Verdict */}
          <td className="w-32 px-3 align-middle">
            {getVerdictPill(caseItem.verdict)}
          </td>

          {/* Status */}
          <td className="w-28 px-3 align-middle">
            {getStatusPill(caseItem)}
          </td>

          {/* Received Time */}
          <td className="w-40 px-3 align-middle text-slate-500 dark:text-slate-400 text-[11px]">
            {getShortTime(caseItem.timestamp)}
          </td>

          {/* Actions */}
          <td className="w-20 px-3 align-middle text-right">
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickPeek(caseItem.id, e);
                }}
                title="Quick Peek (Space)"
                className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

        {/* Case ID */}
        <td className="w-28 px-3 align-top pt-3.5 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400">
          #{caseItem.id}
        </td>

        {/* Subject, Sender & IoC */}
        <td className="px-3 align-top pt-3 space-y-1">
          <div className="font-semibold text-slate-900 dark:text-white truncate max-w-lg" title={caseItem.subject}>
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

        {/* Verdict */}
        <td className="w-32 px-3 align-top pt-3.5">
          {getVerdictPill(caseItem.verdict)}
        </td>

        {/* Status */}
        <td className="w-28 px-3 align-top pt-3.5">
          {getStatusPill(caseItem)}
        </td>

        {/* Received Time */}
        <td className="w-40 px-3 align-top pt-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
          {getShortTime(caseItem.timestamp)}
        </td>

        {/* Actions */}
        <td className="w-20 px-3 align-top pt-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickPeek(caseItem.id, e);
              }}
              title="Quick Peek (Space)"
              className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
