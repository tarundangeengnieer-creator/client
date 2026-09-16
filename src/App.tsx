import React, { useEffect } from 'react';
import { useAuth, authStore, hasRole } from './stores/auth-store.ts';
import { useUI, uiStore } from './stores/ui-store.ts';
import { AppShell } from './components/layout/AppShell.tsx';
import { ErrorBoundary } from './components/feedback/ErrorBoundary.tsx';
import { NotFoundPage } from './components/feedback/NotFoundPage.tsx';
import { ForbiddenPage } from './components/feedback/ForbiddenPage.tsx';
import { LoginPage } from './features/auth/LoginPage.tsx';
import { SecurityOverviewPage } from './features/dashboard/SecurityOverviewPage.tsx';
import { CaseInboxPage } from './features/inbox/CaseInboxPage.tsx';
import { CaseDetailPage } from './features/case/CaseDetailPage.tsx';
import { DropzonePage } from './features/ingest/DropzonePage.tsx';
import { InvestigationPage } from './features/investigation/InvestigationPage.tsx';
import { HuntingPlaceholder } from './features/hunting/HuntingPlaceholder.tsx';
import { HealthPlaceholder } from './features/admin/HealthPlaceholder.tsx';
import { SettingsPlaceholder } from './features/settings/SettingsPlaceholder.tsx';
import { ForensicReportPage } from './features/reports/ForensicReportPage.tsx';
import { InvestigatorWorkspace } from './features/investigator/InvestigatorWorkspace.tsx';
import { GraphInvestigationPage } from './features/investigator/components/ThreatIntelPanel.tsx';
import { EvidencePage } from './features/investigation/components/evidence/EvidencePage.tsx';
import { TimelinePage } from './features/investigation/components/timeline/TimelinePage.tsx';
import { SOCWorkspace } from './features/soc/SOCWorkspace.tsx';
import { Role } from './features/auth/authConfig.ts';

// Using HealthPlaceholder for missing admin routes since they share the same structure
const UsersPlaceholder = () => <HealthPlaceholder />;
const IntegrationsPlaceholder = () => <HealthPlaceholder />;
const AuditPlaceholder = () => <HealthPlaceholder />;

// Route mapping to required roles
const ROUTE_ACCESS: Record<string, Role[]> = {
  '/overview': [Role.SOC_ANALYST, Role.INVESTIGATOR, Role.IT_ADMIN, Role.FRAUD_IR, Role.ADMIN],
  '/soc': [Role.SOC_ANALYST, Role.INVESTIGATOR, Role.ADMIN],
  '/investigator': [Role.INVESTIGATOR, Role.FRAUD_IR, Role.ADMIN],
  '/inbox': [Role.SOC_ANALYST, Role.INVESTIGATOR, Role.FRAUD_IR],
  '/cases': [Role.SOC_ANALYST, Role.INVESTIGATOR, Role.FRAUD_IR],
  '/investigation': [Role.SOC_ANALYST, Role.INVESTIGATOR, Role.FRAUD_IR],
  '/evidence': [Role.INVESTIGATOR, Role.FRAUD_IR],
  '/reports': [Role.INVESTIGATOR, Role.FRAUD_IR],
  '/hunting': [Role.SOC_ANALYST, Role.INVESTIGATOR, Role.ADMIN],
  '/threat-intel': [Role.SOC_ANALYST, Role.INVESTIGATOR, Role.ADMIN],
  '/admin/health': [Role.IT_ADMIN, Role.ADMIN],
  '/admin/users': [Role.IT_ADMIN, Role.ADMIN],
  '/admin/integrations': [Role.IT_ADMIN, Role.ADMIN],
  '/admin/audit': [Role.IT_ADMIN, Role.ADMIN],
  '/settings': [Role.IT_ADMIN, Role.ADMIN]
};

