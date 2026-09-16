import React, { useEffect } from 'react';
import { useSOC, socStore } from '../../stores/soc-store.ts';
import { uiStore } from '../../stores/ui-store.ts';
import { AlertQueue } from './components/AlertQueue.tsx';
import { SOCTriagePanel } from './components/SOCTriagePanel.tsx';
import { SOCCharts } from './components/SOCCharts.tsx';
import { SOCEmailEntityModal } from './components/SOCEmailEntityModal.tsx';
import { Filter, Clock, ShieldAlert, Activity, Sparkles, RotateCw, AlertTriangle } from 'lucide-react';

export const SOCWorkspace: React.FC = () => {
  const { kpis, isLoadingKPIs, isTriagePanelOpen, filterSeverity, filterStatus, filterCategory, isLoadingQueue } = useSOC();

  useEffect(() => {
    socStore.fetchDashboardData();
    socStore.fetchQueue();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#030712] overflow-hidden p-3 md:p-5 pb-0">
      
      {/* 4 Core Indicators Above-the-fold */}
      <div className="flex flex-wrap items-center gap-3 mb-3 select-none">
        {/* KPI 1: Open Alerts Assigned to Me */}
        <div 
          onClick={() => {
            import('../../stores/cases-store.ts').then(m => {
              m.casesStore.setFilters({ status: 'INVESTIGATING' });
              uiStore.navigate('/inbox');
            });
          }}
          className="flex-1 min-w-[170px] flex items-center gap-3 px-3.5 py-2 bg-white dark:bg-[#0a0f1d] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Assigned to Me</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono leading-tight">
              {isLoadingKPIs ? '...' : kpis?.openAlertsAssignedToMe ?? 0}
            </p>
          </div>
        </div>

        {/* KPI 2: Alerts Breaching SLA */}
        <div 
          onClick={() => {
            import('../../stores/cases-store.ts').then(m => {
              // casesStore.setSlaFilter('BREACHED') - assuming we handle SLA via custom filter or assume age bucket.
              // For now, let's reset others just to show queue:
              m.casesStore.setFilters({ status: 'ALL', severity: 'ALL' }); 
              uiStore.navigate('/inbox');
            });
          }}
          className="flex-1 min-w-[170px] flex items-center gap-3 px-3.5 py-2 bg-white dark:bg-[#0a0f1d] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-rose-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Breaching SLA</p>
            <p className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono leading-tight">
              {isLoadingKPIs ? '...' : kpis?.alertsBreachingSLA ?? 0}
            </p>
          </div>
        </div>

        {/* KPI 3: Critical / High Unresolved */}
        <div 
          onClick={() => {
            import('../../stores/cases-store.ts').then(m => {
              m.casesStore.setFilters({ severity: 'CRITICAL', status: 'ALL' });
              uiStore.navigate('/inbox');
            });
          }}
          className="flex-1 min-w-[170px] flex items-center gap-3 px-3.5 py-2 bg-white dark:bg-[#0a0f1d] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-orange-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Critical / High</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono leading-tight">
              {isLoadingKPIs ? '...' : kpis?.criticalHighUnresolved ?? 0}
            </p>
          </div>
        </div>

        {/* KPI 4: New Alerts in Last 15 Minutes */}
        <div 
          onClick={() => {
            import('../../stores/cases-store.ts').then(m => {
              m.casesStore.setFilters({ status: 'ALL', severity: 'ALL' }); // New could mean timestamp sort
              uiStore.navigate('/inbox');
            });
          }}
          className="flex-1 min-w-[170px] flex items-center gap-3 px-3.5 py-2 bg-white dark:bg-[#0a0f1d] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">New in 15m</p>
            <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono leading-tight">
              {isLoadingKPIs ? '...' : kpis?.newAlertsLast15m ?? 0}
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => {
              socStore.fetchDashboardData();
            }}
            disabled={isLoadingKPIs}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1627] text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Telemetry"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingKPIs ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Secondary Context: Actionable Rollup Trends */}
      <SOCCharts />
    </div>
  );
};
