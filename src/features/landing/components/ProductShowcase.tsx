import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge.tsx';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import { MitreBadge } from '../../../components/ui/MitreBadge.tsx';
import { ProvenanceLabel } from '../../../components/ui/ProvenanceLabel.tsx';
import {
  Network,
  Clock,
  Archive,
  Compass,
  Mail,
  MapPin,
  Radio,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Server,
  Link2,
  Cpu,
} from 'lucide-react';

// Tab types for the showcase
type ShowcaseTab = 'graph' | 'timeline' | 'evidence' | 'intel';

const TABS: { id: ShowcaseTab; label: string; icon: React.ReactNode }[] = [
  { id: 'graph', label: 'Investigation Graph', icon: <Network className="w-3.5 h-3.5" /> },
  { id: 'timeline', label: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'evidence', label: 'Evidence', icon: <Archive className="w-3.5 h-3.5" /> },
  { id: 'intel', label: 'Threat Intel', icon: <Radio className="w-3.5 h-3.5" /> },
];

// ── Graph Tab ─────────────────────────────────────────────────────────────────
const GraphTab: React.FC = () => (
  <div className="h-[360px] relative bg-[#070b14] overflow-hidden">
    <svg width="100%" height="100%" viewBox="0 0 700 360" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="pg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#08b4ed" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <marker id="pg-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#1e293b" />
        </marker>
      </defs>
      <rect width="700" height="360" fill="url(#pg-glow)" />

      {/* Grid lines */}
      {[0, 100, 200, 300, 400, 500, 600, 700].map(x => (
        <line key={`vg-${x}`} x1={x} y1={0} x2={x} y2={360} stroke="rgba(30,41,59,0.5)" strokeWidth="1" />
      ))}
      {[0, 90, 180, 270, 360].map(y => (
        <line key={`hg-${y}`} x1={0} y1={y} x2={700} y2={y} stroke="rgba(30,41,59,0.5)" strokeWidth="1" />
      ))}

      {/* Edges */}
      {([
        [350, 180, 160, 80], [350, 180, 540, 80], [350, 180, 140, 280],
        [350, 180, 560, 280], [350, 180, 350, 310], [160, 80, 60, 40],
        [540, 80, 640, 40], [140, 280, 60, 310],
      ] as [number,number,number,number][]).map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth="1.5"
          markerEnd="url(#pg-arrow)" />
      ))}

      {/* Central email node */}
      <circle cx="350" cy="180" r="26" fill="#0c1322" stroke="#08b4ed" strokeWidth="2" />
      <text x="350" y="176" textAnchor="middle" fontSize="9" fill="#08b4ed" fontFamily="monospace" fontWeight="bold">EMAIL</text>
      <text x="350" y="188" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="monospace">ENTITY</text>

      {/* IP node */}
      <circle cx="160" cy="80" r="20" fill="#0c1322" stroke="#f43f5e" strokeWidth="2" />
      <text x="160" y="77" textAnchor="middle" fontSize="9" fill="#f43f5e" fontFamily="monospace" fontWeight="bold">IP</text>
      <text x="160" y="87" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">185.234.x</text>

      {/* Domain node */}
      <circle cx="540" cy="80" r="20" fill="#0c1322" stroke="#f43f5e" strokeWidth="2" />
      <text x="540" y="77" textAnchor="middle" fontSize="9" fill="#f43f5e" fontFamily="monospace" fontWeight="bold">DOM</text>
      <text x="540" y="87" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">paypal-v..</text>

      {/* URL node */}
      <circle cx="140" cy="280" r="20" fill="#0c1322" stroke="#fbbf24" strokeWidth="2" />
      <text x="140" y="277" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="monospace" fontWeight="bold">URL</text>
      <text x="140" y="287" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">×3 links</text>

      {/* ASN node */}
      <circle cx="560" cy="280" r="18" fill="#0c1322" stroke="#64748b" strokeWidth="1" />
      <text x="560" y="277" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">ASN</text>
      <text x="560" y="287" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">49870</text>

      {/* Geo node */}
      <circle cx="350" cy="310" r="18" fill="#0c1322" stroke="#a855f7" strokeWidth="1.5" />
      <text x="350" y="307" textAnchor="middle" fontSize="9" fill="#a855f7" fontFamily="monospace">GEO</text>
      <text x="350" y="317" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">RU</text>

      {/* Threat actor node */}
      <circle cx="60" cy="40" r="15" fill="#0c1322" stroke="#f43f5e" strokeWidth="1.5" />
      <text x="60" y="43" textAnchor="middle" fontSize="8" fill="#f43f5e" fontFamily="monospace" fontWeight="bold">TA</text>

      {/* Related campaign node */}
      <circle cx="640" cy="40" r="15" fill="#0c1322" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="640" y="43" textAnchor="middle" fontSize="8" fill="#fbbf24" fontFamily="monospace">CAMP</text>

      {/* ASN sub-node */}
      <circle cx="60" cy="310" r="14" fill="#0c1322" stroke="#475569" strokeWidth="1" />
      <text x="60" y="313" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="monospace">ORG</text>
    </svg>

    {/* Legend */}
    <div className="absolute top-3 right-3 bg-[#0c1322]/90 border border-slate-800 rounded-lg p-2 space-y-1">
      {[
        { color: 'bg-rose-500', label: 'Malicious' },
        { color: 'bg-amber-400', label: 'Suspicious' },
        { color: 'bg-purple-500', label: 'Enriched' },
        { color: 'bg-sky-400', label: 'Primary' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-xs font-mono text-slate-400">{label}</span>
        </div>
      ))}
    </div>

    {/* Node count */}
    <div className="absolute bottom-3 left-3">
      <Badge variant="info" size="sm">9 nodes · 8 edges</Badge>
    </div>
  </div>
);

