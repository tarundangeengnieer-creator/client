import React from 'react';
import { uiStore } from '../../../stores/ui-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { Badge } from '../../../components/ui/Badge.tsx';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import { MitreBadge } from '../../../components/ui/MitreBadge.tsx';
import { ProvenanceLabel } from '../../../components/ui/ProvenanceLabel.tsx';
import {
  Mail,
  Globe,
  ShieldAlert,
  AlertTriangle,
  Network,
  FileText,
  ArrowRight,
  Lock,
  MapPin,
  Server,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Radio,
  Sparkles,
} from 'lucide-react';

// ─── Mini product UI building blocks ───────────────────────────────────────

const RiskScore: React.FC<{ score: number }> = ({ score }) => {
  const color =
    score >= 80
      ? 'text-rose-400 border-rose-500/40'
      : score >= 50
      ? 'text-amber-400 border-amber-500/40'
      : 'text-emerald-400 border-emerald-500/40';
  return (
    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border ${color} bg-[#0c1322]`}>
      <span className={`text-2xl font-black font-mono ${color.split(' ')[0]}`}>{score}</span>
      <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Risk</span>
    </div>
  );
};

const AuthRow: React.FC<{ label: string; status: 'pass' | 'fail' | 'neutral' }> = ({ label, status }) => {
  const icon =
    status === 'pass' ? (
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
    ) : status === 'fail' ? (
      <XCircle className="w-3.5 h-3.5 text-rose-400" />
    ) : (
      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
    );
  const textColor =
    status === 'pass' ? 'text-emerald-400' : status === 'fail' ? 'text-rose-400' : 'text-amber-400';
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-800/80 last:border-0">
      <span className="text-xs font-mono text-slate-400">{label}</span>
      <div className={`flex items-center gap-1 text-xs font-mono font-bold ${textColor}`}>
        {icon}
        <span>{status === 'pass' ? 'PASS' : status === 'fail' ? 'FAIL' : 'NEUTRAL'}</span>
      </div>
    </div>
  );
};

const IOCRow: React.FC<{ indicator: string; type: string; rep: string }> = ({ indicator, type, rep }) => (
  <div className="flex items-center gap-2 py-1 border-b border-slate-800/80 last:border-0">
    <Badge variant={rep === 'MALICIOUS' ? 'malicious' : rep === 'SUSPICIOUS' ? 'suspicious' : 'info'} size="sm">
      {rep}
    </Badge>
    <span className="text-xs font-mono text-slate-300 break-all leading-tight flex-1">{indicator}</span>
    <span className="text-xs text-slate-500 font-mono shrink-0">{type}</span>
  </div>
);

// ─── Product UI Mockup Panel ────────────────────────────────────────────────

