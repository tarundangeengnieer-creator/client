import React from 'react';
import {
  Inbox,
  ShieldAlert,
  GitMerge,
  Search,
  FileText,
  ArrowRight,
} from 'lucide-react';

const STEPS = [
  {
    n: '01',
    label: 'Ingest',
    detail: 'Submit the raw email — .eml, forwarded message, or paste headers directly.',
    icon: Inbox,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-500/8',
  },
  {
    n: '02',
    label: 'Detect',
    detail: 'Automated pipeline extracts, authenticates, and classifies every signal.',
    icon: ShieldAlert,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/8',
  },
  {
    n: '03',
    label: 'Correlate',
    detail: 'IOCs, entities, and campaigns are cross-referenced in the knowledge graph.',
    icon: GitMerge,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/8',
  },
  {
    n: '04',
    label: 'Investigate',
    detail: 'Pivot from any indicator into the full investigator workspace.',
    icon: Search,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/8',
  },
  {
    n: '05',
    label: 'Report',
    detail: 'Generate a defensible forensic report with complete evidence chain.',
    icon: FileText,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/8',
  },
];

export const AlertToInvestigation: React.FC = () => (
  <section
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="ati-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400/70 tracking-widest uppercase mb-4">
        From Alert to Report
      </p>
      <h2
        id="ati-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        Alert → Investigation → Forensic Report.
      </h2>
      <p className="text-slate-400 text-base max-w-xl mb-12 leading-relaxed">
        Ingest the email. Detect threats. Correlate evidence. Investigate relationships.
        Generate a forensic report.
      </p>

      {/* Step strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-px bg-slate-800/40 rounded-xl overflow-hidden border border-slate-800">
        {STEPS.map(({ n, label, detail, icon: Icon, color, borderColor, bgColor }, i) => (
          <div
            key={n}
            className={`relative flex flex-col gap-4 p-5 bg-[#0c1322] hover:bg-[#0f172a] transition-colors`}
          >
            {/* Step number */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black font-mono text-slate-800 select-none">{n}</span>
              {i < STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-700 hidden sm:block" />
              )}
            </div>

            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-lg border ${borderColor} ${bgColor} flex items-center justify-center`}
            >
              <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: '18px', height: '18px' }} />
            </div>

            {/* Label + detail */}
            <div>
              <p className={`text-sm font-mono font-bold ${color} mb-1`}>{label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
