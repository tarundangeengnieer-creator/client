import React from 'react';
import { cn } from '../../lib/utils.ts';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, ShieldCheck, HelpCircle } from 'lucide-react';

export type SeverityType =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'SAFE'
  | 'BENIGN'
  | 'SUSPICIOUS'
  | 'MALICIOUS'
  | 'INCONCLUSIVE'
  | string;

export interface SeverityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity: SeverityType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showDot?: boolean;
  pulse?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = false,
  showDot = false,
  pulse = false,
  className,
  ...props
}) => {
  const norm = severity.toUpperCase();

  const getStyle = () => {
    switch (norm) {
      case 'CRITICAL':
      case 'MALICIOUS':
        return {
          container: 'bg-[#0c1322] border-rose-500/40 text-rose-500 dark:text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.12)]',
          dot: 'bg-rose-500',
          icon: <ShieldAlert className="w-3 h-3 text-rose-500" />,
        };
      case 'HIGH':
        return {
          container: 'bg-[#0c1322] border-orange-500/40 text-orange-500 dark:text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.12)]',
          dot: 'bg-orange-500',
          icon: <AlertTriangle className="w-3 h-3 text-orange-500" />,
        };
      case 'MEDIUM':
      case 'SUSPICIOUS':
        return {
          container: 'bg-[#0c1322] border-amber-500/40 text-amber-500 dark:text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.12)]',
          dot: 'bg-amber-400',
          icon: <AlertCircle className="w-3 h-3 text-amber-400" />,
        };
      case 'LOW':
      case 'INFO':
        return {
          container: 'bg-[#0c1322] border-[#08B4ED]/40 text-[#08B4ED]',
          dot: 'bg-[#08B4ED]',
          icon: <Info className="w-3 h-3 text-[#08B4ED]" />,
        };
      case 'SAFE':
      case 'BENIGN':
        return {
          container: 'bg-[#0c1322] border-emerald-500/40 text-emerald-500 dark:text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.12)]',
          dot: 'bg-emerald-500',
          icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
        };
      case 'INCONCLUSIVE':
      default:
        return {
          container: 'bg-[#0c1322] border-slate-700/70 text-slate-400',
          dot: 'bg-slate-400',
          icon: <HelpCircle className="w-3 h-3 text-slate-400" />,
        };
    }
  };

  const { container, dot, icon } = getStyle();

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2 py-0.5 text-xs gap-1.5',
    lg: 'px-2.5 py-1 text-xs font-bold gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border font-mono font-semibold select-none leading-none transition-all duration-150',
        container,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dot,
            pulse || norm === 'CRITICAL' ? 'animate-pulse' : ''
          )}
        />
      )}
      {showIcon && icon}
      <span>{severity}</span>
    </span>
  );
};
