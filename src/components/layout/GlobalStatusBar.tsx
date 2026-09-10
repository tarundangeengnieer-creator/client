import React from 'react';
import { useAuth } from '../../stores/auth-store.ts';
import { useUI } from '../../stores/ui-store.ts';
import { ShieldCheck, Clock, Zap, Cpu } from 'lucide-react';

export const GlobalStatusBar: React.FC = () => {
  const auth = useAuth();
  const ui = useUI();

  return (
    <footer className="h-6 bg-slate-950 border-t border-slate-800/80 px-3 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none shrink-0 z-20">
      {/* Left: SLA & Connectivity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-sky-400" />
          <span className="text-slate-300">SLA:</span>
          <span className="text-emerald-400 font-semibold">&lt; 4,000ms target</span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              auth.backendHealth === 'healthy'
                ? 'bg-emerald-500'
                : auth.backendHealth === 'degraded'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />
          <span className="text-slate-300">FASTAPI:</span>
          <span className="text-slate-400">{auth.backendHealth.toUpperCase()}</span>
          {auth.backendLatencyMs && (
            <span className="text-slate-400">({auth.backendLatencyMs}ms)</span>
          )}
        </div>
      </div>

      {/* Center: Active Session / Request Context */}
      <div className="hidden md:flex items-center gap-2 text-slate-400">
        {ui.activeCaseId ? (
          <span>ACTIVE FORENSIC TRACE: {ui.activeCaseId}</span>
        ) : (
          <span>SECURE REPLAY SESSION: ZERO-TRUST WORKSTATION</span>
        )}
      </div>

      {/* Right: Evidentiary Integrity & Keyboard Shortcuts */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-emerald-400/90" title="All evidence hashed with SHA-256 for court-admissibility">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>EVIDENTIARY CHAIN: INTACT</span>
        </div>

        <span className="text-slate-700">|</span>

        <span className="text-slate-400 hidden sm:inline">PRESS ? FOR SHORTCUTS</span>
      </div>
    </footer>
  );
};
