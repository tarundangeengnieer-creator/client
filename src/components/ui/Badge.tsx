import React from 'react';
import { cn } from '../../lib/utils.ts';

export type BadgeVariant =
  | 'default'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info'
  | 'malicious'
  | 'suspicious'
  | 'benign'
  | 'inconclusive'
  | 'outline'
  | 'crimson'
  | 'amber'
  | 'emerald'
  | 'slate';

export function getVerdictBadgeVariant(verdict: string): BadgeVariant {
  switch (verdict.toUpperCase()) {
    case 'MALICIOUS':
      return 'malicious';
    case 'SUSPICIOUS':
      return 'suspicious';
    case 'BENIGN':
      return 'benign';
    case 'INCONCLUSIVE':
      return 'inconclusive';
    default:
      return 'default';
  }
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
    critical: 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30 font-semibold',
    high: 'bg-transparent text-orange-600 dark:text-orange-400 border-orange-500/30 font-semibold',
    medium: 'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold',
    low: 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-700/60 font-medium',
    info: 'bg-transparent text-sky-600 dark:text-sky-400 border-sky-500/30 font-medium',
    malicious: 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/40 font-semibold tracking-wide',
    suspicious: 'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/40 font-semibold tracking-wide',
    benign: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-semibold tracking-wide',
    inconclusive: 'bg-transparent text-indigo-600 dark:text-indigo-400 border-indigo-500/40 font-semibold tracking-wide',
    outline: 'bg-transparent text-slate-400 border-slate-700/60',
    crimson: 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/40 font-semibold',
    amber: 'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/40 font-semibold',
    emerald: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-semibold',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
  };

  const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-1.5 py-0.2 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-sm font-bold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded font-mono border whitespace-nowrap leading-normal',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
