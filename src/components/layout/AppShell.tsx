import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { AppTopBar } from './AppTopBar.tsx';
import { GlobalSearchModal } from './GlobalSearchModal.tsx';
import { ToastContainer } from './ToastContainer.tsx';
import { Modal } from '../ui/Modal.tsx';
import { useUI, uiStore } from '../../stores/ui-store.ts';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const ui = useUI();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Global listener for '?' key to open keyboard shortcuts help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen flex bg-[#0b1329] dark:bg-[#050811] overflow-hidden font-sans select-none antialiased print:h-auto print:w-auto print:overflow-visible print:bg-white print:block">
      {/* Mobile Sidebar Overlay Backdrop */}
      {ui.isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-30 lg:hidden backdrop-blur-xs transition-opacity print:hidden"
          onClick={() => uiStore.setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Full-Height Dark Sidebar matching Image 1 */}
      <Sidebar />

      {/* Right Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f4f7fb] dark:bg-[#070b14] print:h-auto print:overflow-visible print:bg-white">
        {/* Top Header Bar matching Image 1 and Image 2 */}
        <AppTopBar />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#f4f7fb] dark:bg-[#070b14] relative print:overflow-visible print:bg-white print:h-auto">
          {children}
        </main>
      </div>

      {/* Modals and Floating Feedback Overlays */}
      <div className="print:hidden">
        <GlobalSearchModal />
        <ToastContainer />
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      <Modal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        title="FORENSIC WORKSTATION KEYBOARD SHORTCUTS"
        description="High-velocity analyst navigation shortcuts"
        maxWidth="md"
      >
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-700">Global Search / Jump</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-blue-600">
              Ctrl + K / ⌘K
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-700">Toggle Shortcuts Guide</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-blue-600">
              ?
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-700">Navigate to Security Overview</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-blue-600">
              G then O
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-700">Navigate to Case Inboxes</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-blue-600">
              G then I
            </kbd>
          </div>
        </div>
      </Modal>
    </div>
  );
};
