import React from 'react';
import {
  Mail,
  Layers,
  ShieldCheck,
  Globe,
  Brain,
  Network,
  BarChart3,
  Search,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface PipelineStep {
  step: string;
  id: string;
  label: string;
  sub1: string;
  sub2: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  textColor: string;
  borderColor: string;
  boxShadow: string;
  badgeGlow: string;
  topGlow?: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: '01',
    id: 'email',
    label: 'Email',
    sub1: 'Raw .eml /',
    sub2: 'MIME input',
    icon: Mail,
    accentColor: '#00A3FF',
    textColor: 'text-[#00A3FF]',
    borderColor: 'border-[#00A3FF]',
    boxShadow: '0 0 16px rgba(0, 163, 255, 0.22), inset 0 0 14px rgba(0, 163, 255, 0.04)',
    badgeGlow: '0 0 12px rgba(0, 163, 255, 0.55)',
  },
  {
    step: '02',
    id: 'extract',
    label: 'Extract',
    sub1: 'Headers · Body ·',
    sub2: 'URLs · Attachments',
    icon: Layers,
    accentColor: '#0077FE',
    textColor: 'text-[#0077FE]',
    borderColor: 'border-[#0077FE]',
    boxShadow: '0 0 16px rgba(0, 119, 254, 0.22), inset 0 0 14px rgba(0, 119, 254, 0.04)',
    badgeGlow: '0 0 12px rgba(0, 119, 254, 0.55)',
  },
  {
    step: '03',
    id: 'authenticate',
    label: 'Authenticate',
    sub1: 'SPF · DKIM ·',
    sub2: 'DMARC',
    icon: ShieldCheck,
    accentColor: '#00E5A3',
    textColor: 'text-[#00E5A3]',
    borderColor: 'border-[#00E5A3]',
    boxShadow: '0 0 16px rgba(0, 229, 163, 0.22), inset 0 0 14px rgba(0, 229, 163, 0.04)',
    badgeGlow: '0 0 12px rgba(0, 229, 163, 0.55)',
  },
  {
    step: '04',
    id: 'enrich',
    label: 'Enrich',
    sub1: 'IP · Domain ·',
    sub2: 'GeoIP · ASN',
    icon: Globe,
    accentColor: '#A855F7',
    textColor: 'text-[#A855F7]',
    borderColor: 'border-[#A855F7]',
    boxShadow: '0 0 16px rgba(168, 85, 247, 0.22), inset 0 0 14px rgba(168, 85, 247, 0.04)',
    badgeGlow: '0 0 12px rgba(168, 85, 247, 0.55)',
  },
  {
    step: '05',
    id: 'analyze',
    label: 'Analyze',
    sub1: 'AI / ML threat',
    sub2: 'classification',
    icon: Brain,
    accentColor: '#FFB800',
    textColor: 'text-[#FFB800]',
    borderColor: 'border-[#FFB800]',
    boxShadow: '0 0 16px rgba(255, 184, 0, 0.22), inset 0 0 14px rgba(255, 184, 0, 0.04)',
    badgeGlow: '0 0 12px rgba(255, 184, 0, 0.55)',
  },
  {
    step: '06',
    id: 'correlate',
    label: 'Correlate',
    sub1: 'IOC · Campaign ·',
    sub2: 'Entity graph',
    icon: Network,
    accentColor: '#FF2E93',
    textColor: 'text-[#FF2E93]',
    borderColor: 'border-[#FF2E93]',
    boxShadow: '0 0 16px rgba(255, 46, 147, 0.22), inset 0 0 14px rgba(255, 46, 147, 0.04)',
    badgeGlow: '0 0 12px rgba(255, 46, 147, 0.55)',
  },
  {
    step: '07',
    id: 'score',
    label: 'Score',
    sub1: 'Composite risk ·',
    sub2: 'Confidence',
    icon: BarChart3,
    accentColor: '#FF6B00',
    textColor: 'text-[#FF6B00]',
    borderColor: 'border-[#FF6B00]',
    boxShadow: '0 0 16px rgba(255, 107, 0, 0.22), inset 0 0 14px rgba(255, 107, 0, 0.04)',
    badgeGlow: '0 0 12px rgba(255, 107, 0, 0.55)',
  },
  {
    step: '08',
    id: 'investigate',
    label: 'Investigate',
    sub1: 'Graph · Timeline ·',
    sub2: 'Evidence',
    icon: Search,
    accentColor: '#00F0FF',
    textColor: 'text-[#00F0FF]',
    borderColor: 'border-[#00F0FF]',
    boxShadow: '0 0 24px rgba(0, 240, 255, 0.38), inset 0 0 16px rgba(0, 240, 255, 0.08)',
    badgeGlow: '0 0 16px rgba(0, 240, 255, 0.7)',
    topGlow: 'radial-gradient(ellipse at 50% 0%, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
  },
  {
    step: '09',
    id: 'report',
    label: 'Report',
    sub1: 'Forensic dossier ·',
    sub2: 'Evidence export',
    icon: FileText,
    accentColor: '#CBD5E1',
    textColor: 'text-[#CBD5E1]',
    borderColor: 'border-[#64748B]',
    boxShadow: '0 0 14px rgba(203, 213, 225, 0.16), inset 0 0 12px rgba(203, 213, 225, 0.03)',
    badgeGlow: '0 0 10px rgba(203, 213, 225, 0.35)',
  },
];

