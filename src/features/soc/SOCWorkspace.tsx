import React, { useEffect } from 'react';
import { useSOC, socStore } from '../../stores/soc-store.ts';
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
          onClick={() => socStore.setFilters({ status: 'INVESTIGATING' })}
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
          onClick={() => socStore.setFilters({ agingBucket: 'SLA Breaching' })}
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
          onClick={() => socStore.setFilters({ severity: 'CRITICAL' })}
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
          onClick={() => socStore.setFilters({ agingBucket: '0-15m' })}
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

        {/* High-value Filter Controls & Refresh */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Severity filter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={filterSeverity}
              onChange={(e) => socStore.setFilters({ severity: e.target.value })}
              className="text-[11px] font-bold bg-transparent text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
            <select
              value={filterStatus}
              onChange={(e) => socStore.setFilters({ status: e.target.value })}
              className="text-[11px] font-bold bg-transparent text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New (Unassigned)</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="ESCALATED">Escalated</option>
              <option value="CLOSED_TRUE_POSITIVE">Closed (TP)</option>
              <option value="CLOSED_FALSE_POSITIVE">Closed (FP)</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
            <select
              value={filterCategory}
              onChange={(e) => socStore.setFilters({ category: e.target.value })}
              className="text-[11px] font-bold bg-transparent text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Business Email Compromise">BEC</option>
              <option value="Phishing">Phishing</option>
              <option value="Malware">Malware</option>
              <option value="Account Takeover">Account Takeover</option>
              <option value="Suspicious Login">Suspicious Login</option>
              <option value="Spam">Spam</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => {
              socStore.fetchQueue();
              socStore.fetchDashboardData();
            }}
            disabled={isLoadingQueue}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1627] text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Alert Telemetry"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingQueue ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Secondary Context: Actionable Rollup Trends */}
      <SOCCharts />

      {/* Primary Work Surface: Alert Triage Queue + Contextual Detail Drawer */}
      <div className="flex-1 flex gap-3 min-h-[400px] overflow-hidden">
        <div className="flex-1 flex flex-col h-full min-w-0">
          <AlertQueue />
        </div>

        {/* Contextual Side Panel */}
        {isTriagePanelOpen && (
          <div className="w-[380px] flex-shrink-0 h-full hidden lg:flex flex-col">
            <SOCTriagePanel />
          </div>
        )}
      </div>

      {/* Deep-dive Email Entity Modal */}
      <SOCEmailEntityModal />

    </div>
  );
};
