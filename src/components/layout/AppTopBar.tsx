import React, { useState, useRef, useEffect } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { casesStore } from '../../stores/cases-store.ts';
import { useAuth, authStore } from '../../stores/auth-store.ts';
import { Role } from '../../features/auth/authConfig.ts';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Menu,
  Sun,
  Moon,
  Check,
  User,
  LogOut,
  Settings,
  Keyboard,
  ShieldAlert,
  AlertTriangle,
  Info,
  X,
  Radio,
  Sparkles,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'warning' | 'info';
  unread: boolean;
  caseId?: string;
  path?: string;
}

interface TenantItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  icon: typeof Building2;
}

export const AppTopBar: React.FC = () => {
  const ui = useUI();
  const auth = useAuth();
  
  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Notification tab filter: 'all' | 'unread'
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

  // Interactive Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'High-Confidence Threat',
      message: 'Case #A2291 flagged for PayPal brand impersonation and Tor exit origin.',
      time: '10:42 AM',
      type: 'critical',
      unread: true,
      caseId: 'A2291',
      path: '/case/A2291',
    },
    {
      id: 'notif-2',
      title: 'IOC Correlation Match',
      message: 'Malicious domain login-secure-update.com detected across 3 recent inbound emails.',
      time: '09:15 AM',
      type: 'warning',
      unread: true,
      path: '/inbox',
    },
    {
      id: 'notif-3',
      title: 'Autonomous Triage Complete',
      message: 'Ingest specimen RFC-822 verified benign with zero heuristics triggers.',
      time: 'Yesterday',
      type: 'info',
      unread: false,
      path: '/investigation',
    },
  ]);

  // Interactive Tenants State
  const tenants: TenantItem[] = [
    {
      id: 'cdgi-soc',
      name: 'CDGI SOC',
      subtitle: 'Primary L2 Production Partition',
      badge: 'Production',
      icon: Building2,
    },
    {
      id: 'sandbox',
      name: 'Enterprise Sandbox',
      subtitle: 'Threat Replay & Rule Validation',
      badge: 'Staging',
      icon: Shield,
    },
    {
      id: 'emea-soc',
      name: 'EMEA Regional SOC',
      subtitle: 'Tier 1 Ingest & Escalations',
      badge: 'Regional',
      icon: Layers,
    },
  ];
  const [activeTenantId, setActiveTenantId] = useState<string>('cdgi-soc');

  // Duty status state
  const [dutyStatus, setDutyStatus] = useState<'on_duty' | 'away'>('on_duty');

  // Refs for click outside handling
  const notificationsRef = useRef<HTMLDivElement>(null);
  const tenantRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (tenantRef.current && !tenantRef.current.contains(target)) {
        setShowTenantMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowTenantMenu(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isCaseDetail = ui.currentPath.startsWith('/case');
  const isInbox = ui.currentPath === '/inbox' || ui.currentPath === '/cases';
  const isOverview = ui.currentPath === '/' || ui.currentPath === '/overview';
  const isInvestigation = ui.currentPath.startsWith('/investigation') || ui.currentPath === '/ingest';

  const activeCaseId = ui.activeCaseId || 'A2291';
  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];
  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredNotifications = notifFilter === 'unread' ? notifications.filter((n) => n.unread) : notifications;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    casesStore.setSearchQuery(val);
  };

  // Notification actions
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    uiStore.addToast('info', 'All notifications marked as read');
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    setShowNotifications(false);

    if (item.path) {
      if (item.caseId) {
        uiStore.setActiveCase(item.caseId, 'Security Alert Case');
      }
      uiStore.navigate(item.path);
    }
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Tenant switch action
  const handleSelectTenant = (tenant: TenantItem) => {
    setActiveTenantId(tenant.id);
    setShowTenantMenu(false);
    uiStore.addToast('success', `Switched active workspace to ${tenant.name}`);
  };

  // Sign out action
  const handleSignOut = () => {
    setShowUserMenu(false);
    authStore.logout();
    uiStore.addToast('info', 'Signed out of ASHIELDER SOC Workstation');
    uiStore.navigate('/login');
  };

  return (
    <header
      id="app-topbar"
      className="bg-white dark:bg-[#0a0f1d] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between select-none z-10 shrink-0 shadow-xs min-w-0 theme-transition print:hidden"
    >
      {/* Left: Dynamic Page Title / Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 mr-3">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => uiStore.toggleMobileSidebar()}
          className="lg:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
          aria-label="Toggle mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop menu toggle */}
        <button
          type="button"
          onClick={() => uiStore.toggleSidebarCollapsed()}
          className="hidden lg:block p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
          aria-label="Toggle desktop navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {ui.currentPath.startsWith('/investigator') ? (
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 truncate">
              Investigator Workspace
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate hidden sm:block">
              Multi-hop entity relationship graph & chronological timeline
            </p>
          </div>
        ) : isInvestigation ? (
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-bold text-black dark:text-white tracking-tight">Investigation</span>
          </div>
        ) : isCaseDetail ? (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 min-w-0">
            <button
              type="button"
              onClick={() => uiStore.navigate('/inbox')}
              className="hover:text-blue-600 dark:hover:text-sky-400 font-medium transition-colors cursor-pointer shrink-0"
            >
              Inbox / Cases
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span
              className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap"
              title={`Case #${activeCaseId}`}
            >
              Case #{activeCaseId && activeCaseId.length > 12 ? `${activeCaseId.slice(0, 8)}…` : activeCaseId}
            </span>
          </div>
        ) : isInbox ? (
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight block">Case Inbox</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 whitespace-normal sm:whitespace-nowrap">Threat evaluation & operational triage queue</p>
          </div>
        ) : isOverview ? (
          null
        ) : ui.currentPath.startsWith('/soc') ? (
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate block">SOC Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate hidden sm:block">Email threat triage &amp; operational telemetry</p>
          </div>
        ) : (
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight capitalize truncate block">
              {ui.currentPath.replace('/', '')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate hidden sm:block">Forensic Workstation Module</p>
          </div>
        )}
      </div>

      {/* Right: Search, Theme Toggle, Notifications, Tenant, User, Operational Status */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search Bar: Explicitly communicates security artifact capabilities */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-header-search"
            type="text"
            placeholder="Search IP, Domain, URL, Hash, Email, Case ID, MITRE ID..."
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isInbox) {
                uiStore.navigate('/inbox');
              }
            }}
            className="w-48 lg:w-64 xl:w-80 2xl:w-96 pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0e1627] hover:bg-slate-100/70 dark:hover:bg-[#131d33] focus:bg-white dark:focus:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* AI Copilot Button */}
        <button
          type="button"
          onClick={() => uiStore.openCopilot(true)}
          className="relative flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800 font-semibold text-xs"
          title="Open AI Investigation Copilot"
        >
          <Sparkles className="w-4 h-4 transition-transform hover:rotate-12 shrink-0" />
          <span className="hidden sm:inline">Copilot</span>
        </button>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          id="header-theme-toggle-btn"
          type="button"
          onClick={() => uiStore.toggleTheme()}
          className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
          title={ui.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {ui.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:text-blue-600 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* 1. Notifications Bell Component */}
        <div className="relative" ref={notificationsRef}>
          <button
            id="header-notifications-btn"
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowTenantMenu(false);
              setShowUserMenu(false);
            }}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              showNotifications
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70'
            }`}
            title="Notifications"
            aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs"
                aria-hidden="true"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-84 sm:w-96 bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 text-xs overflow-hidden animate-fadeIn">
              {/* Notifications Header */}
              <div className="p-3 bg-slate-50/80 dark:bg-[#090e1c] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-transparent border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Segmented Filter: All vs Unread */}
              <div className="flex items-center gap-2 px-3 pt-2.5 pb-1 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0d1527]">
                <button
                  type="button"
                  onClick={() => setNotifFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    notifFilter === 'all'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotifFilter('unread')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    notifFilter === 'unread'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-medium text-xs">No notifications to display</p>
                    <p className="text-[11px] mt-0.5">All threat feeds and operational alerts are caught up</p>
                  </div>
                ) : (
                  filteredNotifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3 flex items-start gap-3 transition-colors cursor-pointer relative group ${
                        item.unread
                          ? 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Status Icon */}
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'critical' ? (
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </div>
                        ) : item.type === 'warning' ? (
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Info className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`font-semibold text-xs truncate ${
                              item.type === 'critical'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>

                      {/* Unread indicator dot & dismiss button */}
                      <div className="shrink-0 flex items-center gap-1.5 pt-1">
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => dismissNotification(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-opacity cursor-pointer"
                          title="Dismiss notification"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Notifications Footer */}
              <div className="p-2.5 bg-slate-50 dark:bg-[#090e1c] border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    uiStore.navigate('/inbox');
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  View all in Case Inbox →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. User Avatar & Account Dropdown (Consolidated context) */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="header-user-menu-btn"
            type="button"
            onClick={() => {
              setShowUserMenu((prev) => !prev);
              setShowNotifications(false);
              setShowTenantMenu(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1627] hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
            title={`${auth.currentUser?.name || 'User'} Profile & Organization`}
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-[#1a68ff] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 uppercase">
                {(auth.currentUser?.name || 'U')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              {/* Duty status pulsating dot */}
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-[#0a0f1d] ${
                  dutyStatus === 'on_duty' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <div className="hidden sm:flex flex-col text-left min-w-0 leading-tight">
              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                {auth.currentUser?.name || 'Analyst'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                {auth.currentRole === Role.INVESTIGATOR ? 'Investigator' : (auth.currentRole || 'SOC Analyst')}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                showUserMenu ? 'rotate-180 text-blue-600 dark:text-sky-400' : ''
              }`}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-30 text-xs animate-fadeIn">
              {/* User Identity & Organization Header */}
              <div className="p-3 bg-slate-50/70 dark:bg-[#090e1c] rounded-lg border border-slate-100 dark:border-slate-800/80 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#1a68ff] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 uppercase">
                    {(auth.currentUser?.name || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {auth.currentUser?.name || 'Unknown User'}
                      </span>
                      {auth.currentRole && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-transparent text-sky-600 dark:text-sky-400 border border-sky-500/30 rounded">
                          {auth.currentRole.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                      {auth.currentUser?.email || ''}
                    </p>
                  </div>
                </div>

                {/* Organization / Tenant Info */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Organization:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]" title={auth.currentTenant?.name || 'Acme Security Operations'}>
                      {auth.currentTenant?.name || 'Acme Security Operations'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Platform:</span>
                    <span className="font-mono font-bold text-[10px] text-blue-600 dark:text-sky-400">ASHIELDER v2.4</span>
                  </div>
                </div>

                {/* Duty Status Selector */}
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Analyst Status:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = dutyStatus === 'on_duty' ? 'away' : 'on_duty';
                      setDutyStatus(next);
                      uiStore.addToast('info', `Duty status updated: ${next === 'on_duty' ? 'On Duty' : 'Away'}`);
                    }}
                    className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dutyStatus === 'on_duty' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    <span>{dutyStatus === 'on_duty' ? 'Active / On Duty' : 'Away / Standby'}</span>
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    uiStore.navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left font-medium"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account & SOC Preferences</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    uiStore.navigate('/overview');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left font-medium"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>SOC Security Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                    ?
                  </kbd>
                </button>
              </div>

              {/* Sign Out Divider & Button */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

