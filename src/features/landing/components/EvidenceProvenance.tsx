import React from 'react';
import { ProvenanceLabel } from '../../../components/ui/ProvenanceLabel.tsx';
import { FileCheck, Radio, Sparkles, Cpu } from 'lucide-react';

const PROVENANCE_TIERS = [
  {
    type: 'OBSERVED EVIDENCE' as const,
    icon: FileCheck,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-500/5',
    glowColor: 'shadow-[0_0_20px_rgba(14,165,233,0.08)]',
    title: 'Observed Evidence',
    description:
      'Directly extracted or verified from the email message itself. Authoritative forensic artifacts from RFC 5322 headers, MIME body, relay network sockets, and raw bytes.',
    examples: [
      'Email headers (Return-Path, Received chain)',
      'SPF · DKIM · DMARC authentication results',
      'Embedded URLs and attachment hashes',
      'Sender IP from Received headers',
      'MIME structure and encoding',
    ],
    trust: 'Highest trust — primary forensic evidence',
    trustColor: 'text-sky-400',
  },
  {
    type: 'THREAT INTELLIGENCE' as const,
    icon: Radio,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/5',
    glowColor: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]',
    title: 'Threat Intelligence',
    description:
      'Information enriched from external intelligence sources. Supplementary context from reputation databases, geolocation APIs, blocklists, and threat feeds.',
    examples: [
      'IP reputation and abuse confidence scores',
      'Domain registration and WHOIS data',
      'ASN and hosting organization',
      'Country and geolocation data',
      'Known IOC and campaign associations',
    ],
    trust: 'External enrichment — corroborates evidence',
    trustColor: 'text-purple-400',
  },
  {
    type: 'ML DETECTION' as const,
    icon: Cpu,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/5',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]',
    title: 'ML Detection',
    description:
      'Predictive statistical inference models evaluated against extracted forensic features, identifying anomalies and classification patterns.',
    examples: [
      'Trained classifier inference scores',
      'Feature anomaly probability vectors',
      'Content & lexical threat scoring',
      'Model confidence calibration',
      'Multi-vector risk weights',
    ],
    trust: 'Predictive — supplementary signal, not sole verdict',
    trustColor: 'text-amber-400',
  },
  {
    type: 'AI ANALYSIS' as const,
    icon: Sparkles,
    color: 'text-sky-300',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-500/5',
    glowColor: 'shadow-[0_0_20px_rgba(14,165,233,0.08)]',
    title: 'AI Interpretation',
    description:
      'Model-generated analysis and contextual insights grounded in observed evidence. Supports investigation but does not replace forensic conclusions.',
    examples: [
      'Brand impersonation pattern detection',
      'Social engineering tactic identification',
      'Phishing intent classification',
      'Narrative coherence assessment',
      'Evidence synthesis and summary',
    ],
    trust: 'Interpretive — supports investigation, not final verdict',
    trustColor: 'text-sky-300',
  },
];

export const EvidenceProvenance: React.FC = () => (
  <section
    id="resources"
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="provenance-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400 tracking-wider mb-4">
        Evidence Integrity
      </p>
      <h2
        id="provenance-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        Know What Was Observed.{' '}
        <span className="text-slate-400">Know What Was Inferred.</span>
      </h2>
      <p className="text-slate-400 text-base max-w-2xl mb-12 leading-relaxed">
        AShieldER maintains a strict forensic evidence hierarchy. Every piece of information is tagged with its
        provenance — so analysts always know whether they are looking at a verified artifact, enriched intelligence,
        or an AI-generated interpretation.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROVENANCE_TIERS.map(({ type, icon: Icon, color, borderColor, bgColor, glowColor, title, description, examples, trust, trustColor }) => (
          <div
            key={type}
            className={`flex flex-col rounded-xl border ${borderColor} ${bgColor} ${glowColor} p-5 gap-4`}
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg border ${borderColor} flex items-center justify-center bg-[#070b14]`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <ProvenanceLabel type={type} size="sm" showIcon={false} />
              </div>
              <h3 className={`text-sm font-bold ${color} font-mono tracking-wide`}>
                {title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>

            {/* Examples */}
            <ul className="space-y-1.5">
              {examples.map((ex) => (
                <li key={ex} className="flex items-start gap-2">
                  <span className={`w-1 h-1 rounded-full ${color.replace('text-', 'bg-')} mt-1.5 shrink-0`} />
                  <span className="text-xs font-mono text-slate-400">{ex}</span>
                </li>
              ))}
            </ul>

            {/* Trust level */}
            <div className={`text-xs font-mono font-bold ${trustColor} tracking-wide border-t border-slate-800/60 pt-3 mt-auto`}>
              {trust}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
