import React from 'react';
import {
  Monitor,
  Search,
  ShieldAlert,
  AlertTriangle,
  Settings,
} from 'lucide-react';

const USERS = [
  {
    icon: Monitor,
    role: 'SOC Analyst',
    description: 'Triage incoming email alerts, track threat trends, and escalate high-confidence cases.',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/5',
  },
  {
    icon: Search,
    role: 'Investigator',
    description: 'Deep-dive into entity relationships, threat actor campaigns, and forensic evidence chains.',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
  },
  {
    icon: ShieldAlert,
    role: 'Incident Response',
    description: 'Analyze active incidents, correlate IOCs across cases, and generate defensible reports.',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/5',
  },
  {
    icon: AlertTriangle,
    role: 'Fraud Teams',
    description: 'Investigate BEC, credential harvesting, and financial fraud email patterns at scale.',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
  },
  {
    icon: Settings,
    role: 'Security Administrators',
    description: 'Configure integrations, manage users, monitor platform health, and enforce policies.',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
  },
];

export const TargetUsers: React.FC = () => (
  <section
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="users-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400 tracking-wider mb-4">
        Built For
      </p>
      <h2
        id="users-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        The Right Tool for Every Security Role.
      </h2>
      <p className="text-slate-400 text-base max-w-xl mb-12 leading-relaxed">
        AShieldER is built for enterprise security teams — from first-line SOC triage to deep forensic investigation.
        Role-based access controls ensure every analyst sees the right workspace for their function.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {USERS.map(({ icon: Icon, role, description, color, borderColor, bgColor }) => (
          <div
            key={role}
            className={`flex flex-col gap-3 p-4 rounded-xl border ${borderColor} ${bgColor} hover:brightness-110 transition-all duration-150`}
          >
            <div
              className={`w-9 h-9 rounded-lg border ${borderColor} flex items-center justify-center bg-[#070b14]`}
            >
              <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <p className={`text-sm font-mono font-bold ${color} mb-1.5`}>{role}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
