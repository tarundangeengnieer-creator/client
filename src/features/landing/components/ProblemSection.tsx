import React from 'react';
import {
  Mail,
  Server,
  Globe,
  Link2,
  Paperclip,
  User,
  ShieldAlert,
  MapPin,
  Radio,
  ArrowRight,
} from 'lucide-react';

const signals = [
  { icon: Mail, label: 'Sender Identity', note: 'spoofed display name' },
  { icon: Server, label: 'Sending IP', note: '185.234.219.12' },
  { icon: Globe, label: 'Domain', note: 'paypal-verify.net' },
  { icon: Link2, label: 'Embedded URLs', note: '3 suspicious links' },
  { icon: Paperclip, label: 'Attachments', note: 'macro-enabled .xlsm' },
  { icon: ShieldAlert, label: 'Auth Headers', note: 'SPF · DKIM · DMARC fail' },
  { icon: MapPin, label: 'Geolocation', note: 'Russia / Tor exit node' },
  { icon: Radio, label: 'Threat Intel', note: 'known BEC campaign IOC' },
  { icon: User, label: 'Target Profile', note: 'finance team · executive' },
];

export const ProblemSection: React.FC = () => (
  <section
    id="capabilities"
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="problem-heading"
  >
    <div className="max-w-7xl mx-auto">
      {/* Label */}
      <p className="text-xs font-mono font-bold text-sky-400/70 tracking-wide mb-4">
        The Investigation Challenge
      </p>

      <h2
        id="problem-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        A Suspicious Email Rarely Contains the Whole Story.
      </h2>

      <p className="text-slate-400 text-base max-w-xl mb-12 leading-relaxed">
        A single phishing email touches multiple evidence layers — sender, infrastructure, authentication,
        payload, and geolocation. Each signal tells part of the story. The investigation requires all of them.
      </p>

      {/* Signal grid converging to investigation */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8">
        {/* Fragmented signals */}
        <div className="grid grid-cols-3 gap-2 flex-1 max-w-lg w-full">
          {signals.map(({ icon: Icon, label, note }) => (
            <div
              key={label}
              className="flex flex-col gap-1 p-3 rounded-lg bg-[#0c1322] border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-slate-300 leading-tight">{label}</span>
              </div>
              <p className="text-xs font-mono text-slate-500 leading-tight pl-5">{note}</p>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex lg:flex-col items-center justify-center gap-2 lg:gap-0 shrink-0">
          <div className="hidden lg:block w-px flex-1 bg-gradient-to-b from-transparent via-sky-500/30 to-transparent" />
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30">
            <ArrowRight className="w-4 h-4 text-sky-400 lg:rotate-0" />
          </div>
          <div className="hidden lg:block w-px flex-1 bg-gradient-to-b from-transparent via-sky-500/30 to-transparent" />
        </div>

        {/* Converged investigation */}
        <div className="flex-1 max-w-sm w-full flex items-center">
          <div className="w-full p-6 sm:p-8 rounded-xl bg-[#0c1322] border border-sky-500/40 shadow-[0_0_30px_rgba(8,180,237,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-slate-200">Unified Investigation</p>
                <p className="text-xs font-mono text-slate-500 mt-0.5">Case #A2291 · Active</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { label: 'Evidence Sources', value: '9 signals', color: 'text-sky-400' },
                { label: 'IOC Matches', value: '7 indicators', color: 'text-rose-400' },
                { label: 'Verdict', value: 'MALICIOUS', color: 'text-rose-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-400">{label}</span>
                  <span className={`text-sm font-mono font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs font-mono text-slate-500 leading-relaxed">
                All signals correlated. Report ready for review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
