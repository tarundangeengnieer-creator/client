import React from 'react';
import { cn } from '../../lib/utils.ts';

export interface MitreBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  technique?: string; // e.g. "T1204.001 - User Execution: Malicious Link"
  techniqueId?: string; // e.g. "T1204.001"
  techniqueName?: string; // e.g. "User Execution"
  highlight?: string; // e.g. "Malicious Link"
  size?: 'sm' | 'md';
  semanticTone?: 'amber' | 'danger' | 'primary' | 'neutral';
}

/**
 * Parses full MITRE technique text into structured parts:
 * Example: "T1204.001 - User Execution: Malicious Link"
 * -> id: "T1204.001", prefix: "User Execution", highlight: "Malicious Link"
 */
function parseMitreTechnique(raw: string): { id: string; middle: string; highlight: string } {
  const trimmed = raw.trim();
  
  // Format: "Txxxx.xxx - Category: Specific Technique"
  const colonMatch = trimmed.match(/^([T\d.]+)\s*-\s*([^:]+):\s*(.+)$/);
  if (colonMatch) {
    return {
      id: colonMatch[1],
      middle: colonMatch[2] + ': ',
      highlight: colonMatch[3],
    };
  }

  // Format: "Txxxx.xxx - Technique Name"
  const dashMatch = trimmed.match(/^([T\d.]+)\s*-\s*(.+)$/);
  if (dashMatch) {
    return {
      id: dashMatch[1],
      middle: '',
      highlight: dashMatch[2],
    };
  }

  // Fallback
  return {
    id: trimmed,
    middle: '',
    highlight: '',
  };
}

/**
 * Official AShieldER MITRE ATT&CK Metadata Badge
 * Faithfully reproduces the approved reference design from media_1789070621647.png:
 * - Dark neutral container (`bg-slate-900` / `#0c1322`)
 * - Thin AShieldER primary border (`border-sky-500/60`)
 * - Subtle primary glow (`shadow-[0_0_12px_rgba(14,165,233,0.15)]`)
 * - Left vertical primary accent pip (`w-1 h-3.5 bg-sky-400 rounded-full`)
 * - "MITRE:" prefix in bold primary cyan/sky
 * - High-contrast monospace ID and category text
 * - Restrained semantic highlight (amber/danger) for the threat payload
 */
export const MitreBadge: React.FC<MitreBadgeProps> = ({
  technique,
  techniqueId,
  techniqueName,
  highlight,
  size = 'md',
  semanticTone = 'amber',
  className,
  ...props
}) => {
  const parsed = technique ? parseMitreTechnique(technique) : null;
  const id = techniqueId || parsed?.id || '';
  const middle = techniqueName ? `${techniqueName}: ` : parsed?.middle || '';
  const finalHighlight = highlight || parsed?.highlight || '';

  const toneClasses: Record<string, string> = {
    amber: 'text-amber-400 font-semibold',
    danger: 'text-rose-400 font-semibold',
    primary: 'text-sky-300 font-semibold',
    neutral: 'text-slate-200 font-normal',
  };

  const isSmall = size === 'sm';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg select-none font-mono transition-all duration-150',
        'bg-[#0c1322] border border-[#08B4ED]/60 shadow-[0_0_12px_rgba(8,180,237,0.15)]',
        'hover:border-[#08B4ED] hover:shadow-[0_0_16px_rgba(8,180,237,0.25)]',
        isSmall ? 'gap-1.5 px-2.5 py-1 text-[11px]' : 'gap-2 px-3 py-1.5 text-xs',
        className
      )}
      {...props}
    >
      {/* Left primary vertical accent pip */}
      <span
        className={cn(
          'rounded-full bg-[#08B4ED] shrink-0',
          isSmall ? 'w-1 h-3' : 'w-1 h-3.5'
        )}
        aria-hidden="true"
      />

      {/* "MITRE:" Prefix */}
      <span className="text-[#08B4ED] font-bold tracking-tight shrink-0">
        MITRE:
      </span>

      {/* Technique ID & Middle Name */}
      <span className="text-slate-100 whitespace-nowrap">
        {id} {middle && <span>- {middle}</span>}
      </span>

      {/* Semantic Highlight */}
      {finalHighlight && (
        <span className={cn(toneClasses[semanticTone] || toneClasses.amber, 'truncate')}>
          {!middle && '- '}
          {finalHighlight}
        </span>
      )}
    </div>
  );
};
