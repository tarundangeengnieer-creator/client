import React from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { useCases } from '../../stores/cases-store.ts';
import { useCurrentRole } from '../../stores/auth-store.ts';
import { Role } from '../../features/auth/authConfig.ts';
import { useCapabilities } from '../../features/auth/capabilities.ts';
import { AshielderLogo } from '../ui/AshielderLogo.tsx';
import {
  LayoutDashboard,
  Inbox,
  Search,
  Globe,
  Archive,
  Settings,
  X,
  Sun,
  Moon,
  Shield,
  Check,
  Users,
  Link,
  Activity,
  Briefcase,
  Network,
  Clock,
  FileText
} from 'lucide-react';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  roles: Role[];
  show?: boolean;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const ui = useUI();
  const casesState = useCases();
  const currentRole = useCurrentRole();
  const totalCases = casesState.cases.length;

  const capabilities = useCapabilities();

  // Navigation items grouped by domain with consistent spacing
  const navGroups: NavGroup[] = [
    {
      title: 'Operations',
      items: [
        {
          id: 'dashboard',
          path: '/overview',
          label: 'Security Overview',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: [],
          show: true,
        },
        {
          id: 'soc-dashboard',
          path: '/soc',
          label: 'SOC Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: [],
          show: capabilities.canViewSOCDashboard,
        },
        {
          id: 'inbox',
          path: '/inbox',
          label: 'Case Inbox',
          icon: <Inbox className="w-4 h-4" />,
          badge: totalCases,
          roles: [],
          show: capabilities.canViewCases,
        },
      ],
    },
    {
      title: 'Forensics & Intel',
      items: [
        {
          id: 'investigation',
          path: '/investigation',
          label: 'Investigation',
          icon: <Search className="w-4 h-4" />,
          roles: [],
          show: capabilities.canCreateInvestigation,
        },
        {
          id: 'evidence',
          path: '/evidence',
          label: 'Evidence Vault',
          icon: <Archive className="w-4 h-4" />,
          roles: [],
          show: capabilities.canViewEvidence,
        },
        {
          id: 'threat-intel',
          path: '/hunting',
          label: 'Threat Intelligence',
          icon: <Globe className="w-4 h-4" />,
          roles: [],
          show: capabilities.canViewThreatIntel,
        },
        {
          id: 'reports',
          path: '/reports',
          label: 'Reports',
          icon: <Check className="w-4 h-4" />,
          roles: [],
          show: capabilities.canViewReports,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          id: 'users',
          path: '/admin/users',
          label: 'Users & Roles',
          icon: <Users className="w-4 h-4" />,
          roles: [],
          show: capabilities.canManageUsers,
        },
        {
          id: 'integrations',
          path: '/admin/integrations',
          label: 'Integrations',
          icon: <Link className="w-4 h-4" />,
          roles: [],
          show: capabilities.canManageSystem,
        },
        {
          id: 'audit',
          path: '/admin/audit',
          label: 'Audit Logs',
          icon: <Activity className="w-4 h-4" />,
          roles: [],
          show: capabilities.canViewAudit,
        },
        {
          id: 'settings',
          path: '/settings',
          label: 'System Settings',
          icon: <Settings className="w-4 h-4" />,
          roles: [],
          show: capabilities.canManageSystem,
        },
      ],
    },
  ];

  // If viewing a case, inject active case item into Operations group
  if (capabilities.canViewCases && ui.currentPath.startsWith('/case/')) {
    const opsGroup = navGroups[0];
    const inboxIdx = opsGroup.items.findIndex((i) => i.id === 'inbox');
    if (inboxIdx !== -1 && !opsGroup.items.some((i) => i.id === 'active-case-header')) {
      opsGroup.items.splice(inboxIdx + 1, 0, {
        id: 'active-case-header',
        path: ui.currentPath,
        label: 'ACTIVE CASE',
        icon: <Briefcase className="w-4 h-4" />,
        roles: [],
        show: true,
      });
    }
  }

  const isCurrentActive = (itemPath: string) => {
    if (itemPath === '/overview' && (ui.currentPath === '/' || ui.currentPath === '/overview')) {
      return true;
    }
    if (
      itemPath === '/inbox' &&
      (ui.currentPath === '/inbox' ||
        ui.currentPath === '/cases' ||
        ui.currentPath.startsWith('/case/'))
    ) {
      return true;
    }
    if (itemPath === '/investigation' && (ui.currentPath.startsWith('/investigation') || ui.currentPath === '/ingest')) {
      return true;
    }
    return ui.currentPath.startsWith(itemPath);
  };

  return (
    <aside
      id="app-sidebar"
      className={`fixed lg:static inset-y-0 left-0 ${ui.isSidebarCollapsed ? 'lg:w-[72px] w-60' : 'w-60'} bg-white dark:bg-[#060a14] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col justify-between select-none z-40 lg:z-20 shrink-0 h-full transition-all duration-300 ease-in-out print:hidden ${
        ui.isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className={`pt-5 pb-4 flex items-center ${ui.isSidebarCollapsed ? 'px-0 justify-center' : 'px-4.5 justify-between'}`}>
          <div
            onClick={() => uiStore.navigate('/overview')}
            className="cursor-pointer group min-w-0 transition-opacity hover:opacity-95"
            title="ASHIELDER - Feasible & Viable"
          >
            <AshielderLogo
              size={ui.isSidebarCollapsed ? 'sm' : 'md'}
              variant={ui.isSidebarCollapsed ? 'icon' : 'full'}
              theme={ui.theme === 'dark' ? 'dark' : 'light'}
            />
          </div>

          <button
            type="button"
            onClick={() => uiStore.setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2 shrink-0 cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Items with Section Dividers */}
        <nav className="px-3 py-2 space-y-4 flex-1 overflow-y-auto">
          {navGroups.map((group, groupIdx) => {
            const visibleItems = group.items.filter((item) => item.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title || groupIdx} className="space-y-1">
                {!ui.isSidebarCollapsed && group.title && (
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    {group.title}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const active = isCurrentActive(item.path);
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      type="button"
                      onClick={() => uiStore.navigate(item.path)}
                      title={ui.isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        ui.isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                      } py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                        active
                          ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 dark:bg-[#0c1322] dark:text-sky-400 dark:border-l-2 dark:border-sky-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <div className={`flex items-center ${ui.isSidebarCollapsed ? 'justify-center' : 'gap-2.5'} min-w-0`}>
                        <span className={active ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}>
                          {item.icon}
                        </span>
                        {!ui.isSidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>
                      {!ui.isSidebarCollapsed && item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono transition-colors shrink-0 ${
                            active
                              ? 'bg-transparent border border-blue-600/30 text-blue-700 dark:border-sky-400/30 dark:text-sky-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Auxiliary Section: Operational Telemetry Status */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        {!ui.isSidebarCollapsed ? (
          <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  Forensic Pipeline
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Operational • Engine v2.4
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Operational • Engine v2.4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
