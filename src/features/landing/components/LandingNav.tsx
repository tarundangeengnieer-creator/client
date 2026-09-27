import React, { useState, useEffect } from 'react';
import { AshielderLogo } from '../../../components/ui/AshielderLogo.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { uiStore, useUI } from '../../../stores/ui-store.ts';
import { useAuth, authStore } from '../../../stores/auth-store.ts';
import { Menu, X, Search } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Technology', href: '#technology' },
  { label: 'Resources', href: '#resources' },
];

export const LandingNav: React.FC = () => {
  const ui = useUI();
  const auth = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignIn = () => {
    setMobileOpen(false);
    uiStore.navigate(auth.isAuthenticated ? '/overview' : '/login');
  };

  const handleAnalyze = () => {
    setMobileOpen(false);
    if (!auth.isAuthenticated) {
      authStore.login('investigator@ashielder.io', 'demo');
    }
    uiStore.openWorkflowModal('eml');
  };

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#060a14]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-[#060a14]/90 backdrop-blur-md border-b border-slate-800/40'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a14] rounded cursor-pointer"
          aria-label="AShieldER Home"
        >
          <span aria-hidden="true" className="flex items-center">
            <AshielderLogo size="sm" variant="full" theme="dark" tagline="" />
          </span>
        </button>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-2" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                type="button"
                onClick={() => scrollToSection(link.href)}
                className="flex items-center px-3.5 py-1.5 text-sm text-slate-300 hover:text-white transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a14] cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={handleAnalyze}
            className="font-semibold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
            leftIcon={<Search className="w-3.5 h-3.5 text-sky-200" aria-hidden="true" />}
            aria-label="Analyze Email — Launch Forensic Investigation"
          >
            Analyze Email
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#060a14]/98 backdrop-blur-md border-b border-slate-800">
          <ul className="flex flex-col px-4 py-3 gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 border-t border-slate-800 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleAnalyze}
              className="w-full justify-center font-semibold text-xs bg-sky-600 hover:bg-sky-500 text-white"
              leftIcon={<Search className="w-3.5 h-3.5 text-sky-200" aria-hidden="true" />}
            >
              Analyze Email
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleSignIn}
              className="w-full justify-center text-xs text-slate-300"
            >
              {auth.isAuthenticated ? 'Dashboard' : 'Sign In'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
