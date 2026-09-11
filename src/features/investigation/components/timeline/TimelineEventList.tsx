import React, { useState, useMemo } from 'react';
import { useInvestigator, investigatorStore } from '../../../../stores/investigator-store.ts';
import { TimelineEvent } from '../../../../domain/investigator.ts';
import { 
  Clock, Mail, Share2, MousePointerClick, FileCode, Terminal, 
  ShieldAlert, UserCheck, AlertTriangle
} from 'lucide-react';
import { cn } from '../../../../lib/utils.ts';

export const TimelineEventList: React.FC = () => {
  const { timelineEvents, selectedTimelineEvent, isLoadingTimeline, errorTimeline } = useInvestigator();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((e) => {
      if (filterCategory !== 'ALL') {
        const type = e.event_type.toLowerCase();
        if (filterCategory === 'EMAIL' && !(type.includes('email') || type.includes('received-chain'))) return false;
        if (filterCategory === 'NETWORK' && !(type.includes('url') || type.includes('dns') || type.includes('ip') || type.includes('network'))) return false;
        if (filterCategory === 'ATTACHMENT' && !(type.includes('attachment') || type.includes('execution'))) return false;
        if (filterCategory === 'THREAT_INTEL' && !type.includes('threat')) return false;
        if (filterCategory === 'ANALYST' && !type.includes('analyst')) return false;
      }
      if (filterSeverity !== 'ALL' && e.relevance.toUpperCase() !== filterSeverity) return false;
      return true;
    });
  }, [timelineEvents, filterCategory, filterSeverity]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Email received': return <Mail className="w-3.5 h-3.5 text-[#08B4ED]" />;
      case 'Received-chain hop': return <Share2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'URL click': return <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />;
      case 'Attachment activity': return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
      case 'Execution indicator': return <Terminal className="w-3.5 h-3.5 text-rose-400" />;
      case 'Threat-intelligence enrichment': return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case 'Analyst action': return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityColor = (relevance: string) => {
    switch (relevance.toUpperCase()) {
      case 'CRITICAL': return 'bg-rose-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-slate-400';
      default: return 'bg-[#08B4ED]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c1322] border-r border-slate-200 dark:border-slate-800">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f1d] shrink-0 space-y-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full text-xs font-mono bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
        >
          <option value="ALL">All Event Types</option>
          <option value="EMAIL">Email & Hops</option>
          <option value="NETWORK">Network & URL</option>
          <option value="ATTACHMENT">Attachment & Execution</option>
          <option value="THREAT_INTEL">Threat Intel</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="w-full text-xs font-mono bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {isLoadingTimeline && (
          <div className="p-8 text-center text-slate-500">
            <div className="w-5 h-5 rounded-full border-2 border-[#08B4ED] border-t-transparent animate-spin mx-auto mb-2" />
          </div>
        )}

        {!isLoadingTimeline && errorTimeline && (
          <div className="p-4 text-center text-rose-500 text-xs">
            <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
            {errorTimeline}
          </div>
        )}

        {!isLoadingTimeline && !errorTimeline && (
          <div className="relative pl-4 space-y-2 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredEvents.map((evt) => {
              const isSelected = selectedTimelineEvent?.event_id === evt.event_id;
              
              return (
                <div
                  key={evt.event_id}
                  onClick={() => investigatorStore.selectTimelineEvent(evt)}
                  className={cn(
                    'relative group cursor-pointer rounded border p-2 transition-colors',
                    isSelected 
                      ? 'bg-cyan-50/70 dark:bg-[#0f172a] border-[#08B4ED]' 
                      : 'bg-white dark:bg-[#0c1322] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  )}
                >
                  <span
                    className={cn(
                      'absolute -left-[19px] top-3 w-3 h-3 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110',
                      isSelected ? 'bg-[#08B4ED] border-[#08B4ED]' : 'bg-white dark:bg-[#0c1322] border-slate-400 dark:border-slate-600'
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", getSeverityColor(evt.relevance))} />
                  </span>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {getEventIcon(evt.event_type)}
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 font-mono truncate">
                        {evt.event_type}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">
                    {evt.summary}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
