import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import {
  X,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Server,
  Link2,
  Paperclip,
  Code,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';

export const EmailEntityModal: React.FC = () => {
  const { emailEntity, isEmailEntityOpen } = useInvestigator();
  const [activeTab, setActiveTab] = useState<'headers' | 'chain' | 'body'>('headers');
  const [copiedRaw, setCopiedRaw] = useState(false);

  if (!isEmailEntityOpen || !emailEntity) return null;

  const handleCopyRaw = () => {
    if (emailEntity.raw_headers_snippet) {
      navigator.clipboard.writeText(emailEntity.raw_headers_snippet);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  const getAuthBadge = (status: string) => {
    if (status === 'PASS') {
      return 'bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
    }
    if (status === 'FAIL' || status === 'REJECT') {
      return 'bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30';
    }
    return 'bg-transparent text-slate-600 dark:text-slate-400 border border-slate-700/60';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-[#090e1c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-sky-500 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-transparent text-sky-600 dark:text-sky-400 border border-sky-500/30 font-mono">
                  Email Entity Specimen
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {emailEntity.email_id}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-xl">
                {emailEntity.subject}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => investigatorStore.openEmailEntityModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Forensic Metadata Banner */}
        <div className="px-5 py-3 bg-slate-100/50 dark:bg-[#080d19] border-b border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Sender Envelope</span>
            <p className="font-mono text-slate-900 dark:text-slate-100 font-semibold truncate mt-0.5">
              {emailEntity.sender}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Recipient</span>
            <p className="font-mono text-slate-900 dark:text-slate-100 font-semibold truncate mt-0.5">
              {emailEntity.recipients.join(', ')}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Cryptographic Auth</span>
            <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px]">
              <span className={`px-1.5 py-0.2 rounded border font-bold ${getAuthBadge(emailEntity.spf)}`}>
                SPF:{emailEntity.spf}
              </span>
              <span className={`px-1.5 py-0.2 rounded border font-bold ${getAuthBadge(emailEntity.dkim)}`}>
                DKIM:{emailEntity.dkim}
              </span>
              <span className={`px-1.5 py-0.2 rounded border font-bold ${getAuthBadge(emailEntity.dmarc)}`}>
                DMARC:{emailEntity.dmarc}
              </span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Forensic Risk Score</span>
            <p className="font-mono text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              {emailEntity.risk_score}/100 <span className="text-[10px] font-normal text-slate-500">({emailEntity.confidence_score}% conf)</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('headers')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'headers'
                ? 'border-[#1a68ff] text-[#1a68ff] dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Raw Headers & Envelope
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chain')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'chain'
                ? 'border-[#1a68ff] text-[#1a68ff] dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Received Relay Chain ({emailEntity.received_chain.length} Hops)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('body')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'body'
                ? 'border-[#1a68ff] text-[#1a68ff] dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Body & Artifact Extractor
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {activeTab === 'headers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-medium">
                  Cryptographically sealed RFC 5322 Inbound Header Stream:
                </span>
                <button
                  type="button"
                  onClick={handleCopyRaw}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {copiedRaw ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRaw ? 'Copied' : 'Copy Headers'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
                {emailEntity.raw_headers_snippet}
              </pre>
            </div>
          )}

          {activeTab === 'chain' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 mb-2">
                Hop-by-hop MTA envelope reconstruction from origin to target quarantine spool:
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                {emailEntity.received_chain.map((hop) => (
                  <div key={hop.hop_number} className="p-3 bg-slate-50/50 dark:bg-[#090e1c] flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      {hop.hop_number}
                    </div>
                    <div className="flex-1 min-w-0 font-mono text-[11px] space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          IP: {hop.ip}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(hop.timestamp).toUTCString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        From: <span className="text-slate-800 dark:text-slate-200">{hop.from_host}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        By: <span className="text-slate-800 dark:text-slate-200">{hop.by_host}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'body' && (
            <div className="space-y-4">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Extracted URLs ({emailEntity.url_ids.length}):
                </span>
                <div className="space-y-1">
                  {emailEntity.url_ids.map((url) => (
                    <div
                      key={url}
                      className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[11px] break-all flex items-center gap-2"
                    >
                      <Link2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{url}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  MIME Attachments ({emailEntity.attachment_ids.length}):
                </span>
                <div className="space-y-1">
                  {emailEntity.attachment_ids.map((att) => (
                    <div
                      key={att}
                      className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-mono text-[11px] flex items-center gap-2"
                    >
                      <Paperclip className="w-3.5 h-3.5 shrink-0" />
                      <span>{att}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Body Text Specimen:
                </span>
                <div className="p-3 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed">
                  {emailEntity.body_text_sample}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-[#090e1c]">
          <button
            type="button"
            onClick={() => investigatorStore.openEmailEntityModal(false)}
            className="px-4 py-1.5 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
