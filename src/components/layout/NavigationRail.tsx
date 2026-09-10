import React from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { AshielderLogo } from '../ui/AshielderLogo.tsx';
import {
  Mail,
  UploadCloud,
  Crosshair,
  Activity,
  Settings,
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export const NavigationRail: React.FC = () => {
  const ui = useUI();

  const navItems: NavItem[] = [
    {
      id: 'inbox',
      path: '/inbox',
      label: 'Case Inbox (Triage Queue)',
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: 'ingest',
      path: '/ingest',
      label: 'Ingest .EML (RFC 822 Dropzone)',
      icon: <UploadCloud className="w-5 h-5" />,
    },
    {
      id: 'case',
      path: ui.activeCaseId ? `/case/${ui.activeCaseId}` : '/inbox',
      label: ui.activeCaseId ? `Active Case (${ui.activeCaseId})` : 'Active Case (None Selected)',
      icon: <Mail className="w-5 h-5" />,
      disabled: !ui.activeCaseId,
    },
    {
      id: 'hunting',
      path: '/hunting',
      label: 'Threat Hunting (Indicator Pivot)',
      icon: <Crosshair className="w-5 h-5" />,
    },
  ];

  const bottomItems: NavItem[] = [
    {
      id: 'health',
      path: '/admin/health',
      label: 'System Health & Telemetry',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'settings',
      path: '/settings',
      label: 'Workstation Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/inbox' && (ui.currentPath === '/' || ui.currentPath === '/inbox')) return true;
    return ui.currentPath.startsWith(path);
  };

  return (
    <aside className="w-14 bg-slate-950 border-r border-slate-800/80 flex flex-col items-center justify-between py-3 select-none z-20 shrink-0">
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Brand Emblem */}
        <button
          type="button"
          onClick={() => uiStore.navigate('/overview')}
          className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center cursor-pointer hover:border-sky-500/50 transition-all shadow-md shrink-0 mb-1"
          title="ASHIELDER — Feasible & Viable"
        >
          <AshielderLogo variant="icon" size="sm" theme="light" />
        </button>

        {/* Top Main Navigation Group */}
        <nav className="flex flex-col items-center gap-1.5 w-full">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => uiStore.navigate(item.path)}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer group ${
                active
                  ? 'bg-sky-950/80 text-sky-400 border border-sky-500/50 shadow-xs'
                  : item.disabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
              title={item.label}
            >
              {item.icon}

              {/* Active rail indicator line */}
              {active && (
                <span className="absolute -left-2 top-2 bottom-2 w-1 bg-sky-400 rounded-r" />
              )}
            </button>
          );
        })}
        </nav>
      </div>

      {/* Bottom Secondary Group */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {/* Copilot shortcut */}
        <button
          type="button"
          onClick={() => uiStore.openCopilot(!ui.isCopilotOpen)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            ui.isCopilotOpen
              ? 'bg-sky-950 text-sky-300 border border-sky-500 shadow-xs'
              : 'text-slate-400 hover:text-sky-300 hover:bg-slate-900 border border-transparent'
          }`}
          title="Toggle AI Copilot"
        >
          <Sparkles className="w-5 h-5 text-sky-400" />
        </button>

        <div className="w-6 h-px bg-slate-800 my-1" />

        {bottomItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => uiStore.navigate(item.path)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                active
                  ? 'bg-sky-950/80 text-sky-400 border border-sky-500/50 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
