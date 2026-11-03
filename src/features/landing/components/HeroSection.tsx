import React, { useState } from 'react';
import { uiStore } from '../../../stores/ui-store.ts';
import { useAuth, authStore } from '../../../stores/auth-store.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { ThreatInvestigatorIllustration } from '../../../components/common/ThreatInvestigatorIllustration.tsx';
import { ThreatUniverse3D, ThreatNodeData } from './ThreatUniverse3D.tsx';

// ─── Product UI Mockup Panel (Landing Page Dark Enterprise Preview) ────────

const ProductMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-[860px] select-none" aria-hidden="true">
      {/* Noble-gas Argon backdrop glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500/20 via-cyan-400/15 to-indigo-500/10 blur-2xl pointer-events-none" />

      {/* Application Window Frame */}
      <div className="dark-preview relative rounded-2xl sm:rounded-3xl border border-sky-500/30 bg-[#030913]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(24,191,255,0.2)] overflow-hidden flex flex-col font-sans backdrop-blur-xs">
        <ThreatInvestigatorIllustration className="w-full h-auto block select-none object-contain" />
      </div>
    </div>
  );
};

// ─── Capability Badges ───────────────────────────────────────────────────

const CAPABILITY_STRIP = [
  'Email Threat Detection',
  'Threat Intelligence',
  'Geolocation',
  'Digital Forensics',
  'Evidence Correlation',
];

export const HeroSection: React.FC = () => {
  const auth = useAuth();
  const [, setHoveredNode] = useState<ThreatNodeData | null>(null);

  const handleAnalyzeEmail = () => {
    if (!auth.isAuthenticated) {
      authStore.login('investigator@ashielder.io', 'demo');
    }
    uiStore.openWorkflowModal('eml');
  };

  const handleDiscoverHowItWorks = () => {
    const el = document.getElementById('how-it-works') || document.getElementById('product');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (!auth.isAuthenticated) {
        authStore.login('investigator@ashielder.io', 'demo');
      }
      uiStore.navigate('/overview');
    }
  };

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-[#060a14]"
      aria-label="Hero"
    >
      {/* ─── 3D Threat Intelligence Universe Background ─────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-auto" aria-hidden="true">
        <ThreatUniverse3D onNodeHover={setHoveredNode} />
      </div>

      {/* Subtle radial depth scrim to guarantee razor-sharp text legibility */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 25% 45%, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.45) 60%, transparent 100%),
            radial-gradient(circle at 85% 50%, rgba(6,10,20,0.4) 0%, transparent 70%),
            linear-gradient(to bottom, rgba(6,10,20,0.3) 0%, transparent 30%, transparent 70%, rgba(6,10,20,0.9) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Subtle hairline security grid for forensic alignment */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-1"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(8,180,237,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8,180,237,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 95%)',
        }}
      />

      {/* ─── Hero Content Foreground ────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pointer-events-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-14 min-w-0">
          {/* Left: Copy & Actions */}
          <div className="flex flex-col gap-6 w-full lg:w-[46%] xl:w-[45%] shrink-0 min-w-0 max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center self-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1526]/90 border border-sky-500/30 text-xs font-mono text-sky-400 font-semibold tracking-wider uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                AI-POWERED EMAIL THREAT INTELLIGENCE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.05]">
              Every Threat Leaves a Trace.
            </h1>

            {/* Supporting Statement */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Detect sophisticated email threats. Trace malicious infrastructure. Transform digital
              evidence into actionable intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyzeEmail}
                className="font-semibold sm:w-auto justify-center bg-sky-600 hover:bg-sky-500 text-white shadow-md hover:shadow-sky-500/25 active:scale-[0.99] transition-all cursor-pointer"
                leftIcon={<Search className="w-4 h-4 text-sky-200" aria-hidden="true" />}
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                aria-label="Explore AShieldER — Launch Forensic Investigation"
              >
                Explore AShieldER
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleDiscoverHowItWorks}
                className="sm:w-auto justify-center border-slate-700 text-slate-200 hover:text-white hover:border-sky-500/50 bg-[#070c18]/80 cursor-pointer"
                aria-label="Discover How It Works"
              >
                Discover How It Works
              </Button>
            </div>

            {/* Interactive hint */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono -mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
              <span>Interactive Threat Universe: Hover nodes to inspect correlated forensic vectors</span>
            </div>

            {/* Capability Strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-slate-800/80">
              {CAPABILITY_STRIP.map((cap, i) => (
                <span key={cap} className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-600" aria-hidden="true" />}
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Authentic Threat Investigator Product Mockup */}
          <div id="product" className="w-full lg:w-[54%] xl:w-[55%] min-w-0 flex justify-center lg:justify-end">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