export default function App() {
  const auth = useAuth();
  const ui = useUI();

  // Initial health check & deep-link hydration
  useEffect(() => {
    authStore.checkHealth();

    const pathname = window.location.pathname;
    if (pathname && pathname !== '/') {
      uiStore.navigate(pathname);
    } else {
      uiStore.navigate(auth.isAuthenticated ? '/overview' : '/login');
    }

    const handlePopState = () => {
      uiStore.navigate(window.location.pathname || (auth.isAuthenticated ? '/overview' : '/login'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (window.location.pathname !== ui.currentPath) {
      window.history.pushState(null, '', ui.currentPath);
    }
  }, [ui.currentPath]);

  // Auth Guard
  useEffect(() => {
    if (!auth.isAuthenticated && ui.currentPath !== '/login') {
      uiStore.navigate('/login');
    }
    if (auth.isAuthenticated && ui.currentPath === '/login') {
      uiStore.navigate('/overview');
    }
  }, [auth.isAuthenticated, ui.currentPath, auth.currentRole]);

  const checkAccess = (basePath: string) => {
    const roles = ROUTE_ACCESS[basePath];
    if (!roles) return true; // public or unmapped routes handled separately
    return hasRole(roles);
  };

  // Route Dispatcher
  const renderRoute = () => {
    if (ui.currentPath === '/login') {
      return <LoginPage />;
    }

    if (!auth.isAuthenticated) return null;

    // Role-based route hijacking has been removed. All roles use standard routing.

    if (ui.currentPath.startsWith('/soc')) {
      if (!checkAccess('/soc')) return <ForbiddenPage />;
      return <SOCWorkspace />;
    }

    if (ui.currentPath.startsWith('/investigator/graph')) {
      if (!checkAccess('/investigator')) return <ForbiddenPage />;
      return <GraphInvestigationPage />;
    }

    if (ui.currentPath.startsWith('/investigator')) {
      if (!checkAccess('/investigator')) return <ForbiddenPage />;
      return <InvestigatorWorkspace />;
    }

    if (ui.currentPath === '/' || ui.currentPath === '/overview') {
      if (!checkAccess('/overview')) return <ForbiddenPage />;
      return <SecurityOverviewPage />;
    }

    if (ui.currentPath === '/inbox' || ui.currentPath === '/cases') {
      if (!checkAccess('/inbox')) return <ForbiddenPage />;
      return <CaseInboxPage />;
    }

    if (ui.currentPath.startsWith('/case')) {
      if (!checkAccess('/inbox')) return <ForbiddenPage />;
      return <CaseDetailPage />;
    }

    if (ui.currentPath.startsWith('/investigation') || ui.currentPath === '/ingest') {
      if (!checkAccess('/investigation')) return <ForbiddenPage />;
      return <InvestigationPage />;
    }

    if (ui.currentPath.startsWith('/hunting') || ui.currentPath.startsWith('/threat-intel')) {
      if (!checkAccess('/hunting')) return <ForbiddenPage />;
      return <HuntingPlaceholder />;
    }

    if (ui.currentPath.startsWith('/reports') || ui.currentPath.startsWith('/report')) {
      if (!checkAccess('/reports')) return <ForbiddenPage />;
      return <ForensicReportPage />;
    }

    if (ui.currentPath.startsWith('/evidence')) {
      if (!checkAccess('/evidence')) return <ForbiddenPage />;
      return <CaseDetailPage />;
    }

    if (ui.currentPath.startsWith('/admin/health')) {
      if (!checkAccess('/admin/health')) return <ForbiddenPage />;
      return <HealthPlaceholder />;
    }

    if (ui.currentPath.startsWith('/admin/users')) {
      if (!checkAccess('/admin/users')) return <ForbiddenPage />;
      return <UsersPlaceholder />;
    }

    if (ui.currentPath.startsWith('/admin/integrations')) {
      if (!checkAccess('/admin/integrations')) return <ForbiddenPage />;
      return <IntegrationsPlaceholder />;
    }

    if (ui.currentPath.startsWith('/admin/audit')) {
      if (!checkAccess('/admin/audit')) return <ForbiddenPage />;
      return <AuditPlaceholder />;
    }

    if (ui.currentPath.startsWith('/settings')) {
      if (!checkAccess('/settings')) return <ForbiddenPage />;
      return <SettingsPlaceholder />;
    }

    return <NotFoundPage />;
  };

  if (ui.currentPath === '/login' || !auth.isAuthenticated) {
    return (
      <ErrorBoundary>
        {renderRoute()}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AppShell>
        {renderRoute()}
      </AppShell>
    </ErrorBoundary>
  );
}
