import React from 'react';
import { cn } from '../../lib/utils.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b14] disabled:opacity-50 disabled:pointer-events-none rounded cursor-pointer whitespace-nowrap select-none';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-sky-700 hover:bg-sky-600 text-white font-semibold shadow-xs border border-sky-400/40 shadow-[0_0_10px_rgba(14,165,233,0.15)]',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-[#0c1322] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80',
    outline: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700',
    danger: 'bg-[#0c1322] hover:bg-rose-950/40 text-rose-500 dark:text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs h-7 px-2.5 gap-1.5',
    md: 'text-sm h-9 px-3.5 gap-2',
    lg: 'text-base h-11 px-5 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
