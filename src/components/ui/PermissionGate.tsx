import React from 'react';
import { Permission } from '../../features/auth/authConfig.ts';
import { hasPermission } from '../../stores/auth-store.ts';
import { Lock, ArrowRight } from 'lucide-react';

export interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onRequestAccess?: () => void;
  hideCompletely?: boolean;
}

/**
 * PermissionGate
 *
 * Declarative component for fine-grained capability and role separation.
 * When the active user lacks the required permission:
 * - If hideCompletely is true, renders null.
 * - Otherwise, renders a restrained, professional access-denied card
 *   adhering to Section 18 of AShieldER UX guidelines without revealing
 *   sensitive implementation details or exposing disabled controls.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallbackTitle = 'Restricted Capability',
  fallbackMessage = 'You do not have authorized permissions to view or execute this operation.',
  onRequestAccess,
  hideCompletely = false,
}) => {
  const allowed = hasPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  if (hideCompletely) {
    return null;
  }

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] shadow-xs font-mono select-none">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {fallbackTitle}
            </h4>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold">
              Restricted
            </span>
          </div>
          <p className="text-[11.5px] font-sans text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {fallbackMessage}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onRequestAccess) {
                  onRequestAccess();
                } else {
                  alert('Access request logged for Tenant Admin review.');
                }
              }}
              className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Request Access</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              (Requires SOC Lead or Platform Admin approval)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
