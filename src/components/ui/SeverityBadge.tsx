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
          container: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-400',
          dot: 'bg-rose-500',
          icon: <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />,
        };
      case 'HIGH':
        return {
          container: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-500/40 text-orange-700 dark:text-orange-400',
          dot: 'bg-orange-500',
          icon: <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />,
        };
      case 'MEDIUM':
      case 'SUSPICIOUS':
        return {
          container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-400',
          dot: 'bg-amber-500',
          icon: <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />,
        };
      case 'LOW':
      case 'INFO':
        return {
          container: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-sky-300',
          dot: 'bg-blue-500',
          icon: <Info className="w-3 h-3 text-blue-600 dark:text-sky-400" />,
        };
      case 'SAFE':
      case 'BENIGN':
        return {
          container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          icon: <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
        };
      case 'INCONCLUSIVE':
      default:
        return {
          container: 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
          dot: 'bg-slate-400',
          icon: <HelpCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />,
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
