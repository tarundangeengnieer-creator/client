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

export const Sidebar: React.FC = () => {
  const ui = useUI();
  const casesState = useCases();
  const currentRole = useCurrentRole();
  const totalCases = casesState.cases.length;

  const capabilities = useCapabilities();

  // Primary Navigation items mapped to capabilities
  const allNavItems: NavItem[] = [
    {
      id: 'dashboard',
      path: '/overview',
      label: 'Security Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: [], // Not used anymore, relying on cap filters
      show: true // Everyone sees overview
    },
    {
      id: 'soc-dashboard',
      path: '/soc',
      label: 'SOC Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: [],
      show: capabilities.canViewSOCDashboard
    },
    {
      id: 'inbox',
      path: '/inbox',
      label: 'Case Inbox',
      icon: <Inbox className="w-4 h-4" />,
      badge: totalCases,
      roles: [],
      show: capabilities.canViewCases
    },
    {
      id: 'investigation',
      path: '/investigation',
      label: 'Investigation',
      icon: <Search className="w-4 h-4" />,
      roles: [],
      show: capabilities.canCreateInvestigation
    },
    {
      id: 'evidence',
      path: '/evidence',
      label: 'Evidence Vault',
      icon: <Archive className="w-4 h-4" />,
      roles: [],
      show: capabilities.canViewEvidence
    },
    {
      id: 'threat-intel',
      path: '/hunting',
      label: 'Threat Intelligence',
      icon: <Globe className="w-4 h-4" />,
      roles: [],
      show: capabilities.canViewThreatIntel
    },
    {
      id: 'reports',
      path: '/reports',
      label: 'Reports',
      icon: <Check className="w-4 h-4" />,
      roles: [],
      show: capabilities.canViewReports
    },
    {
      id: 'users',
      path: '/admin/users',
      label: 'Users & Roles',
      icon: <Users className="w-4 h-4" />,
      roles: [],
      show: capabilities.canManageUsers
    },
    {
      id: 'integrations',
      path: '/admin/integrations',
      label: 'Integrations',
      icon: <Link className="w-4 h-4" />,
      roles: [],
      show: capabilities.canManageSystem
    },
    {
      id: 'audit',
      path: '/admin/audit',
      label: 'Audit Logs',
      icon: <Activity className="w-4 h-4" />,
      roles: [],
      show: capabilities.canViewAudit
    },
    {
      id: 'settings',
      path: '/settings',
      label: 'System Settings',
      icon: <Settings className="w-4 h-4" />,
      roles: [],
      show: capabilities.canManageSystem
    },
  ];

  let navItems = allNavItems.filter((item) => item.show);

  // If we are looking at a case, dynamically add the "Active Case" item for EVERYONE who can view cases
  if (capabilities.canViewCases && ui.currentPath.startsWith('/case/')) {
    navItems.splice(navItems.findIndex(i => i.id === 'inbox') + 1, 0, {
      id: 'active-case-header',
      path: ui.currentPath,
      label: 'ACTIVE CASE',
      icon: <Briefcase className="w-4 h-4" />,
      roles: [],
      show: true
    });
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

        {/* Main Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const active = isCurrentActive(item.path);
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => uiStore.navigate(item.path)}
                title={ui.isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${ui.isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                  active
                    ? 'bg-slate-100 text-[#08B4ED] font-semibold border-l-2 border-[#08B4ED] dark:bg-[#0c1322] dark:text-[#08B4ED] dark:border-l-2 dark:border-[#08B4ED] dark:shadow-[0_0_12px_rgba(8,180,237,0.16)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                }`}
              >
                <div className={`flex items-center ${ui.isSidebarCollapsed ? 'justify-center' : 'gap-3'} min-w-0`}>
                  <span className={active ? 'text-[#08B4ED]' : 'text-slate-500 dark:text-slate-400'}>
                    {item.icon}
                  </span>
                  {!ui.isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
                {!ui.isSidebarCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono transition-colors shrink-0 ${
                      active
                        ? 'bg-transparent border border-[#08B4ED]/40 text-[#08B4ED]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Auxiliary Section matching Reference Image */}
      <div className={`p-3 ${ui.isSidebarCollapsed ? 'space-y-0' : 'space-y-2'}`}>
        {/* Bottom Card: "AI-Powered Email Forensic Intelligence, Safer Institutions, Stronger India" with India map silhouette */}
        {!ui.isSidebarCollapsed && (
          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#edf3f9]/70 dark:bg-slate-900/80 p-3.5 flex items-center justify-between gap-2 overflow-hidden shadow-2xs">
            <div className="min-w-0 pr-1">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                AI-Powered Email Forensic Intelligence
              </p>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                Safer Institutions
              </p>
              <p className="text-[11px] font-bold text-[#1a68ff] dark:text-sky-400 leading-tight">
                Stronger India
              </p>
            </div>

            {/* India SVG Silhouette matching exact coordinates */}
            <div className="w-11 h-12 shrink-0 opacity-80 dark:opacity-60 flex items-center justify-center">
              <svg
                viewBox="550 113 68 64"
                className="w-full h-full text-slate-400 dark:text-slate-500 fill-current"
              >
                <path d="M616.286,130.136L616.446,130.979L615.67,131.385L615.854,132.754L614.262,132.352L611.39,133.886L611.454,135.158L610.23,137.023L610.118,138.106L609.126,139.938L607.39,139.43L607.302,141.732L606.798,142.488L607.038,143.432L605.942,143.959L604.766,140.435L604.158,140.442L603.79,141.86L602.574,140.709L603.262,139.445L604.254,139.317L605.278,137.437L603.998,137.057L601.942,137.087L599.822,136.782L599.63,135.24L598.566,135.127L596.806,134.168L596.022,135.677L597.622,136.854L596.238,137.681L595.742,138.49L597.11,139.088L596.734,140.427L597.502,142.097L597.846,143.925L597.534,144.737L596.022,144.711L593.278,145.17L593.406,146.844L592.222,148.156L589.022,149.653L586.534,152.267L584.862,153.67L582.654,155.126L582.646,156.145L581.542,156.694L579.534,157.492L578.502,157.608L577.83,159.301L578.294,162.193L578.414,164.036L577.47,166.146L577.462,169.923L576.31,170.032L575.302,171.724L575.974,172.458L573.95,173.09L573.206,174.598L572.31,175.237L570.206,173.161L569.182,170.051L568.326,167.809L567.55,166.76L566.366,164.623L565.814,161.844L565.43,160.456L563.406,157.405L562.486,153.099L561.822,150.255L561.83,147.562L561.398,145.482L558.166,146.81L556.598,146.547L553.702,143.854L554.766,143.049L554.11,142.176L551.502,140.292L552.982,138.806L557.878,138.813L557.43,136.907L556.182,135.778L555.934,134.067L554.478,133.07L556.926,130.742L559.51,130.911L561.83,128.579L563.222,126.326L565.382,124.096L565.35,122.512L567.238,121.226L565.446,120.128L564.678,118.623L563.886,116.679L564.982,115.719L568.35,116.261L570.83,115.93L572.974,114.065L575.358,116.667L575.134,118.48L576.022,119.62L575.95,120.752L574.35,120.455L574.974,122.903L577.158,124.31L580.246,125.864L578.838,126.872L577.974,128.952L580.126,129.794L582.222,130.881L585.118,132.13L588.166,132.416L589.446,133.548L591.166,133.758L593.838,134.277L595.686,134.24L595.942,133.36L595.654,131.949L595.822,130.99L597.182,130.524L597.366,132.273L597.414,132.72L599.43,133.563L600.83,133.217L602.702,133.363L604.518,133.3L604.678,131.934L603.774,131.223L605.566,130.945L607.582,129.294L610.15,127.88L612.014,128.425L613.598,127.488L614.638,128.869L613.886,129.802Z" />
              </svg>
            </div>
          </div>
        )}

        {/* Quick theme mode toggle in sidebar footer */}
        <div className={`flex items-center ${ui.isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-2'} pt-1 text-slate-500 dark:text-slate-400`}>
          {!ui.isSidebarCollapsed && (
            <span className="text-[10.5px] font-medium">Theme Mode</span>
          )}
          <button
            type="button"
            onClick={() => uiStore.toggleTheme()}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {ui.theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
