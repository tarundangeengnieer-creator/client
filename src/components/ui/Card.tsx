import React from 'react';
import { cn } from '../../lib/utils.ts';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'primary';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ variant = 'default', className, children, ...props }) => {
  const variantStyles = {
    default: 'bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/90 shadow-xs',
    elevated: 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 shadow-sm',
    primary: 'bg-white dark:bg-[#0c1322] border border-sky-500/60 dark:border-sky-500/60 shadow-[0_0_15px_rgba(14,165,233,0.12)]',
  };

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden text-slate-900 dark:text-slate-100 transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={cn('text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('p-4 text-sm text-slate-600 dark:text-slate-300', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400', className)}
      {...props}
    >
      {children}
    </div>
  );
};
