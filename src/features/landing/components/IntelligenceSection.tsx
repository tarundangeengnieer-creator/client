import React from 'react';
import { Badge } from '../../../components/ui/Badge.tsx';
import { MapPin, Globe, Server, Radio, ExternalLink } from 'lucide-react';

// ── Static world map SVG with threat dots ──────────────────────────────────
const ThreatWorldMap: React.FC = () => (
  <div className="relative w-full bg-[#070b14] rounded-xl border border-slate-800 overflow-hidden" style={{ aspectRatio: '16/7' }}>
    {/* Base map SVG — simplified world outline */}
    <svg
      viewBox="0 0 1000 430"
      className="absolute inset-0 w-full h-full"
      aria-label="World threat origin map"
    >
      <defs>
        <radialGradient id="ig-glow-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="ig-glow-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Grid lines */}
      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => (
        <line key={`gv-${x}`} x1={x} y1={0} x2={x} y2={430} stroke="rgba(30,41,59,0.4)" strokeWidth="1" />
      ))}
      {[86, 172, 258, 344].map(y => (
        <line key={`gh-${y}`} x1={0} y1={y} x2={1000} y2={y} stroke="rgba(30,41,59,0.4)" strokeWidth="1" />
      ))}

      {/* Simplified continent outlines */}
      {/* North America */}
      <path d="M 150 60 L 270 50 L 280 120 L 260 180 L 220 200 L 180 220 L 150 200 L 120 170 L 110 120 Z" fill="rgba(30,41,59,0.5)" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
      {/* South America */}
      <path d="M 200 230 L 260 220 L 270 290 L 250 370 L 220 390 L 195 360 L 185 300 Z" fill="rgba(30,41,59,0.5)" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
      {/* Europe */}
      <path d="M 450 50 L 530 45 L 550 90 L 510 120 L 460 110 L 440 80 Z" fill="rgba(30,41,59,0.5)" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
      {/* Africa */}
      <path d="M 460 130 L 560 125 L 570 200 L 540 290 L 500 320 L 460 290 L 450 220 Z" fill="rgba(30,41,59,0.5)" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
      {/* Asia */}
      <path d="M 560 50 L 800 40 L 850 100 L 820 160 L 700 180 L 600 160 L 550 110 Z" fill="rgba(30,41,59,0.5)" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
      {/* Southeast Asia */}
      <path d="M 720 170 L 800 165 L 810 210 L 780 230 L 730 220 Z" fill="rgba(30,41,59,0.5)" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
      {/* Australia */}
      <path d="M 750 270 L 870 260 L 880 340 L 830 360 L 760 350 Z" fill="rgba(30,41,59,0.5)" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />

      {/* Threat origin dots */}
      {/* Russia */}
      <circle cx="650" cy="70" r="14" fill="url(#ig-glow-r)" />
      <circle cx="650" cy="70" r="5" fill="#f43f5e" />
      <circle cx="650" cy="70" r="5" fill="transparent" stroke="#f43f5e" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2s' }} />

      {/* China */}
      <circle cx="760" cy="110" r="10" fill="url(#ig-glow-r)" />
      <circle cx="760" cy="110" r="4" fill="#f43f5e" />

      {/* Eastern Europe */}
      <circle cx="550" cy="80" r="8" fill="url(#ig-glow-a)" />
      <circle cx="550" cy="80" r="3" fill="#fbbf24" />

      {/* Nigeria */}
      <circle cx="495" cy="190" r="8" fill="url(#ig-glow-a)" />
      <circle cx="495" cy="190" r="3" fill="#fbbf24" />

      {/* North Korea */}
      <circle cx="800" cy="100" r="6" fill="url(#ig-glow-r)" />
      <circle cx="800" cy="100" r="2.5" fill="#f43f5e" />

      {/* Target — US */}
      <circle cx="190" cy="130" r="8" fill="rgba(8,180,237,0.15)" />
      <circle cx="190" cy="130" r="3" fill="#08b4ed" />

      {/* Connection lines */}
      <line x1="650" y1="70" x2="190" y2="130" stroke="rgba(244,63,94,0.3)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="760" y1="110" x2="190" y2="130" stroke="rgba(244,63,94,0.2)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="495" y1="190" x2="190" y2="130" stroke="rgba(251,191,36,0.2)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>

    {/* Legend */}
    <div className="absolute top-3 right-3 bg-[#0c1322]/90 border border-slate-800 rounded-lg p-2 space-y-1">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span className="text-xs font-mono text-slate-400">Malicious origin</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-xs font-mono text-slate-400">Suspicious origin</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-sky-400" />
        <span className="text-xs font-mono text-slate-400">Target</span>
      </div>
    </div>

    {/* Active alert */}
    <div className="absolute bottom-3 left-3 bg-[#0c1322]/90 border border-rose-500/30 rounded-lg px-3 py-1.5">
      <p className="text-xs font-mono text-rose-400 font-bold">
        ● LIVE — 7 active threat origins tracked
      </p>
    </div>
  </div>
);

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
      <p className="text-xs font-mono font-bold text-sky-400/70 tracking-widest uppercase mb-4">
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
          <ThreatWorldMap />
        </div>

        {/* IP Intel card */}
        <div className="lg:col-span-1">
          <IPIntelCard />
        </div>
      </div>
    </div>
  </section>
);
