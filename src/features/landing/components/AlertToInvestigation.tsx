import React from 'react';
import {
  Inbox,
  ShieldAlert,
  GitMerge,
  Search,
  FileText,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';

const STEPS = [
  {
    n: '01',
    phase: 'PHASE 01',
    label: 'Ingest',
    subtitle: 'Evidence Intake',
    detail: 'Submit raw email evidence via .eml upload, secure API webhook, or direct header paste.',
    artifact: 'Normalized Case Telemetry',
    icon: Inbox,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-500/10',
    nodeBadge: 'border-sky-500/50 bg-sky-950/80 text-sky-300 ring-2 ring-sky-500/20',
  },
  {
    n: '02',
    phase: 'PHASE 02',
    label: 'Detect',
    subtitle: 'Automated Triage',
    detail: 'Multi-engine analysis verifies SPF/DKIM/DMARC, checks heuristics, and scores risk.',
    artifact: 'Risk Verdict & MITRE Tags',
    icon: ShieldAlert,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgColor: 'bg-rose-500/10',
    nodeBadge: 'border-rose-500/50 bg-rose-950/80 text-rose-300 ring-2 ring-rose-500/20',
  },
  {
    n: '03',
    phase: 'PHASE 03',
    label: 'Correlate',
    subtitle: 'Graph Synthesis',
    detail: 'IOCs, infrastructure IPs, and threat campaigns are mapped into the active knowledge graph.',
    artifact: 'Connected Entity Clusters',
    icon: GitMerge,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/10',
    nodeBadge: 'border-purple-500/50 bg-purple-950/80 text-purple-300 ring-2 ring-purple-500/20',
  },
  {
    n: '04',
    phase: 'PHASE 04',
    label: 'Investigate',
    subtitle: 'Forensic Pivot',
    detail: 'Interrogate hop timeline anomalies, inspect raw decodes, and query the forensic assistant.',
    artifact: 'Verified Evidence Chain',
    icon: Search,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    nodeBadge: 'border-amber-500/50 bg-amber-950/80 text-amber-300 ring-2 ring-amber-500/20',
  },
  {
    n: '05',
    phase: 'PHASE 05',
    label: 'Report',
    subtitle: 'Defensible Outcome',
    detail: 'Compile cryptographic, court-ready forensic dossier with complete chain of custody.',
    artifact: 'Signed Forensic Dossier',
    icon: FileText,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    nodeBadge: 'border-emerald-500/50 bg-emerald-950/80 text-emerald-300 ring-2 ring-emerald-500/20',
  },
];

export const AlertToInvestigation: React.FC = () => (
  <section
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="ati-heading"
  >
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-mono font-bold text-sky-400 tracking-wider mb-2 uppercase">
            Investigation Roadmap
          </p>
          <h2
            id="ati-heading"
            className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight"
          >
            Connected End-to-End Threat Workflow
          </h2>
        </div>
        <p className="text-slate-300 text-sm max-w-md leading-relaxed">
          From initial raw email intake to signed forensic reporting — an automated, sequential
          investigation path engineered for fast, defensible triage.
        </p>
      </div>

      {/* Connected Workflow Roadmap Container */}
      <div
        role="list"
        aria-label="Investigation roadmap stages"
        className="relative grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-3 before:hidden lg:before:block before:absolute before:top-[38px] before:left-[10%] before:right-[10%] before:h-[2px] before:bg-gradient-to-r before:from-sky-500/40 before:via-purple-500/40 to-emerald-500/40 before:z-0"
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === STEPS.length - 1;

          return (
            <div
              key={step.n}
              role="listitem"
              className="relative z-10 flex flex-col justify-between bg-[#0b1322] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-lg hover:shadow-cyan-950/20 group"
            >
              <div>
                {/* Roadmap Milestone Checkpoint Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    {/* Milestone Node */}
                    <div
                      className={`w-9 h-9 rounded-full border ${step.nodeBadge} flex items-center justify-center font-mono font-bold text-xs shadow-md shrink-0`}
                    >
                      {step.n}
                    </div>
                    {/* Phase tag */}
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
                      {step.phase}
                    </span>
                  </div>

                  {/* Desktop forward connector chevron */}
                  {!isLast && (
                    <ArrowRight
                      className="w-4 h-4 text-slate-600 hidden lg:block group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Stage Icon + Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg border ${step.borderColor} ${step.bgColor} flex items-center justify-center shrink-0 shadow-inner`}
                  >
                    <Icon className={`w-5 h-5 ${step.color} stroke-[2.25]`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-mono font-bold ${step.color} leading-snug`}>
                      {step.label}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">{step.subtitle}</p>
                  </div>
                </div>

                {/* Stage Detail Copy */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{step.detail}</p>
              </div>

              {/* Roadmap Milestone Artifact / Handoff */}
              <div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${step.color} shrink-0`} aria-hidden="true" />
                  <span className="truncate">{step.artifact}</span>
                </div>

                {/* Mobile vertical flow arrow */}
                {!isLast && (
                  <div className="lg:hidden flex justify-center pt-3 -mb-1 text-slate-600">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

