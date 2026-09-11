import React from 'react';
import { ProvenanceType } from '../../domain/investigator.ts';
import { FileCheck, Radio, Cpu, Sparkles, UserCheck } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

export interface ProvenanceLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: ProvenanceType;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
}

/**
 * ProvenanceLabel
 *
 * Visually enforces the strict forensic hierarchy:
 * 1. OBSERVED EVIDENCE (Cyan/Blue) - Direct ground truth from RFC 5322, raw bytes, network sockets.
 * 2. THREAT INTELLIGENCE (Purple) - Supplementary external enrichment.
 * 3. ML DETECTION (Amber) - Algorithmic prediction signals.
 * 4. AI ANALYSIS (Sky/Blue) - Bounded interpretive reasoning.
 * 5. ANALYST DECISION (Emerald) - Human investigator disposition.
 */
export const ProvenanceLabel: React.FC<ProvenanceLabelProps> = ({
  type,
  size = 'sm',
  showIcon = true,
  className,
  ...props
}) => {
  const getMeta = () => {
    switch (type) {
      case 'OBSERVED EVIDENCE':
        return {
          label: 'OBSERVED EVIDENCE',
          classes: 'bg-cyan-50 dark:bg-[#070b14] text-[#08B4ED] border-[#08B4ED]/50 shadow-[0_0_8px_rgba(8,180,237,0.12)]',
          icon: <FileCheck className="w-3 h-3 text-[#08B4ED]" />,
          tooltip: 'Authoritative Level 3 forensic artifact observed directly in message headers, MIME body, or relay network.',
        };
      case 'THREAT INTELLIGENCE':
        return {
          label: 'THREAT INTELLIGENCE',
          classes: 'bg-purple-50 dark:bg-[#0c0d1c] text-purple-600 dark:text-purple-400 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.12)]',
          icon: <Radio className="w-3 h-3 text-purple-500 dark:text-purple-400" />,
          tooltip: 'Level 4 supplementary enrichment from external reputation telemetry, GeoIP, and blocklists.',
        };
      case 'ML DETECTION':
        return {
          label: 'ML DETECTION',
          classes: 'bg-amber-50 dark:bg-[#140e06] text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.12)]',
          icon: <Cpu className="w-3 h-3 text-amber-500 dark:text-amber-400" />,
          tooltip: 'Predictive statistical inference model detection signal. Evaluated against extracted forensic features.',
        };
      case 'AI ANALYSIS':
        return {
          label: 'AI ANALYSIS',
          classes: 'bg-sky-50 dark:bg-[#07131e] text-sky-600 dark:text-sky-300 border-sky-500/40 shadow-[0_0_8px_rgba(14,165,233,0.12)]',
          icon: <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400" />,
          tooltip: 'Evidence-grounded bounded reasoning synthesis. Supports investigation; not an absolute confirmation.',
        };
      case 'ANALYST DECISION':
      default:
        return {
          label: 'ANALYST DECISION',
          classes: 'bg-emerald-50 dark:bg-[#071510] text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.12)]',
          icon: <UserCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />,
          tooltip: 'Authoritative human forensic disposition, annotation, or case decision by authorized investigator.',
        };
    }
  };

  const meta = getMeta();

  const sizeClasses = {
    xs: 'text-[9.5px] px-1.5 py-0.2 gap-1 tracking-wider',
    sm: 'text-[10.5px] px-2 py-0.5 gap-1.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-2 tracking-wider',
  };

  return (
    <span
      title={meta.tooltip}
      className={cn(
        'inline-flex items-center rounded border font-mono font-bold uppercase select-none cursor-default transition-all leading-none',
        meta.classes,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showIcon && meta.icon}
      <span>{meta.label}</span>
    </span>
  );
};
