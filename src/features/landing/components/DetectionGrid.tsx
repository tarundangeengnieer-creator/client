import React from 'react';
import {
  Mail,
  ShieldAlert,
  Shield,
  Link2,
  Paperclip,
  CheckCircle2,
  Server,
  Globe,
  MapPin,
  Radio,
  UserX,
  Target,
  ArrowRight,
} from 'lucide-react';

const CAPABILITIES = [
  { icon: Mail, label: 'Phishing Detection', color: 'text-rose-400', border: 'border-rose-500/25', bg: 'bg-rose-500/5' },
  { icon: UserX, label: 'BEC Detection', color: 'text-orange-400', border: 'border-orange-500/25', bg: 'bg-orange-500/5' },
  { icon: ShieldAlert, label: 'Spoofing Detection', color: 'text-amber-400', border: 'border-amber-500/25', bg: 'bg-amber-500/5' },
  { icon: Link2, label: 'Malicious URL Analysis', color: 'text-rose-400', border: 'border-rose-500/25', bg: 'bg-rose-500/5' },
  { icon: Paperclip, label: 'Attachment Analysis', color: 'text-orange-400', border: 'border-orange-500/25', bg: 'bg-orange-500/5' },
  { icon: CheckCircle2, label: 'SPF / DKIM / DMARC', color: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/5' },
  { icon: Server, label: 'IP Intelligence', color: 'text-purple-400', border: 'border-purple-500/25', bg: 'bg-purple-500/5' },
  { icon: Globe, label: 'Domain Intelligence', color: 'text-purple-400', border: 'border-purple-500/25', bg: 'bg-purple-500/5' },
  { icon: MapPin, label: 'Geolocation', color: 'text-purple-400', border: 'border-purple-500/25', bg: 'bg-purple-500/5' },
  { icon: Radio, label: 'Threat Intelligence', color: 'text-sky-400', border: 'border-sky-500/25', bg: 'bg-sky-500/5' },
  { icon: Shield, label: 'Credential Harvesting', color: 'text-rose-400', border: 'border-rose-500/25', bg: 'bg-rose-500/5' },
  { icon: Target, label: 'Threat Actor Intel', color: 'text-amber-400', border: 'border-amber-500/25', bg: 'bg-amber-500/5' },
];

export const DetectionGrid: React.FC = () => (
  <section
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="detection-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400/70 tracking-widest uppercase mb-4">
        Detection Capabilities
      </p>
      <h2
        id="detection-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        Comprehensive Threat Coverage.
      </h2>
      <p className="text-slate-400 text-base max-w-xl mb-10 leading-relaxed">
        AShieldER detects and investigates the full spectrum of email-based threats — from credential phishing
        to business email compromise, domain spoofing, and threat actor infrastructure.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
        {CAPABILITIES.map(({ icon: Icon, label, color, border, bg }) => (
          <button
            key={label}
            type="button"
            className={`flex flex-col items-start gap-3 p-4 rounded-lg border ${border} ${bg} hover:brightness-110 transition-all duration-200 group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400`}
            aria-label={`Learn more about ${label}`}
          >
            <div className="flex w-full items-start justify-between">
              <div
                className={`w-7 h-7 rounded-lg border ${border} flex items-center justify-center bg-[#070b14] shrink-0`}
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <ArrowRight className={`w-3.5 h-3.5 ${color} opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} />
            </div>
            <span className={`text-xs font-mono font-semibold ${color} leading-snug mt-1`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);