// ── Timeline Tab ──────────────────────────────────────────────────────────────
const TimelineTab: React.FC = () => {
  const events = [
    { time: '09:12:03', label: 'Email ingested', detail: 'MIME parsed · 4 parts · 1 attachment', color: 'bg-sky-400', provenance: 'OBSERVED EVIDENCE' as const },
    { time: '09:12:04', label: 'Header analysis', detail: 'Received chain · 3 relay hops extracted', color: 'bg-sky-400', provenance: 'OBSERVED EVIDENCE' as const },
    { time: '09:12:04', label: 'SPF · DKIM · DMARC', detail: 'All three authentication checks FAILED', color: 'bg-rose-400', provenance: 'OBSERVED EVIDENCE' as const },
    { time: '09:12:05', label: 'IP enrichment', detail: '185.234.219.12 → Tor exit · RU · AS49870', color: 'bg-purple-400', provenance: 'THREAT INTELLIGENCE' as const },
    { time: '09:12:06', label: 'Domain lookup', detail: 'paypal-verify.net → registered 2d ago · malicious', color: 'bg-rose-400', provenance: 'THREAT INTELLIGENCE' as const },
    { time: '09:12:07', label: 'URL scanning', detail: '3 URLs extracted · 2 redirect chains · 1 credential form', color: 'bg-amber-400', provenance: 'OBSERVED EVIDENCE' as const },
    { time: '09:12:08', label: 'ML classification', detail: 'Phishing confidence: 97% · BEC: 82%', color: 'bg-amber-400', provenance: 'ML DETECTION' as const },
    { time: '09:12:09', label: 'AI analysis', detail: 'PayPal brand impersonation · urgency manipulation', color: 'bg-sky-300', provenance: 'AI ANALYSIS' as const },
    { time: '09:12:09', label: 'Risk score computed', detail: 'Composite: 91/100 · Verdict: MALICIOUS', color: 'bg-rose-400', provenance: 'OBSERVED EVIDENCE' as const },
  ];

  return (
    <div className="h-[360px] overflow-y-auto px-4 py-3 space-y-1">
      {events.map((ev, i) => (
        <div key={i} className="flex gap-3 group">
          {/* Time + dot */}
          <div className="flex flex-col items-center shrink-0 w-20">
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap">{ev.time}</span>
            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${ev.color}`} />
            {i < events.length - 1 && (
              <div className="w-px flex-1 mt-0.5 bg-slate-800 group-last:hidden" />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 pb-3 border-b border-slate-800/60 last:border-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-200">{ev.label}</span>
              <ProvenanceLabel type={ev.provenance} size="xs" showIcon={false} />
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5 leading-snug">{ev.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Evidence Tab ──────────────────────────────────────────────────────────────
const EvidenceTab: React.FC = () => {
  const items = [
    { type: 'OBSERVED EVIDENCE' as const, label: 'Email Headers', detail: 'Return-Path mismatch · X-Originating-IP: 185.234.219.12', icon: Mail },
    { type: 'OBSERVED EVIDENCE' as const, label: 'SPF Record', detail: 'v=spf1 -all → FAIL · envelope from paypal-verify.net', icon: ShieldAlert },
    { type: 'THREAT INTELLIGENCE' as const, label: 'IP Reputation', detail: '185.234.219.12 · Tor exit · abuse score 98/100', icon: Server },
    { type: 'THREAT INTELLIGENCE' as const, label: 'Domain Intelligence', detail: 'paypal-verify.net · squatting PayPal · reg 2d ago', icon: Radio },
    { type: 'OBSERVED EVIDENCE' as const, label: 'URL #1', detail: 'hxxps://login-secure[.]xyz/paypal/verify → credential harvester', icon: Link2 },
    { type: 'AI ANALYSIS' as const, label: 'AI Interpretation', detail: 'High-confidence brand impersonation with urgency cue detected', icon: Sparkles },
  ];

  return (
    <div className="h-[360px] overflow-y-auto divide-y divide-slate-800/60">
      {items.map(({ type, label, detail, icon: Icon }, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
          <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-200">{label}</span>
              <ProvenanceLabel type={type} size="xs" />
            </div>
            <p className="text-xs font-mono text-slate-500 leading-snug break-all">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Threat Intel Tab ──────────────────────────────────────────────────────────
const ThreatIntelTab: React.FC = () => (
  <div className="h-[360px] overflow-y-auto px-4 py-3 space-y-3">
    {/* IOC table */}
    <div className="bg-[#070b14] border border-slate-800 rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
        <Radio className="w-3 h-3 text-purple-400" />
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Indicators of Compromise</span>
      </div>
      <div className="divide-y divide-slate-800/60">
        {[
          { ioc: '185.234.219.12', type: 'IPv4', rep: 'MALICIOUS', tags: ['Tor', 'BEC'] },
          { ioc: 'paypal-verify.net', type: 'Domain', rep: 'MALICIOUS', tags: ['Squatting', 'Phish'] },
          { ioc: 'login-secure.xyz', type: 'Domain', rep: 'SUSPICIOUS', tags: ['New', 'Redirect'] },
          { ioc: 'AS49870 / Pindc LLC', type: 'ASN', rep: 'SUSPICIOUS', tags: ['Bulletproof'] },
        ].map(({ ioc, type, rep, tags }) => (
          <div key={ioc} className="flex items-center gap-2 px-3 py-2">
            <Badge variant={rep === 'MALICIOUS' ? 'malicious' : 'suspicious'} size="sm">{rep}</Badge>
            <span className="text-xs font-mono text-slate-300 flex-1 truncate">{ioc}</span>
            <span className="text-xs font-mono text-slate-600 shrink-0">{type}</span>
            <div className="flex gap-1">
              {tags.map(t => <Badge key={t} variant="outline" size="sm">{t}</Badge>)}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* MITRE mappings */}
    <div className="bg-[#070b14] border border-slate-800 rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
        <Cpu className="w-3 h-3 text-amber-400" />
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">MITRE ATT&CK Mappings</span>
      </div>
      <div className="p-3 space-y-2">
        <MitreBadge technique="T1566.001 - Phishing: Spearphishing Link" semanticTone="danger" />
        <MitreBadge technique="T1078 - Valid Accounts" semanticTone="amber" />
        <MitreBadge technique="T1204.001 - User Execution: Malicious Link" semanticTone="amber" />
        <MitreBadge technique="T1598.003 - Phishing for Information: Spearphishing Link" semanticTone="danger" />
      </div>
    </div>
  </div>
);

// ── ProductShowcase ───────────────────────────────────────────────────────────

export const ProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('graph');

  const tabContent: Record<ShowcaseTab, React.ReactNode> = {
    graph: <GraphTab />,
    timeline: <TimelineTab />,
    evidence: <EvidenceTab />,
    intel: <ThreatIntelTab />,
  };

  const annotations = [
    { tab: 'graph' as ShowcaseTab, text: 'Fully interactive entity relationship graph with pivot-to-investigate' },
    { tab: 'timeline' as ShowcaseTab, text: 'Chronological investigation timeline with provenance classification' },
    { tab: 'evidence' as ShowcaseTab, text: 'Tamper-evident forensic evidence ledger with source attribution' },
    { tab: 'intel' as ShowcaseTab, text: 'Live threat intelligence with IOC correlation and MITRE ATT&CK mapping' },
  ];

  const currentAnnotation = annotations.find(a => a.tab === activeTab);

  return (
    <section
      id="technology"
      className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
      aria-labelledby="showcase-heading"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-mono font-bold text-sky-400/70 tracking-widest uppercase mb-4">
          Investigator Workspace
        </p>
        <h2
          id="showcase-heading"
          className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
        >
          Built for Real Investigations.
        </h2>
        <p className="text-slate-400 text-base max-w-xl mb-10 leading-relaxed">
          The AShieldER investigator workspace gives analysts a unified view of every evidence artifact,
          relationship, and timeline event — all in one investigation context.
        </p>

        {/* Workspace frame */}
        <div className="bg-[#0c1322] border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#070b14] border-b border-slate-800">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs font-mono text-slate-500 flex-1">
              Investigator Workspace — Case #A2291 · PayPal Brand Impersonation Campaign
            </span>
            <SeverityBadge severity="MALICIOUS" size="sm" showDot />
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-slate-800 bg-[#070b14]/60">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-sky-400 border-sky-400 bg-sky-500/5'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div role="tabpanel">
            {tabContent[activeTab]}
          </div>

          {/* Annotation bar */}
          <div className="px-4 py-2 bg-[#070b14]/40 border-t border-slate-800/60">
            <p className="text-xs font-mono text-slate-500 flex items-center gap-2">
              <Compass className="w-3 h-3 text-sky-500/60 shrink-0" />
              {currentAnnotation?.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
