import React from 'react';
import { uiStore } from '../../../stores/ui-store.ts';
import { useAuth, authStore } from '../../../stores/auth-store.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';

// ─── Product UI Mockup Panel (Landing Page Light Enterprise Preview) ────────

const ProductMockup: React.FC = () => {
  const [currentSrc, setCurrentSrc] = React.useState<string>(
    "/ChatGPT Image Sep 18, 2026, 03_19_53 PM.png"
  );

  return (
    <div className="relative w-full max-w-[860px] select-none" aria-hidden="true">
      {/* Atmospheric backdrop glow */}
      <div className="absolute inset-0 rounded-3xl bg-sky-400/15 blur-2xl pointer-events-none" />

      {/* Application Window Frame (Using exact shared reference mockup image) */}
      <div className="light-preview relative rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-[#f4f7fb] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_30px_rgba(24,191,255,0.12)] overflow-hidden flex flex-col font-sans">
        <img
          src={currentSrc}
          alt="AShieldER Threat Forensic Investigator case-A2291"
          className="w-full h-auto block select-none object-contain"
          referrerPolicy="no-referrer"
          onError={() => {
            if (currentSrc !== "/threat-investigator-mockup.svg") {
              setCurrentSrc("/threat-investigator-mockup.svg");
            }
          }}
        />
      </div>
    </div>
  );
};

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
  const handleAnalyzeEmail = () => {
    if (!auth.isAuthenticated) {
      authStore.login('investigator@ashielder.io', 'demo');
    }
    uiStore.openWorkflowModal('eml');
  };
  const handleExplore = () => {
    const el = document.querySelector('#product');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden"
      aria-label="Hero"
    >
      {/* 1. SUBTLE SECURITY GRID: Significantly reduced opacity, secondary to content */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25 z-0"
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
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none animate-data-scan z-0"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(8,180,237,0.08) 25%, rgba(24,191,255,0.2) 50%, rgba(8,180,237,0.08) 75%, transparent 100%)',
          boxShadow: '0 0 12px rgba(8,180,237,0.08)',
        }}
      />

      {/* 2. ABSTRACT INVESTIGATION NETWORK: 7 faint peripheral nodes & connecting lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
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
        className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[720px] h-[580px] pointer-events-none hidden lg:block z-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(8,180,237,0.075) 0%, rgba(8,180,237,0.02) 45%, transparent 75%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-12 min-w-0">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6 w-full lg:w-[45%] xl:w-[44%] shrink-0 min-w-0 max-w-xl">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 self-start">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1526] border border-sky-500/30 text-xs font-mono text-sky-400 font-medium shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
                AI-Powered Investigation Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.05]">
              Turn Suspicious Email Into Actionable Intelligence.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              AShieldER analyzes email evidence, correlates threat intelligence, and gives security teams a
              complete investigation path — from detection to forensic reporting.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyzeEmail}
                className="font-semibold sm:w-auto justify-center bg-sky-600 hover:bg-sky-500 text-white shadow-md hover:shadow-sky-500/20 active:scale-[0.99] transition-all cursor-pointer"
                leftIcon={<Search className="w-4 h-4 text-sky-200" aria-hidden="true" />}
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                aria-label="Analyze Email — Launch Forensic Investigation"
              >
                Analyze Email
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleExplore}
                className="sm:w-auto justify-center border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 bg-[#070c18]/60 cursor-pointer"
              >
                Explore the Platform
              </Button>
            </div>

            {/* Quick helper microcopy */}
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 -mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
              <span>Interactive investigation pipeline · Upload .eml or test threat specimens</span>
            </p>

            {/* Capability strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {CAPABILITY_STRIP.map((cap, i) => (
                <span key={cap} className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-600" aria-hidden="true" />}
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
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
