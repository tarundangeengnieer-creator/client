import React, { useEffect, useRef } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { ForensicWorkflowModal } from '../investigation/ForensicWorkflowModal.tsx';
import { LandingNav } from './components/LandingNav.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ProblemSection } from './components/ProblemSection.tsx';
import { WorkflowSection } from './components/WorkflowSection.tsx';
import { ProductShowcase } from './components/ProductShowcase.tsx';
import { EvidenceProvenance } from './components/EvidenceProvenance.tsx';
import { DetectionGrid } from './components/DetectionGrid.tsx';
import { AlertToInvestigation } from './components/AlertToInvestigation.tsx';
import { IntelligenceSection } from './components/IntelligenceSection.tsx';
import { ForensicReportSection } from './components/ForensicReportSection.tsx';
import { TargetUsers } from './components/TargetUsers.tsx';
import { FinalCTA } from './components/FinalCTA.tsx';

/**
 * AShieldER Public Landing Page
 *
 * Served at `/` for unauthenticated visitors.
 * Uses only existing AShieldER UI components and design tokens.
 * Does NOT wrap in AppShell — standalone dark-mode page.
 */
export const LandingPage: React.FC = () => {
  const ui = useUI();
  const mainRef = useRef<HTMLDivElement>(null);

  // Ensure the document is in dark mode for the landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Restore scroll position to top when landing page mounts
    window.scrollTo(0, 0);
  }, []);

  // Intersection Observer for scroll-reveal animations
  useEffect(() => {
    const sections = mainRef.current?.querySelectorAll('section');
    if (!sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach((section, i) => {
      if (i === 0) return; // Hero already visible
      (section as HTMLElement).style.opacity = '0';
      (section as HTMLElement).style.transform = 'translateY(20px)';
      (section as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#060a14] text-slate-100 font-sans antialiased"
      style={{ colorScheme: 'dark' }}
    >
      {/* Skip to main content (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-500 focus:text-white focus:rounded focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Public navigation */}
      <LandingNav />

      {/* Main content */}
      <main id="main-content" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <HeroSection />
        <ProblemSection />
        <WorkflowSection />
        <ProductShowcase />
        <EvidenceProvenance />
        <DetectionGrid />
        <AlertToInvestigation />
        <IntelligenceSection />
        <ForensicReportSection />
        <TargetUsers />
        <FinalCTA />
      </main>

      {/* Interactive Forensic Pipeline Modal */}
      <ForensicWorkflowModal
        isOpen={ui.isWorkflowModalOpen}
        initialSource={ui.workflowModalSource}
        onClose={() => uiStore.closeWorkflowModal()}
        onCompletedCase={(caseId) => {
          uiStore.navigate(`/case/${caseId}`);
        }}
      />
    </div>
  );
};
