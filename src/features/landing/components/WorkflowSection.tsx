import React from 'react';
import {
  Mail,
  Layers,
  ShieldCheck,
  Globe,
  Brain,
  GitMerge,
  BarChart3,
  Search,
  FileText,
  ArrowRight,
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 'email',
    label: 'Email',
    sub: 'Raw .eml / MIME input',
    icon: Mail,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-500/8',
  },
  {
    id: 'extract',
    label: 'Extract',
    sub: 'Headers · Body · URLs · Attachments',
    icon: Layers,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/8',
  },
  {
    id: 'authenticate',
    label: 'Authenticate',
    sub: 'SPF · DKIM · DMARC',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/8',
  },
  {
    id: 'enrich',
    label: 'Enrich',
    sub: 'IP · Domain · GeoIP · ASN',
    icon: Globe,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/8',
  },
  {
    id: 'analyze',
    label: 'Analyze',
    sub: 'AI / ML threat classification',
    icon: Brain,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/8',
  },
  {
    id: 'correlate',
    label: 'Correlate',
    sub: 'IOC · Campaign · Entity graph',
    icon: GitMerge,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/8',
  },
  {
    id: 'score',
    label: 'Score',
    sub: 'Composite risk · Confidence',
    icon: BarChart3,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/8',
  },
  {
    id: 'investigate',
    label: 'Investigate',
    sub: 'Graph · Timeline · Evidence',
    icon: Search,
    color: 'text-sky-300',
    borderColor: 'border-sky-400/40',
    bgColor: 'bg-sky-400/8',
  },
  {
    id: 'report',
    label: 'Report',
    sub: 'Forensic dossier · Evidence export',
    icon: FileText,
    color: 'text-slate-300',
    borderColor: 'border-slate-600',
    bgColor: 'bg-slate-800/40',
  },
];

export const WorkflowSection: React.FC = () => (
  <section
    id="workflow"
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="workflow-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400/70 tracking-widest uppercase mb-4">
        Investigation Pipeline
      </p>
      <h2
        id="workflow-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        One Investigation. Every Signal.
      </h2>
      <p className="text-slate-400 text-base max-w-xl mb-12 leading-relaxed">
        AShieldER processes each email through a structured investigation pipeline. Every stage is traceable,
        evidence-linked, and feeds the forensic report.
      </p>

      {/* Pipeline — clear sequential wrapping flow */}
      <div className="flex flex-wrap gap-3 sm:gap-4 items-stretch justify-start">
        {PIPELINE_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === PIPELINE_STEPS.length - 1;
          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex flex-col gap-3 p-3 sm:p-4 ${step.bgColor} border ${step.borderColor} rounded-lg flex-1 min-w-[140px] max-w-[200px]`}
              >
                <div
                  className={`w-8 h-8 rounded-lg border ${step.borderColor} flex items-center justify-center bg-[#070b14]`}
                >
                  <Icon className={`w-4 h-4 ${step.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-mono font-bold ${step.color}`}>{step.label}</p>
                  <p className="text-xs font-mono text-slate-500 leading-tight mt-0.5">{step.sub}</p>
                </div>
                <div className="mt-auto pt-2">
                  <span
                    className={`text-xs font-mono font-bold text-slate-600 uppercase tracking-wider`}
                  >
                    Step {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
              {/* Arrow connector */}
              {!isLast && (
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Pipeline summary */}
      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono text-slate-500">
          Full pipeline →
        </span>
        {PIPELINE_STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <span className={`text-xs font-mono font-bold ${s.color}`}>{s.label}</span>
            {i < PIPELINE_STEPS.length - 1 && (
              <span className="text-slate-700 text-xs">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);
