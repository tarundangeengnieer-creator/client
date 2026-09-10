import React from 'react';
import { useSOC, socStore } from '../../../stores/soc-store.ts';
import { Filter } from 'lucide-react';

export const SOCCharts: React.FC = () => {
  const { alertAging, threatTrend, authTrend, filterAgingBucket, filterCategory } = useSOC();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 select-none">
      {/* 1. Alert Aging Bar Chart */}
      <div className="bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Alert Aging
          </h4>
          <span className="text-[9px] text-slate-400 font-mono">Click bar to filter</span>
        </div>
        <div className="flex items-end justify-between h-16 gap-1.5 pt-2">
          {alertAging.map(bucket => {
            const isSelected = filterAgingBucket === bucket.label;
            return (
              <div 
                key={bucket.label} 
                onClick={() => socStore.setFilters({ agingBucket: isSelected ? 'ALL' : bucket.label })}
                className="flex flex-col items-center flex-1 group cursor-pointer" 
                title={`${bucket.label}: ${bucket.count} alerts (Click to filter)`}
              >
                <div 
                  className={`w-full rounded-t-sm transition-all relative ${
                    isSelected 
                      ? 'bg-blue-600 dark:bg-blue-500' 
                      : bucket.label === 'SLA Breaching'
                        ? 'bg-rose-200 dark:bg-rose-950/70 group-hover:bg-rose-500'
                        : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-400'
                  }`} 
                  style={{ height: `${Math.max((bucket.count / 6) * 100, 8)}%` }}
                >
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {bucket.count}
                  </span>
                </div>
                <span className={`text-[8px] font-bold mt-1 truncate w-full text-center ${
                  isSelected ? 'text-blue-600 font-extrabold' : 'text-slate-500'
                }`}>
                  {bucket.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Threat Category Trend (Stacked Bar) */}
      <div className="bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Threat Category (7d)
          </h4>
          <span className="text-[9px] text-slate-400 font-mono">Click to filter</span>
        </div>
        <div className="space-y-1.5 overflow-y-auto max-h-16 pr-1">
          {threatTrend.map(trend => {
            const isSelected = filterCategory === trend.category;
            return (
              <div 
                key={trend.category} 
                onClick={() => socStore.setFilters({ category: isSelected ? 'ALL' : trend.category })}
                className={`p-1 rounded cursor-pointer transition-colors ${isSelected ? 'bg-slate-100/90 dark:bg-slate-800/80' : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'}`}
                title={`${trend.category}: ${trend.count} alerts (Click to filter)`}
              >
                <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  <span className="truncate">{trend.category}</span>
                  <span className="font-mono text-[9px]">{trend.count}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-rose-500" style={{ width: `${(trend.severity_breakdown.CRITICAL / trend.count) * 100}%` }} title={`Critical: ${trend.severity_breakdown.CRITICAL}`} />
                  <div className="h-full bg-orange-400" style={{ width: `${(trend.severity_breakdown.HIGH / trend.count) * 100}%` }} title={`High: ${trend.severity_breakdown.HIGH}`} />
                  <div className="h-full bg-amber-400" style={{ width: `${(trend.severity_breakdown.MEDIUM / trend.count) * 100}%` }} title={`Medium: ${trend.severity_breakdown.MEDIUM}`} />
                  <div className="h-full bg-blue-400" style={{ width: `${(trend.severity_breakdown.LOW / trend.count) * 100}%` }} title={`Low: ${trend.severity_breakdown.LOW}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Auth Failure Trend (24h) */}
      <div className="bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Auth Failures Telemetry (24h)
          </h4>
          <span className="text-[9px] text-slate-400 font-mono">SPF / DKIM / DMARC</span>
        </div>
        <div className="flex items-end h-16 gap-0.5 pt-2">
          {authTrend.slice(-24).map((pt, idx) => {
            const total = pt.spfFails + pt.dkimFails + pt.dmarcFails;
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col justify-end group cursor-pointer" 
                title={`${new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Total Failures: ${total} (SPF: ${pt.spfFails}, DKIM: ${pt.dkimFails}, DMARC: ${pt.dmarcFails})`}
              >
                <div 
                  className="w-full bg-rose-200 dark:bg-rose-900/50 group-hover:bg-rose-500 transition-colors rounded-t-xs" 
                  style={{ height: `${Math.max((total / 75) * 100, 4)}%` }} 
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 mt-1">
          <span>-24h (Telemetry Origin)</span>
          <span className="text-rose-600 font-bold">Latest Wave</span>
        </div>
      </div>
    </div>
  );
};
