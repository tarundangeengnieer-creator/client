import React from 'react';
import { useSOC, socStore } from '../../../stores/soc-store.ts';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, Clock, Check, X, User } from 'lucide-react';
import { Alert, AlertSeverity } from '../../../domain/soc.ts';

export const AlertQueue: React.FC = () => {
  const { alerts, isLoadingQueue, errorQueue, selectedAlertId, filterSeverity, filterStatus, filterCategory, filterAgingBucket } = useSOC();

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />;
      case 'MEDIUM': return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'LOW': return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
    }
  };

  const getConsolidatedAuthStatus = (spf: string, dkim: string, dmarc: string) => {
    const checks = [spf, dkim, dmarc];
    const fails = checks.filter(v => v === 'FAIL').length;
    const passes = checks.filter(v => v === 'PASS').length;
    
    if (fails > 0) {
      return (
        <span 
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"
          title={`Auth Failed: SPF=${spf}, DKIM=${dkim}, DMARC=${dmarc}`}
        >
          <X className="w-3 h-3" strokeWidth={3} />
        </span>
      );
    }
    
    if (passes === 3) {
      return (
        <span 
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          title={`All checks passed (SPF/DKIM/DMARC)`}
        >
          <Check className="w-3 h-3" strokeWidth={3} />
        </span>
      );
    }

    return (
      <span 
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        title={`Mixed/Neutral: SPF=${spf}, DKIM=${dkim}, DMARC=${dmarc}`}
      >
        <span className="text-xs font-bold leading-none">-</span>
      </span>
    );
  };

  const hasActiveFilters = filterSeverity !== 'ALL' || filterStatus !== 'ALL' || filterCategory !== 'ALL' || filterAgingBucket !== 'ALL';

  if (errorQueue) {
    return (
      <div className="flex-1 p-6 text-center text-slate-500 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-lg">
        <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
        <p className="font-bold text-xssss text-slate-800 dark:text-slate-200">Alert Queue Unavailable</p>
        <p className="text-[11px] mt-1">{errorQueue}</p>
        <button onClick={() => socStore.fetchQueue()} className="mt-4 text-xssss font-semibold text-blue-600 hover:underline cursor-pointer">Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
      {/* Header with active filter chips */}
      <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-[#0a0f1d] border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 tracking-tight">
            <ShieldAlert className="w-3.5 h-3.5 text-[#1a68ff]" />
            <span>Alert Triage Queue</span>
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
            {alerts.length} Records
          </span>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-400">Filters:</span>
            {filterSeverity !== 'ALL' && (
              <span className="px-1.5 py-0.5 rounded bg-transparent text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold flex items-center gap-1">
                {filterSeverity}
                <button onClick={() => socStore.setFilters({ severity: 'ALL' })} className="hover:text-rose-500 cursor-pointer">×</button>
              </span>
            )}
            {filterStatus !== 'ALL' && (
              <span className="px-1.5 py-0.5 rounded bg-transparent text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold flex items-center gap-1">
                {filterStatus}
                <button onClick={() => socStore.setFilters({ status: 'ALL' })} className="hover:text-rose-500 cursor-pointer">×</button>
              </span>
            )}
            {filterCategory !== 'ALL' && (
              <span className="px-1.5 py-0.5 rounded bg-transparent text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold flex items-center gap-1">
                {filterCategory}
                <button onClick={() => socStore.setFilters({ category: 'ALL' })} className="hover:text-rose-500 cursor-pointer">×</button>
              </span>
            )}
            {filterAgingBucket !== 'ALL' && (
              <span className="px-1.5 py-0.5 rounded bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                Aging: {filterAgingBucket}
                <button onClick={() => socStore.setFilters({ agingBucket: 'ALL' })} className="hover:text-rose-500 cursor-pointer">×</button>
              </span>
            )}
            <button
              onClick={() => socStore.resetFilters()}
              className="text-blue-600 hover:underline font-bold ml-1 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      
      {/* Table Surface */}
      <div className="relative flex-1 overflow-auto">
        {isLoadingQueue && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 dark:bg-[#070b14]/70 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full border-2 border-[#1a68ff] border-t-transparent animate-spin mb-2" />
          </div>
        )}

        <table className="w-full text-left border-collapse text-xssss">
          <thead className="sticky top-0 bg-slate-100 dark:bg-[#0e1627] z-10 shadow-xs border-b border-slate-200 dark:border-slate-800 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Severity</th>
              <th className="px-3 py-2.5 font-semibold">Age / SLA</th>
              <th className="px-3 py-2.5 font-semibold">Subject / Sender</th>
              <th className="px-3 py-2.5 font-semibold">Category</th>
              <th className="px-3 py-2.5 font-semibold">Threat Score</th>
              <th className="px-3 py-2.5 font-semibold">SPF / DKIM / DMARC</th>
              <th className="px-3 py-2.5 font-semibold">Origin Geo</th>
              <th className="px-3 py-2.5 font-semibold">Assigned Analyst</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {alerts.length === 0 && !isLoadingQueue && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <p className="font-semibold text-xssss">No alerts currently match your filter criteria.</p>
                  <button onClick={() => socStore.resetFilters()} className="mt-2 text-xssss text-blue-600 font-bold hover:underline cursor-pointer">
                    Clear all filters
                  </button>
                </td>
              </tr>
            )}
            {alerts.map(alert => {
              const ageMins = Math.floor((Date.now() - new Date(alert.timestamp).getTime()) / 60000);
              const isSelected = selectedAlertId === alert.id;

              return (
                <tr 
                  key={alert.id}
                  onClick={() => socStore.selectAlert(alert.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-slate-100/90 dark:bg-slate-800/80 border-l-2 border-l-blue-500' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  {/* Severity */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-800 dark:text-slate-200">
                      {getSeverityIcon(alert.severity)}
                      <span>{alert.severity}</span>
                    </div>
                  </td>

                  {/* Age / SLA */}
                  <td className="px-3 py-2 text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{ageMins}m</span>
                      {alert.is_sla_breached && (
                        <span className="ml-1 px-1.5 py-0.2 rounded bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/40 font-bold text-[8px] tracking-wider animate-pulse">
                          BREACH
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Subject / Sender */}
                  <td className="px-3 py-2 max-w-[240px]">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate text-[11px]" title={alert.subject}>
                      {alert.subject}
                    </div>
                    <div className="text-slate-500 text-[10px] font-mono truncate" title={alert.sender}>
                      {alert.sender}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-2 text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                    {alert.threat_category}
                  </td>

                  {/* Threat Score */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border ${
                      alert.threat_score >= 90 ? 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/40 font-extrabold' :
                      alert.threat_score >= 75 ? 'bg-transparent text-orange-600 dark:text-orange-400 border-orange-500/40' :
                      'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}>
                      {alert.threat_score}
                    </span>
                  </td>

                  {/* Auth signals: SPF DKIM DMARC */}
                  <td className="px-3 py-2 font-mono whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {getConsolidatedAuthStatus(alert.auth_signals.spf, alert.auth_signals.dkim, alert.auth_signals.dmarc)}
                    </div>
                  </td>

                  {/* Geo / IP */}
                  <td className="px-3 py-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {alert.source_geo}
                  </td>

                  {/* Assigned Analyst */}
                  <td className="px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {alert.assigned_analyst ? (
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-blue-500" />
                        {alert.assigned_analyst}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[10px]">Unassigned</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      alert.status === 'NEW' ? 'bg-transparent text-blue-600 dark:text-blue-400 border-blue-500/30' :
                      alert.status === 'INVESTIGATING' ? 'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/30' :
                      alert.status === 'ESCALATED' ? 'bg-transparent text-xsssurple-600 dark:text-xsssurple-400 border-purple-500/30' :
                      alert.status === 'CLOSED_TRUE_POSITIVE' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                      'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}>
                      {alert.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
