import React from 'react';
import { uiStore } from '../../../stores/ui-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import {
  Mail,
  ShieldAlert,
  Network,
  ArrowRight,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  Radio,
  AlertTriangle,
} from 'lucide-react';

// ─── Product UI Mockup Panel (Landing Page Light Enterprise Preview) ────────

const ProductMockup: React.FC = () => (
  <div className="relative w-full max-w-[760px] select-none" aria-hidden="true">
    {/* Subtle atmospheric backdrop glow */}
    <div className="absolute inset-0 rounded-2xl bg-sky-400/10 blur-xl pointer-events-none" />

    {/* Application Window Frame (Enterprise Light Mode Theme) */}
    <div className="light-preview relative rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12),0_0_20px_rgba(8,180,237,0.08)] overflow-hidden flex flex-col font-sans">
      {/* 1. Top Application Chrome */}
      <div className="h-10 px-3.5 sm:px-4 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          {/* Window action buttons */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/40" />
          </div>
          {/* Path breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-600 shadow-2xs">
            <Lock className="w-3 h-3 text-sky-600 shrink-0" />
            <span className="text-slate-500">ashielder</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">investigator</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">case-A2291</span>
          </div>
        </div>

        {/* Severity & live threat state */}
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-sans text-rose-700 uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Active Threat
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-700">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            MALICIOUS
          </span>
        </div>
      </div>

      {/* 2. Investigation Workflow Stage Bar */}
      <div className="px-3 sm:px-4 py-1.5 bg-slate-50/95 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none shrink-0">
        {[
          { label: 'EMAIL', state: 'done' },
          { label: 'EXTRACT', state: 'done' },
          { label: 'DETECT', state: 'done' },
          { label: 'CORRELATE', state: 'done' },
          { label: 'INTELLIGENCE', state: 'done' },
          { label: 'INVESTIGATE', state: 'active' },
          { label: 'REPORT', state: 'pending' },
        ].map((phase, i) => {
          const isActive = phase.state === 'active';
          const isDone = phase.state === 'done';
          return (
            <React.Fragment key={phase.label}>
              <span
                className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-sky-700 bg-sky-50 border border-sky-300 shadow-xs'
                    : isDone
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                {isDone && <CheckCircle2 className="inline w-2.5 h-2.5 mr-0.5 text-emerald-600" />}
                {phase.label}
              </span>
              {i < 6 && <ArrowRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* 3. Main Multi-Panel Investigation Canvas (Left 30% | Center 42% | Right 28%) */}
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/40">
        {/* ─── LEFT PANEL: Email Evidence, Auth, Composite Risk ─── */}
        <div className="w-full md:w-[30%] shrink-0 p-3 sm:p-3.5 flex flex-col justify-between gap-3 bg-slate-50/70">
          {/* Email Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
              <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                Email Details
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-sans text-slate-400 uppercase tracking-wide block mb-0.5">Subject</span>
                <p className="text-xs font-sans font-bold text-slate-900 leading-snug">
                  Urgent: Verify Your PayPal Account
                </p>
              </div>
              <div className="pt-1.5 border-t border-slate-100">
                <span className="text-[10px] font-sans text-slate-400 uppercase tracking-wide block mb-0.5">Sender</span>
                <p className="text-[11px] font-mono text-slate-700 truncate" title="security-alert@paypal-verify.net">
                  security-alert@paypal-verify.net
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Checks: SPF / DKIM / DMARC */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Authentication
              </span>
              <span className="text-[10px] font-sans font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                FAILED
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-sans text-slate-600">SPF</span>
                <span className="font-sans text-rose-700 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  FAIL
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-sans text-slate-600">DKIM</span>
                <span className="font-sans text-rose-700 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  FAIL
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="font-sans text-slate-600">DMARC</span>
                <span className="font-sans text-rose-700 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  FAIL
                </span>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
              <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Risk Assessment
              </span>
              <span className="text-[10px] font-sans font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase">
                CRITICAL
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-rose-50 border border-rose-200 shrink-0">
                <span className="text-xl font-black font-mono text-rose-700 leading-none">91</span>
                <span className="text-[8px] font-sans text-slate-500 uppercase mt-0.5">/ 100</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-sans font-black text-rose-700 tracking-wide">
                  MALICIOUS
                </p>
                <p className="text-xs font-sans text-slate-500 mt-0.5">
                  High Risk Phishing Attack
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CENTER PANEL: Entity Relationship Graph (5-7 Nodes Max) & Evidence Correlations ─── */}
        <div className="w-full md:w-[42%] shrink-0 p-3 sm:p-3.5 flex flex-col justify-between gap-3 bg-slate-50/40">
          {/* Graph Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col flex-1">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-sky-600" />
                Entity Relationship Graph
              </span>
              <span className="text-[10px] font-sans text-slate-400">5 primary nodes</span>
            </div>

            {/* SVG Graph Canvas (Clean 5-Node Graph: EMAIL -> IP, DOMAIN, URL, ATTACHMENT) */}
            <div className="relative h-[205px] sm:h-[215px] bg-[#f8fafc] rounded-lg border border-slate-200 overflow-hidden shadow-inner">
              <svg width="100%" height="100%" viewBox="0 0 320 210" preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
                <defs>
                  <pattern id="hero-grid-light" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(203,213,225,0.45)" strokeWidth="0.5" />
                  </pattern>
                  <marker id="arrow-hero-light" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" />
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-grid-light)" />

                {/* Edge Connections from EMAIL root to each node */}
                {[
                  [160, 60, 55, 145],   // EMAIL -> IP
                  [160, 60, 125, 160],  // EMAIL -> DOMAIN
                  [160, 60, 195, 160],  // EMAIL -> URL
                  [160, 60, 265, 145],  // EMAIL -> ATTACHMENT
                  [55, 145, 125, 160],  // IP -> DOMAIN
                ].map(([x1, y1, x2, y2], i) => (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow-hero-light)"
                  />
                ))}

                {/* 1. Root EMAIL Node */}
                <circle cx="160" cy="60" r="21" fill="#ffffff" stroke="#08b4ed" strokeWidth="2.5" />
                <text x="160" y="58" textAnchor="middle" fontSize="9" fill="#0284c7" fontFamily="sans-serif" fontWeight="bold">EMAIL</text>
                <text x="160" y="68" textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="sans-serif">SOURCE</text>

                {/* 2. IP Node (Malicious) */}
                <circle cx="55" cy="145" r="18" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
                <text x="55" y="142" textAnchor="middle" fontSize="8" fill="#be123c" fontFamily="sans-serif" fontWeight="bold">IP</text>
                <text x="55" y="152" textAnchor="middle" fontSize="6" fill="#64748b" fontFamily="sans-serif">RELAY</text>

                {/* 3. DOMAIN Node (Malicious) */}
                <circle cx="125" cy="160" r="18" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
                <text x="125" y="157" textAnchor="middle" fontSize="7.5" fill="#be123c" fontFamily="sans-serif" fontWeight="bold">DOMAIN</text>
                <text x="125" y="167" textAnchor="middle" fontSize="6" fill="#64748b" fontFamily="sans-serif">SPOOFED</text>

                {/* 4. URL Node (Suspicious) */}
                <circle cx="195" cy="160" r="18" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
                <text x="195" y="157" textAnchor="middle" fontSize="8" fill="#b45309" fontFamily="sans-serif" fontWeight="bold">URL</text>
                <text x="195" y="167" textAnchor="middle" fontSize="6" fill="#64748b" fontFamily="sans-serif">HARVEST</text>

                {/* 5. ATTACHMENT Node (Malicious) */}
                <circle cx="265" cy="145" r="18" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
                <text x="265" y="152" textAnchor="middle" fontSize="6.5" fill="#be123c" fontFamily="sans-serif" fontWeight="bold">ATTACHMENT</text>
                <text x="265" y="162" textAnchor="middle" fontSize="6" fill="#64748b" fontFamily="sans-serif">PAYLOAD</text>
              </svg>

              {/* Clear Status Legend */}
              <div className="absolute top-2.5 right-2.5 bg-white/95 border border-slate-200 rounded px-2 py-1 flex items-center gap-2.5 text-[9.5px] font-sans text-slate-600 shadow-xs">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" />Malicious</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Suspicious</span>
              </div>
            </div>
          </div>

          {/* Evidence Correlations Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                Evidence Correlations
              </span>
              <span className="text-slate-400 text-[10px] font-sans">3 confirmed matches</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-700 truncate">Domain registered 2 days ago mimics PayPal brand</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-700 truncate">Sender IP is a known unauthorized relay</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700 truncate">Embedded link leads to fake login credential harvester</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL: Threat Indicators Only (IP, Domain, URL + values + status) ─── */}
        <div className="w-full md:w-[28%] shrink-0 p-3 sm:p-3.5 flex flex-col justify-between bg-slate-50/70">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-2.5 h-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-600" />
                Threat Indicators
              </span>
              <span className="text-[10px] font-sans text-slate-400">3 detected</span>
            </div>
            <div className="space-y-2.5 flex-1 flex flex-col justify-between">
              {/* Indicator 1: IP */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-sans text-slate-500 font-semibold uppercase">IP</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    MALICIOUS
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-900 font-bold truncate select-all" title="185.234.21.9">
                  185.234.21.9
                </p>
                <p className="text-[11px] font-sans text-slate-500 mt-0.5">
                  Unauthorized Origin IP
                </p>
              </div>

              {/* Indicator 2: Domain */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-sans text-slate-500 font-semibold uppercase">Domain</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    MALICIOUS
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-900 font-bold truncate select-all" title="paypal-verify.net">
                  paypal-verify.net
                </p>
                <p className="text-[11px] font-sans text-slate-500 mt-0.5">
                  Brand Impersonation
                </p>
              </div>

              {/* Indicator 3: URL */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/90">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-sans text-slate-500 font-semibold uppercase">URL</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    SUSPICIOUS
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-900 font-bold truncate select-all" title="login-secure.xyz">
                  login-secure.xyz
                </p>
                <p className="text-[11px] font-sans text-slate-500 mt-0.5">
                  Credential Harvester
                </p>
              </div>
            </div>
          </div>
        </div>
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
      {/* 1. SUBTLE SECURITY GRID: Significantly reduced opacity, secondary to content */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(8,180,237,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8,180,237,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
        }}
      />

      {/* 4. OCCASIONAL DATA SCAN: Faint horizontal scan line (every 6s sweep, non-intrusive) */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none animate-data-scan"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(8,180,237,0.08) 25%, rgba(24,191,255,0.2) 50%, rgba(8,180,237,0.08) 75%, transparent 100%)',
          boxShadow: '0 0 12px rgba(8,180,237,0.08)',
        }}
      />

      {/* 2. ABSTRACT INVESTIGATION NETWORK: 7 faint peripheral nodes & connecting lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="w-full h-full opacity-60"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="faint-node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#08b4ed" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08b4ed" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connecting lines between peripheral nodes */}
          <g className="animate-line-faint" stroke="#08b4ed" strokeWidth="1" strokeDasharray="3 3">
            {/* Top-left to left-mid */}
            <line x1="80" y1="140" x2="190" y2="280" />
            {/* Left-mid to bottom-left */}
            <line x1="190" y1="280" x2="110" y2="720" />
            {/* Top-center-right across top margin */}
            <line x1="720" y1="90" x2="1020" y2="130" />
            {/* Top-right to right-mid */}
            <line x1="1020" y1="130" x2="1340" y2="240" />
            {/* Right-mid to bottom-right */}
            <line x1="1340" y1="240" x2="1280" y2="680" />
            {/* Bottom-right link */}
            <line x1="1280" y1="680" x2="980" y2="790" />
          </g>

          {/* 7 Faint peripheral nodes (outer edges of viewport, away from text/product) */}
          {/* Node 1: Far top-left */}
          <g className="animate-node-faint">
            <circle cx="80" cy="140" r="10" fill="url(#faint-node-glow)" />
            <circle cx="80" cy="140" r="2.5" fill="#08b4ed" />
          </g>

          {/* Node 2: Left-edge margin */}
          <g className="animate-node-faint" style={{ animationDelay: '1.8s' }}>
            <circle cx="190" cy="280" r="8" fill="url(#faint-node-glow)" />
            <circle cx="190" cy="280" r="2" fill="#08b4ed" />
          </g>

          {/* Node 3: Far bottom-left */}
          <g className="animate-node-faint" style={{ animationDelay: '3.2s' }}>
            <circle cx="110" cy="720" r="10" fill="url(#faint-node-glow)" />
            <circle cx="110" cy="720" r="2.5" fill="#08b4ed" />
          </g>

          {/* Node 4: Top center-right header margin */}
          <g className="animate-node-faint" style={{ animationDelay: '0.9s' }}>
            <circle cx="720" cy="90" r="8" fill="url(#faint-node-glow)" />
            <circle cx="720" cy="90" r="2" fill="#08b4ed" />
          </g>

          {/* Node 5: Top-right header perimeter */}
          <g className="animate-node-faint" style={{ animationDelay: '2.4s' }}>
            <circle cx="1020" cy="130" r="9" fill="url(#faint-node-glow)" />
            <circle cx="1020" cy="130" r="2.5" fill="#08b4ed" />
          </g>

          {/* Node 6: Far right margin */}
          <g className="animate-node-faint" style={{ animationDelay: '4.1s' }}>
            <circle cx="1340" cy="240" r="11" fill="url(#faint-node-glow)" />
            <circle cx="1340" cy="240" r="3" fill="#08b4ed" />
          </g>

          {/* Node 7: Far bottom-right */}
          <g className="animate-node-faint" style={{ animationDelay: '1.5s' }}>
            <circle cx="1280" cy="680" r="9" fill="url(#faint-node-glow)" />
            <circle cx="1280" cy="680" r="2.5" fill="#08b4ed" />
          </g>
        </svg>
      </div>

      {/* 3. SOFT PRODUCT GLOW: Subtle cyan/blue radial glow centered behind right-side Investigator Workspace */}
      <div
        className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[720px] h-[580px] pointer-events-none hidden lg:block"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(8,180,237,0.075) 0%, rgba(8,180,237,0.02) 45%, transparent 75%)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-12 min-w-0">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6 w-full lg:w-[43%] xl:w-[42%] shrink-0 min-w-0 max-w-xl">
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
          <div id="product" className="w-full lg:w-[57%] xl:w-[58%] min-w-0 flex justify-center lg:justify-end">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
