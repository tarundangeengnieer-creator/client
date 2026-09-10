import React, { useState } from 'react';
import { useInvestigator } from '../../../stores/investigator-store.ts';
import { Globe, MapPin, AlertOctagon, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

export const GeographicActivityTable: React.FC = () => {
  const { geographicHops } = useInvestigator();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
      <div className="px-4 py-3 bg-slate-50/90 dark:bg-[#0a0f1d] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-orange-500 flex items-center justify-center font-bold">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Geographic Activity & Relay Routing</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Hop-by-Hop Telemetry
              </span>
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-4">Mail Hop</th>
                <th className="py-2.5 px-4">Source IP</th>
                <th className="py-2.5 px-4">Origin Geolocation</th>
                <th className="py-2.5 px-4">Autonomous System (ASN)</th>
                <th className="py-2.5 px-4">Hop Timestamp</th>
                <th className="py-2.5 px-4">Anomaly / Forensic Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
              {geographicHops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 font-sans">
                    No geographic relay hops available for active case.
                  </td>
                </tr>
              ) : (
                geographicHops.map((hop) => (
                  <tr
                    key={hop.hop_number}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      Hop #{hop.hop_number}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {hop.ip}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">{hop.country}</span>
                      {hop.city && <span className="text-slate-400 ml-1">({hop.city})</span>}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                      {hop.asn}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(hop.timestamp).toUTCString().replace('GMT', 'UTC')}
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      {hop.is_tor ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-[10.5px]">
                          <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          <span>{hop.anomaly_context}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {hop.anomaly_context}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
