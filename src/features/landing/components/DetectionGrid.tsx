import React from 'react';
import {
  Mail,
  ShieldCheck,
  Link2,
  Radio,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface CapabilityGroup {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const CAPABILITIES: CapabilityGroup[] = [
  {
    id: 'capability-email-threat-detection',
    icon: Mail,
    title: 'Email Threat Detection',
    description: 'Phishing · BEC · Spoofing',
  },
  {
    id: 'capability-email-authentication',
    icon: ShieldCheck,
    title: 'Email Authentication',
    description: 'SPF · DKIM · DMARC',
  },
  {
    id: 'capability-url-attachment-analysis',
    icon: Link2,
    title: 'URL & Attachment Analysis',
    description: 'Malicious URLs · Attachments · Credential Theft',
  },
  {
    id: 'capability-threat-intelligence',
    icon: Radio,
    title: 'Threat Intelligence',
    description: 'IP · Domain · IOC · Threat Actors',
  },
  {
    id: 'capability-geolocation-intelligence',
    icon: MapPin,
    title: 'Geolocation Intelligence',
    description: 'GeoIP · ASN · Origin',
  },
  {
    id: 'capability-ai-investigation',
    icon: Sparkles,
    title: 'AI Investigation',
    description: 'Correlation · Risk Scoring · Forensics',
  },
];

export const DetectionGrid: React.FC = () => (
  <section
    id="detection-capabilities-section"
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="detection-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400 tracking-wider mb-4">
        Detection Capabilities
      </p>
      <h2
        id="detection-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        Comprehensive Threat Coverage.
      </h2>
      <p className="text-slate-400 text-base max-w-xl mb-8 sm:mb-10 leading-relaxed">
        AShieldER detects and investigates the full spectrum of email-based threats — from credential phishing
        to business email compromise, domain spoofing, and threat actor infrastructure.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {CAPABILITIES.map(({ id, icon: Icon, title, description }) => (
          <div
            key={id}
            id={id}
            className="group flex items-start gap-3.5 p-4 rounded-xl bg-[#0c1322] border border-slate-800/80 hover:border-slate-700 hover:bg-[#0f172a] transition-colors duration-150 cursor-default"
          >
            <div className="w-9 h-9 rounded-lg bg-[#070b14] border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5 group-hover:border-sky-500/40 group-hover:text-sky-300 transition-colors">
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                {title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-sans leading-normal">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
