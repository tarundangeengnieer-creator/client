import React, { useState, useRef, useEffect } from 'react';
import { uiStore } from '../../stores/ui-store.ts';
import { investigatorStore } from '../../stores/investigator-store.ts';
import {
  Compass,
  Network,
  Clock,
  Archive,
  Link2,
  ExternalLink,
  ChevronDown,
  Globe,
  Radio,
  Search,
} from 'lucide-react';
import { cn } from '../../lib/utils.ts';

export interface PivotMenuProps {
  indicator: string;
  type?: 'ip' | 'domain' | 'url' | 'hash' | 'email' | string;
  caseId?: string;
  buttonLabel?: string;
  variant?: 'button' | 'dropdown' | 'inline';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * PivotMenu
 *
 * Provides standardized forensic pivoting across AShieldER surfaces:
 * - Open in Graph (Primary action)
 * - Open in Timeline
 * - Inspect in Threat Intelligence
 * - View Supporting Evidence
 * - Link / Add to Active Case
 */
export const PivotMenu: React.FC<PivotMenuProps> = ({
  indicator,
  type = 'ip',
  caseId,
  buttonLabel = 'Pivot Investigation',
  variant = 'dropdown',
  size = 'sm',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleOpenGraph = () => {
    setIsOpen(false);
    // Focus or isolate node if in graph store
    const snapshot = investigatorStore.getSnapshot();
    const node = snapshot.graphNodes.find(
      (n) => n.value.toLowerCase() === indicator.toLowerCase() || n.id.toLowerCase() === indicator.toLowerCase()
    );
    if (node) {
      investigatorStore.selectEntity(node);
    }
    uiStore.navigate('/investigator/graph');
  };

  const handleOpenTimeline = () => {
    setIsOpen(false);
    uiStore.navigate('/investigator');
    // Select matching timeline event if exists
    const snapshot = investigatorStore.getSnapshot();
    const event = snapshot.timelineEvents.find(
      (e) => e.summary.toLowerCase().includes(indicator.toLowerCase()) || e.associated_entity_id === indicator
    );
    if (event) {
      investigatorStore.selectTimelineEvent(event);
    }
  };

  const handleInspectThreatIntel = () => {
    setIsOpen(false);
    uiStore.navigate(`/hunting?q=${encodeURIComponent(indicator)}`);
  };

  const handleViewEvidence = () => {
    setIsOpen(false);
    investigatorStore.openEvidenceInspector(true);
  };

  const handleLinkToCase = () => {
    setIsOpen(false);
    investigatorStore.openLinkModal(true);
  };

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap items-center gap-1.5 font-mono text-xs', className)}>
        <button
          type="button"
          onClick={handleOpenGraph}
          className="px-2.5 py-1 rounded bg-[#08B4ED]/10 hover:bg-[#08B4ED]/20 text-[#08B4ED] border border-[#08B4ED]/30 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="Open indicator in Entity Relationship Graph"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Open in Graph</span>
        </button>

        <button
          type="button"
          onClick={handleInspectThreatIntel}
          className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="Query global Threat Intelligence Telemetry"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Threat Intel</span>
        </button>

        <button
          type="button"
          onClick={handleOpenTimeline}
          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="View in chronological timeline"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>

        <button
          type="button"
          onClick={handleViewEvidence}
          className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="View associated forensic evidence records"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Evidence</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={menuRef} className={cn('relative inline-block font-mono text-xs select-none', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#08B4ED]/60 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
      >
        <Compass className="w-3.5 h-3.5 text-[#08B4ED]" />
        <span>{buttonLabel}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-2xl p-1.5 animate-fadeIn">
          <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800 mb-1">
            Pivot on: <span className="text-[#08B4ED] lowercase truncate block">{indicator}</span>
          </div>

          <button
            type="button"
            onClick={handleOpenGraph}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-[#070b14] text-slate-700 dark:text-slate-200 hover:text-[#08B4ED] flex items-center gap-2 transition-colors cursor-pointer text-left"
          >
            <Network className="w-3.5 h-3.5 text-[#08B4ED]" />
            <div className="min-w-0">
              <span className="font-semibold block">Open in Graph</span>
              <span className="text-[10px] text-slate-400 block font-sans">Explore connected entity graph</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleInspectThreatIntel}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-[#070b14] text-slate-700 dark:text-slate-200 hover:text-purple-500 flex items-center gap-2 transition-colors cursor-pointer text-left"
          >
            <Globe className="w-3.5 h-3.5 text-purple-500" />
            <div className="min-w-0">
              <span className="font-semibold block">Threat Intelligence</span>
              <span className="text-[10px] text-slate-400 block font-sans">Global reputation & provenance</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleOpenTimeline}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#070b14] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors cursor-pointer text-left"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <div className="min-w-0">
              <span className="font-semibold block">Open in Timeline</span>
              <span className="text-[10px] text-slate-400 block font-sans">Hop and relay timestamps</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleViewEvidence}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-[#070b14] text-slate-700 dark:text-slate-200 hover:text-emerald-500 flex items-center gap-2 transition-colors cursor-pointer text-left"
          >
            <Archive className="w-3.5 h-3.5 text-emerald-500" />
            <div className="min-w-0">
              <span className="font-semibold block">View Evidence Records</span>
              <span className="text-[10px] text-slate-400 block font-sans">Inspect tamper-evident ledger</span>
            </div>
          </button>

          <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

          <button
            type="button"
            onClick={handleLinkToCase}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#070b14] text-slate-700 dark:text-slate-200 hover:text-teal-500 flex items-center gap-2 transition-colors cursor-pointer text-left"
          >
            <Link2 className="w-3.5 h-3.5 text-teal-500" />
            <div className="min-w-0">
              <span className="font-semibold block">Link to Case</span>
              <span className="text-[10px] text-slate-400 block font-sans">Correlate with active incident</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
