import React from 'react';
import { cn } from '../../lib/utils.ts';
import { FileCheck } from 'lucide-react';

interface EvidenceChipProps {
  id: string; // e.g. "EVD-HDR-001"
  weight?: number;
  category?: string;
  onClick?: (id: string) => void;
  className?: string;
}

export const EvidenceChip: React.FC<EvidenceChipProps> = ({
  id,
  weight,
  category,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id);
      }}
      title={`Inspect Evidence ${id}${category ? ` (${category})` : ''}${weight !== undefined ? ` [Risk Weight: +${weight}]` : ''}`}
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono font-medium',
        'bg-[#0c1322] hover:bg-[#0f172a] text-[#08B4ED] hover:text-[#08B4ED] border border-slate-700 hover:border-[#08B4ED]/60',
        'transition-all duration-150 cursor-pointer select-none leading-none',
        className
      )}
    >
      <FileCheck className="w-3 h-3 text-[#08B4ED]" />
      <span>{id}</span>
      {weight !== undefined && weight > 0 && (
        <span className="text-amber-400 font-semibold text-[10px]">+{weight}</span>
      )}
    </button>
  );
};
