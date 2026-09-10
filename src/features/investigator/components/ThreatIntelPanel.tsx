import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { ShieldAlert, AlertTriangle, Globe, Radio, Power, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import { MitreBadge } from '../../../components/ui/MitreBadge.tsx';

export const ThreatIntelPanel: React.FC = () => {
  const { threatIntel, isThreatIntelOffline, isLoadingTI, errorTI } = useInvestigator();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs font-mono select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#070b14] border border-[#08B4ED]/40 text-[#08B4ED] flex items-center justify-center font-bold">
            <Radio className="w-3.5 h-3.5 text-[#08B4ED]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Threat Intelligence Telemetry & Enrichment</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-[#070b14] text-[#08B4ED] border border-[#08B4ED]/30 font-normal">
                Level 4 Enrichment
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Resilience Simulation: Toggle TI Online/Offline */}
          <button
            type="button"
            onClick={() => investigatorStore.toggleThreatIntelOffline()}
            className={`px-2 py-1 rounded text-[10.5px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isThreatIntelOffline
                ? 'bg-rose-50 dark:bg-[#070b14] border-rose-500/40 text-rose-600 dark:text-rose-400'
                : 'bg-emerald-50 dark:bg-[#070b14] border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
            }`}
            title="Toggle simulated Threat Intel feed outage to verify workspace resilience"
          >
            <Power className="w-3 h-3" />
            <span>{isThreatIntelOffline ? 'Feed Offline (Simulated)' : 'Feed Online'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Toggle Threat Intel panel"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-transparent">
          {isLoadingTI && (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs">
              <div className="w-5 h-5 rounded-full border-2 border-[#08B4ED] border-t-transparent animate-spin mx-auto mb-1" />
              <span>Querying global IOC reputation telemetry...</span>
            </div>
          )}

          {/* Graceful Fallback when Threat Intelligence is Offline */}
          {(isThreatIntelOffline || errorTI) && (
            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-[#070b14] border border-amber-500/30 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  External Threat Intelligence Telemetry Offline
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed font-sans">
                  Third-party IOC reputation service is currently unavailable.
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                    Timeline, Graph, Forensic Evidence Ledger, and Case Actions remain fully operational.
                  </span>
                </p>
              </div>
            </div>
          )}

          {!isLoadingTI && !isThreatIntelOffline && !errorTI && threatIntel && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Primary Indicator</span>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-0.5 break-all">
                    {threatIntel.indicator}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Reputation Verdict</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <SeverityBadge
                      severity={threatIntel.reputation}
                      showDot
                      pulse={threatIntel.reputation === 'MALICIOUS'}
                      size="sm"
                    />
                    <span className="text-[11px] text-[#08B4ED] font-semibold">
                      ({threatIntel.confidence}% Confidence)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Threat Feed Provider</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                    {threatIntel.source}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-[#070b14] rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Enrichment Summary:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans text-[11.5px]">
                  {threatIntel.summary}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                  {threatIntel.tags.map((tag) => (
                    tag.match(/^T\d{4}/i) ? (
                      <MitreBadge key={tag} technique={tag} size="sm" />
                    ) : (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-[#0c1322] text-[#08B4ED] border border-[#08B4ED]/30 text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    )
                  ))}
                </div>
              </div>

              {/* Provenance Disclaimer */}
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                <Info className="w-3.5 h-3.5 text-[#08B4ED]" />
                <span>
                  Threat intelligence is Level 4 supplementary enrichment. Observed forensic evidence (Level 3) remains the primary basis for disposition.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
