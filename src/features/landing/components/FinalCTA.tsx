import React from 'react';
import { Button } from '../../../components/ui/Button.tsx';
import { AshielderLogo } from '../../../components/ui/AshielderLogo.tsx';
import { uiStore } from '../../../stores/ui-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const auth = useAuth();
  const handleAnalyze = () => uiStore.navigate(auth.isAuthenticated ? '/overview' : '/login');
  const handleExplore = () => {
    const el = document.querySelector('#product');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="py-24 px-4 sm:px-6 border-t border-slate-800/60"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AshielderLogo size="lg" variant="badge" theme="dark" tagline="Smarter Threat Detection" />
        </div>

        <h2
          id="cta-heading"
          className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5"
        >
          Investigate Beyond the Inbox.
        </h2>

        <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
          Turn suspicious emails into connected evidence, actionable intelligence, and clear investigation paths.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyze}
            className="font-semibold justify-center"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {auth.isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleExplore}
            className="justify-center border-slate-700 text-slate-300 hover:text-white hover:border-slate-500"
          >
            Explore the Platform
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-10 text-xs font-mono text-slate-600">
          Enterprise-grade · Role-based access · Forensic evidence chain · Tamper-evident
        </p>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <AshielderLogo size="sm" variant="full" theme="dark" tagline="" />
          <span className="hidden sm:inline-block w-px h-4 bg-slate-800" />
          <p className="text-xs font-mono text-slate-500">
            © 2026 AShieldER · AI-Powered Threat Forensics
          </p>
        </div>
        <div className="flex items-center gap-6">
          {['Privacy', 'Security', 'Contact'].map((link) => (
            <button
              key={link}
              type="button"
              className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
