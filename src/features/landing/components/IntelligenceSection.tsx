import React from 'react';
import { Badge } from '../../../components/ui/Badge.tsx';
import { Server } from 'lucide-react';
import { ThreatWorldMap } from '../../dashboard/ThreatWorldMap.tsx';

// ── IP Intelligence card ───────────────────────────────────────────────────
const IPIntelCard: React.FC = () => (
  <div className="bg-[#0c1322] border border-slate-800 rounded-xl overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 bg-[#070b14] border-b border-slate-800">
      <Server className="w-3.5 h-3.5 text-purple-400" />
      <span className="text-xs font-mono font-bold text-slate-300">IP Intelligence — 185.234.219.12</span>
      <Badge variant="malicious" size="sm">MALICIOUS</Badge>
    </div>
    <div className="divide-y divide-slate-800/60">
      {[
        { k: 'IP Address', v: '185.234.219.12', color: 'text-slate-200' },
        { k: 'Country', v: 'Russia (RU)', color: 'text-rose-400' },
        { k: 'ASN', v: 'AS49870', color: 'text-slate-300' },
        { k: 'Organization', v: 'Pindc LLC', color: 'text-slate-300' },
        { k: 'Hosting', v: 'Bulletproof · Datacenter', color: 'text-amber-400' },
        { k: 'Reputation', v: '98 / 100 abuse confidence', color: 'text-rose-400' },
        { k: 'Tags', v: 'Tor exit · BEC · Phishing', color: 'text-amber-400' },
        { k: 'First seen', v: '2023-04-12', color: 'text-slate-400' },
        { k: 'Last seen', v: '2026-09-18', color: 'text-rose-400' },
      ].map(({ k, v, color }) => (
        <div key={k} className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-mono text-slate-500">{k}</span>
          <span className={`text-xs font-mono font-bold ${color}`}>{v}</span>
        </div>
      ))}
    </div>
    <div className="px-4 py-3 bg-[#070b14]/60 border-t border-slate-800/60 flex items-center gap-2">
      <Badge variant="outline" size="sm">Pivot to cases</Badge>
      <Badge variant="outline" size="sm">Download IOC</Badge>
    </div>
  </div>
);

export const IntelligenceSection: React.FC = () => (
  <section
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="intel-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400 tracking-wider mb-4">
        Geolocation & Threat Intelligence
      </p>
      <h2
        id="intel-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        Know Where Threats Originate.
      </h2>
      <p className="text-slate-400 text-base max-w-xl mb-10 leading-relaxed">
        Every email sender IP is enriched with geolocation, ASN, hosting organization, and reputation data —
        giving analysts full infrastructure context for every investigation.
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map — 2 cols */}
        <div className="lg:col-span-2">
          <ThreatWorldMap mapHeightClassName="h-[340px] sm:h-[380px] lg:h-[430px]" showOverlayLegend={true} />
        </div>

        {/* IP Intel card */}
        <div className="lg:col-span-1">
          <IPIntelCard />
        </div>
      </div>
    </div>
  </section>
);
