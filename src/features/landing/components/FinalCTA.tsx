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
            {auth.isAuthenticated ? 'Go to Dashboard' : 'Analyze an Email'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleExplore}
            className="justify-center border-slate-700 text-slate-300 hover:text-white hover:border-slate-500"
          >
            Explore Platform
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-10 text-xs font-mono text-slate-600">
          Enterprise-grade · Role-based access · Forensic evidence chain · Tamper-evident
        </p>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-20 pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <AshielderLogo size="sm" variant="full" theme="dark" tagline="" />
        <p className="text-xs font-mono text-slate-600">
          © 2026 AShieldER · AI-Powered Email Threat Detection & Forensic Intelligence
        </p>
        <div className="flex items-center gap-4">
          {['Privacy', 'Security', 'Contact'].map((link) => (
            <button
              key={link}
              type="button"
              className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