export const WorkflowSection: React.FC = () => (
  <section
    id="workflow"
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60 relative overflow-hidden bg-[#050811]"
    aria-labelledby="workflow-heading"
  >
    {/* Subtle Background Security Dot Grid */}
    <div
      className="absolute inset-0 pointer-events-none opacity-20"
      aria-hidden="true"
      style={{
        backgroundImage: `
          radial-gradient(rgba(8, 180, 237, 0.25) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    />

    <div className="max-w-7xl mx-auto relative z-10">
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

      {/* Pipeline Sequence Row - Exact layout & styling matching design */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-6 pt-6 px-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent xl:justify-between">
        {PIPELINE_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === PIPELINE_STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Individual Stage Card */}
              <div
                className={`relative w-[124px] sm:w-[130px] lg:w-[134px] xl:w-[138px] h-[196px] shrink-0 rounded-2xl bg-[#070c18] border-[1.5px] ${step.borderColor} p-3 pt-6 pb-4 flex flex-col items-center justify-between transition-transform duration-200 hover:-translate-y-1`}
                style={{
                  boxShadow: step.boxShadow,
                }}
              >
                {/* Optional subtle top ambient glow */}
                {step.topGlow && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: step.topGlow }}
                  />
                )}

                {/* Numbered Circular Badge Perched on Top Border */}
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#070c18] border-[1.5px] ${step.borderColor} flex items-center justify-center font-mono text-[11px] font-bold text-slate-100 z-10`}
                  style={{
                    boxShadow: step.badgeGlow,
                  }}
                >
                  {step.step}
                </div>

                {/* Centered Outline Icon */}
                <div className="mt-2.5 flex items-center justify-center text-slate-100">
                  <Icon className="w-7 h-7 stroke-[1.5]" />
                </div>

                {/* Title & Subtitles */}
                <div className="w-full flex flex-col items-center text-center mt-auto">
                  <p className={`text-[13px] sm:text-[14px] font-bold tracking-tight ${step.textColor}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] sm:text-[10.5px] text-slate-400 font-sans leading-tight mt-1 px-0.5">
                    <span className="block truncate">{step.sub1}</span>
                    <span className="block truncate">{step.sub2}</span>
                  </p>
                </div>
              </div>

              {/* Connecting Arrow Between Cards */}
              {!isLast && (
                <div className="shrink-0 flex items-center justify-center text-slate-600 px-0.5" aria-hidden="true">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 stroke-[1.75]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </section>
);