const ProductMockup: React.FC = () => (
  <div className="relative w-full select-none" aria-hidden="true">
    {/* Outer glow frame */}
    <div className="absolute inset-0 rounded-xl bg-sky-500/5 blur-2xl pointer-events-none" />

    <div className="relative bg-[#0c1322] border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
      {/* Workspace top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#070b14] border-b border-slate-800">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <div className="flex-1 mx-3 h-5 bg-slate-800/60 rounded flex items-center px-2 gap-2">
          <Lock className="w-2.5 h-2.5 text-slate-500" />
          <span className="text-xs font-mono text-slate-500">ashielder / investigator / case-A2291</span>
        </div>
        <SeverityBadge severity="MALICIOUS" size="sm" showDot />
      </div>

      {/* Attack chain navigator */}
      <div className="flex items-center gap-0 px-4 py-2 bg-[#070b14]/60 border-b border-slate-800/60 overflow-x-auto">
        {['EMAIL', 'EXTRACT', 'DETECT', 'CORRELATE', 'INTELLIGENCE', 'INVESTIGATE', 'REPORT'].map((phase, i) => {
          const isActive = i === 3;
          const isPast = i < 3;
          return (
            <React.Fragment key={phase}>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                  isActive
                    ? 'text-sky-300 bg-sky-500/10 border border-sky-500/30'
                    : isPast
                    ? 'text-emerald-400 opacity-70'
                    : 'text-slate-600'
                }`}
              >
                {isPast && <CheckCircle2 className="inline w-2 h-2 mr-0.5 text-emerald-400" />}
                {phase}
              </span>
              {i < 6 && <ArrowRight className="w-2.5 h-2.5 text-slate-700 mx-0.5 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main workspace 3-col grid */}
      <div className="grid grid-cols-12 divide-x divide-slate-800/60 min-h-[340px]">
        {/* Left: Email entity + auth */}
        <div className="col-span-4 p-3 space-y-3">
          {/* Email entity card */}
          <div className="bg-[#070b14] border border-slate-800 rounded-lg p-2.5">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono font-bold text-slate-200 leading-tight mb-0.5">
                  Urgent: Verify Your PayPal Account
                </p>
                <p className="text-xs text-slate-500 font-mono break-all leading-tight">security-alert@paypal-verify.net</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <ProvenanceLabel type="OBSERVED EVIDENCE" size="xs" showIcon />
            </div>
          </div>

          {/* Auth results */}
          <div className="bg-[#070b14] border border-slate-800 rounded-lg p-2.5">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Authentication
            </p>
            <AuthRow label="SPF" status="fail" />
            <AuthRow label="DKIM" status="fail" />
            <AuthRow label="DMARC" status="fail" />
          </div>

          {/* Risk score */}
          <div className="bg-[#070b14] border border-slate-800 rounded-lg p-2.5 flex items-center gap-3">
            <RiskScore score={91} />
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Composite Risk</p>
              <p className="text-xs font-mono font-bold text-rose-400 mt-0.5">MALICIOUS</p>
              <p className="text-xs text-slate-500 font-mono">Confidence: 94%</p>
            </div>
          </div>
        </div>

        {/* Center: Graph visualization */}
        <div className="col-span-5 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Network className="w-3 h-3 text-sky-400" />
              Entity Relationship Graph
            </span>
            <Badge variant="info" size="sm">7 nodes</Badge>
          </div>
          {/* SVG graph visualization */}
          <div className="flex-1 relative bg-[#070b14] rounded-lg border border-slate-800/60 overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 280 220" className="absolute inset-0">
              <defs>
                <marker id="arrow-hero" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="#1e293b" />
                </marker>
              </defs>
              {/* Edges */}
              {[
                [140, 110, 70, 60], [140, 110, 210, 60], [140, 110, 70, 160],
                [140, 110, 210, 160], [70, 60, 30, 30], [210, 60, 250, 30],
              ].map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#1e293b"
                  strokeWidth="1"
                  markerEnd="url(#arrow-hero)"
                />
              ))}
              {/* Central email node */}
              <circle cx="140" cy="110" r="18" fill="#0c1322" stroke="#08b4ed" strokeWidth="1.5" />
              <text x="140" y="107" textAnchor="middle" fontSize="7" fill="#08b4ed" fontFamily="monospace">EMAIL</text>
              <text x="140" y="116" textAnchor="middle" fontSize="6" fill="#64748b" fontFamily="monospace">entity</text>

              {/* IP node - malicious */}
              <circle cx="70" cy="60" r="13" fill="#0c1322" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="70" y="57" textAnchor="middle" fontSize="6" fill="#f43f5e" fontFamily="monospace">IP</text>
              <text x="70" y="65" textAnchor="middle" fontSize="5" fill="#64748b" fontFamily="monospace">185.234.x</text>

              {/* Domain node - malicious */}
              <circle cx="210" cy="60" r="13" fill="#0c1322" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="210" y="57" textAnchor="middle" fontSize="6" fill="#f43f5e" fontFamily="monospace">DOMAIN</text>
              <text x="210" y="65" textAnchor="middle" fontSize="5" fill="#64748b" fontFamily="monospace">paypal-v...</text>

              {/* URL node - suspicious */}
              <circle cx="70" cy="160" r="13" fill="#0c1322" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="70" y="157" textAnchor="middle" fontSize="6" fill="#fbbf24" fontFamily="monospace">URL</text>
              <text x="70" y="165" textAnchor="middle" fontSize="5" fill="#64748b" fontFamily="monospace">3 links</text>

              {/* ASN node */}
              <circle cx="210" cy="160" r="13" fill="#0c1322" stroke="#64748b" strokeWidth="1" />
              <text x="210" y="157" textAnchor="middle" fontSize="6" fill="#94a3b8" fontFamily="monospace">ASN</text>
              <text x="210" y="165" textAnchor="middle" fontSize="5" fill="#64748b" fontFamily="monospace">AS49870</text>

              {/* Geo node */}
              <circle cx="30" cy="30" r="10" fill="#0c1322" stroke="#a855f7" strokeWidth="1" />
              <text x="30" y="33" textAnchor="middle" fontSize="6" fill="#a855f7" fontFamily="monospace">GEO</text>

              {/* Actor node */}
              <circle cx="250" cy="30" r="10" fill="#0c1322" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="250" y="33" textAnchor="middle" fontSize="6" fill="#f43f5e" fontFamily="monospace">TA</text>
            </svg>
          </div>
        </div>

        {/* Right: IOCs + MITRE */}
        <div className="col-span-3 p-3 space-y-3">
          <div className="bg-[#070b14] border border-slate-800 rounded-lg p-2.5">
            <div className="flex items-center gap-1 mb-1.5">
              <Radio className="w-3 h-3 text-purple-400" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Indicators</p>
            </div>
            <IOCRow indicator="185.234.219.12" type="IP" rep="MALICIOUS" />
            <IOCRow indicator="paypal-verify.net" type="DOM" rep="MALICIOUS" />
            <IOCRow indicator="login-secure.xyz" type="URL" rep="SUSPICIOUS" />
          </div>

          <div className="bg-[#070b14] border border-slate-800 rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">MITRE ATT&CK</p>
            </div>
            <MitreBadge technique="T1566.001 - Phishing: Spear Phishing Link" size="sm" semanticTone="danger" />
            <MitreBadge technique="T1078 - Valid Accounts" size="sm" semanticTone="amber" />
          </div>

          <div className="bg-[#070b14] border border-slate-800 rounded-lg p-2.5">
            <div className="flex items-center gap-1 mb-1.5">
              <MapPin className="w-3 h-3 text-purple-400" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Origin</p>
            </div>
            <div className="space-y-1">
              {[
                { k: 'Country', v: 'Russia (RU)' },
                { k: 'ASN', v: 'AS49870' },
                { k: 'Org', v: 'Pindc LLC' },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between">
                  <span className="text-xs font-mono text-slate-500">{k}</span>
                  <span className="text-xs font-mono text-slate-300">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline strip */}
      <div className="border-t border-slate-800/60 px-4 py-2 bg-[#070b14]/40 flex items-center gap-3 overflow-x-auto">
        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
        {[
          { t: '09:12', label: 'Email received', color: 'bg-sky-400' },
          { t: '09:12', label: 'SPF/DKIM fail', color: 'bg-rose-400' },
          { t: '09:13', label: 'IP lookup', color: 'bg-purple-400' },
          { t: '09:14', label: 'IOC match ×3', color: 'bg-rose-400' },
          { t: '09:14', label: 'AI analysis', color: 'bg-sky-400' },
          { t: '09:15', label: 'Risk: 91', color: 'bg-rose-400' },
        ].map((ev, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-1 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${ev.color}`} />
              <span className="text-xs font-mono text-slate-500">{ev.t}</span>
              <span className="text-xs font-mono text-slate-400">{ev.label}</span>
            </div>
            {i < 5 && <span className="w-4 h-px bg-slate-800 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* Callout annotations */}
    <div className="absolute -right-2 top-16 hidden xl:flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-px bg-sky-500/40" />
        <span className="text-xs font-mono text-sky-400/70 whitespace-nowrap">Risk Scoring</span>
      </div>
    </div>
  </div>
);

// ─── Hero Section ─────────────────────────────────────────────────────────

const CAPABILITY_STRIP = [
  'Email Threat Detection',
  'Threat Intelligence',
  'Geolocation',
  'Digital Forensics',
  'Evidence Correlation',
];

export const HeroSection: React.FC = () => {
  const auth = useAuth();
  const handleAnalyze = () => uiStore.navigate(auth.isAuthenticated ? '/overview' : '/login');
  const handleExplore = () => {
    const el = document.querySelector('#product');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 px-4 sm:px-6 overflow-hidden"
      aria-label="Hero"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(8,180,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8,180,237,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(8,180,237,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6 max-w-xl">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 self-start">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                AI-Powered Investigation Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.05]">
              Turn Suspicious Email Into{' '}
              <span className="text-sky-400">Actionable Intelligence.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              AShieldER analyzes email evidence, correlates threat intelligence, and gives security teams a
              complete investigation path — from detection to forensic reporting.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyze}
                className="font-semibold sm:w-auto justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {auth.isAuthenticated ? 'Go to Dashboard' : 'Analyze an Email'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleExplore}
                className="sm:w-auto justify-center border-slate-700 text-slate-300 hover:text-white hover:border-slate-500"
              >
                Explore Platform
              </Button>
            </div>

            {/* Capability strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {CAPABILITY_STRIP.map((cap, i) => (
                <span key={cap} className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-700" />}
                  <CheckCircle2 className="w-3 h-3 text-sky-500/70" />
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Product mockup */}
          <div id="product" className="w-full max-w-2xl mx-auto lg:mx-0">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
