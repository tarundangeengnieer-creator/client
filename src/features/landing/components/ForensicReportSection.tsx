import React from 'react';
import { Badge } from '../../../components/ui/Badge.tsx';
import { SeverityBadge } from '../../../components/ui/SeverityBadge.tsx';
import { ProvenanceLabel } from '../../../components/ui/ProvenanceLabel.tsx';
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  MapPin,
  Link2,
  Clock,
  BarChart3,
  Paperclip,
  Server,
} from 'lucide-react';

const REPORT_SECTIONS = [
  'Case Summary',
  'Authentication Results',
  'Indicators of Compromise',
  'URL Analysis',
  'Attachment Analysis',
  'IP / Domain Intelligence',
  'Evidence Timeline',
  'Risk Assessment',
  'Investigation Findings',
  'Recommendations',
];

export const ForensicReportSection: React.FC = () => (
  <section
    className="py-20 px-4 sm:px-6 border-t border-slate-800/60"
    aria-labelledby="report-heading"
  >
    <div className="max-w-7xl mx-auto">
      <p className="text-xs font-mono font-bold text-sky-400/70 tracking-widest uppercase mb-4">
        Forensic Reporting
      </p>
      <h2
        id="report-heading"
        className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight mb-4"
      >
        From Detection to Defensible Evidence.
      </h2>
      <p className="text-slate-400 text-base max-w-xl mb-12 leading-relaxed">
        AShieldER generates complete forensic reports with a full evidence chain, authentication results,
        threat intelligence findings, and investigation timeline — ready for legal, compliance, or incident response.
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report table of contents */}
        <div className="lg:col-span-1 bg-[#0c1322] border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#070b14] border-b border-slate-800 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Report Sections</span>
          </div>
          <ol className="divide-y divide-slate-800/60">
            {REPORT_SECTIONS.map((section, i) => (
              <li key={section} className="flex items-center gap-3 px-4 py-2.5">
                <span className="text-xs font-mono text-slate-700 w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs font-mono text-slate-400">{section}</span>
              </li>
            ))}
          </ol>
          <div className="px-4 py-3 bg-[#070b14]/60 border-t border-slate-800/60 flex gap-2">
            <Badge variant="info" size="sm">PDF Export</Badge>
            <Badge variant="outline" size="sm">JSON</Badge>
            <Badge variant="outline" size="sm">HTML</Badge>
          </div>
        </div>

        {/* Report preview */}
        <div className="lg:col-span-2 bg-[#0c1322] border border-slate-800 rounded-xl overflow-hidden">
          {/* Report header */}
          <div className="px-5 py-4 bg-[#070b14] border-b border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Forensic Investigation Report</p>
                <h3 className="text-sm font-mono font-bold text-slate-200 mt-0.5">Case #A2291 — PayPal Brand Impersonation</h3>
                <p className="text-xs font-mono text-slate-500 mt-1">Generated: 2026-09-18 · Investigator: Bob Chen · ASHIELDER v2.1</p>
              </div>
              <SeverityBadge severity="MALICIOUS" size="sm" showDot />
            </div>
          </div>

          {/* Case summary block */}
          <div className="px-5 py-4 border-b border-slate-800/60">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">01 · Case Summary</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { k: 'Verdict', v: 'MALICIOUS', color: 'text-rose-400' },
                { k: 'Risk Score', v: '91 / 100', color: 'text-rose-400' },
                { k: 'Confidence', v: '94%', color: 'text-slate-200' },
                { k: 'Attack Type', v: 'Phishing / BEC', color: 'text-amber-400' },
                { k: 'Campaign', v: 'PayPal-Spoof-2026', color: 'text-amber-400' },
                { k: 'Analyst', v: 'Bob Chen', color: 'text-slate-300' },
              ].map(({ k, v, color }) => (
                <div key={k} className="flex flex-col gap-0.5 p-2 bg-[#070b14] rounded border border-slate-800">
                  <span className="text-xs font-mono text-slate-500">{k}</span>
                  <span className={`text-xs font-mono font-bold ${color}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auth results */}
          <div className="px-5 py-4 border-b border-slate-800/60">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">02 · Authentication Results</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'SPF', icon: XCircle, color: 'text-rose-400', result: 'FAIL' },
                { label: 'DKIM', icon: XCircle, color: 'text-rose-400', result: 'FAIL' },
                { label: 'DMARC', icon: XCircle, color: 'text-rose-400', result: 'FAIL — p=reject' },
              ].map(({ label, icon: Icon, color, result }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/30 border border-rose-500/25">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-xs font-mono font-bold text-slate-300">{label}</span>
                  <span className={`text-xs font-mono ${color}`}>{result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence timeline preview */}
          <div className="px-5 py-4 border-b border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">07 · Evidence Timeline</p>
              <ProvenanceLabel type="OBSERVED EVIDENCE" size="xs" showIcon={false} />
            </div>
            <div className="space-y-1.5">
              {[
                { t: '09:12', ev: 'Email received and ingested', color: 'bg-sky-400' },
                { t: '09:12', ev: 'SPF / DKIM / DMARC — all FAIL', color: 'bg-rose-400' },
                { t: '09:13', ev: 'IP 185.234.219.12 — Tor exit, RU, AS49870', color: 'bg-purple-400' },
                { t: '09:14', ev: '7 IOCs matched in threat database', color: 'bg-rose-400' },
                { t: '09:14', ev: 'Risk score computed: 91 — MALICIOUS', color: 'bg-rose-400' },
              ].map(({ t, ev, color }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-600 w-10 shrink-0">{t}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${color} shrink-0`} />
                  <span className="text-xs font-mono text-slate-400">{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export bar */}
          <div className="px-5 py-3 bg-[#070b14]/40 border-t border-slate-800/60 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-500">Export as:</span>
            <Badge variant="info" size="sm">PDF Report</Badge>
            <Badge variant="outline" size="sm">HTML Dossier</Badge>
            <Badge variant="outline" size="sm">JSON Evidence</Badge>
            <Badge variant="outline" size="sm">STIX 2.1</Badge>
          </div>
        </div>
      </div>
    </div>
  </section>
);
