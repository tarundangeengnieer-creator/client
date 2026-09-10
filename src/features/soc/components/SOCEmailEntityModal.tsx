import React, { useState } from 'react';
import { useSOC, socStore } from '../../../stores/soc-store.ts';
import { Modal } from '../../../components/ui/Modal.tsx';
import { ShieldAlert, ShieldCheck, Mail, Globe, Paperclip, Link, FileText, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const SOCEmailEntityModal: React.FC = () => {
  const { isEmailEntityOpen, emailEntity, isLoadingEmailEntity, selectedAlertId, alerts } = useSOC();
  const [activeTab, setActiveTab] = useState<'summary' | 'headers' | 'chain' | 'iocs'>('summary');

  if (!isEmailEntityOpen) return null;

  const alert = alerts.find(a => a.id === selectedAlertId);

  return (
    <Modal
      isOpen={isEmailEntityOpen}
      onClose={() => socStore.closeEmailEntity()}
      title={
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          <span>EMAIL ENTITY FORENSIC INSPECTION</span>
          {alert && (
            <span className="ml-2 font-mono text-[11px] px-2 py-0.5 rounded bg-transparent text-sky-600 dark:text-sky-400 font-bold border border-sky-500/30">
              {alert.id}
            </span>
          )}
        </div>
      }
      description={alert ? alert.subject : 'Detailed forensic breakdown of message headers, routing hops, and embedded artifacts'}
      maxWidth="2xl"
    >
      {isLoadingEmailEntity || !emailEntity ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-500">Reconstructing email envelope & telemetry...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Score Banner */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200/80 dark:border-slate-800 gap-3">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Threat Score</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-lg font-mono font-bold ${emailEntity.risk_score >= 80 ? 'text-rose-600' : 'text-amber-600'}`}>
                    {emailEntity.risk_score}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/100</span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">{emailEntity.confidence_score}%</p>
              </div>
            </div>

            {/* Auth badges */}
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className={`px-2 py-0.5 rounded font-bold border ${emailEntity.spf === 'PASS' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
                SPF: {emailEntity.spf}
              </span>
              <span className={`px-2 py-0.5 rounded font-bold border ${emailEntity.dkim === 'PASS' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
                DKIM: {emailEntity.dkim}
              </span>
              <span className={`px-2 py-0.5 rounded font-bold border ${emailEntity.dmarc === 'PASS' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
                DMARC: {emailEntity.dmarc}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${activeTab === 'summary' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400 font-bold border border-slate-300 dark:border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Envelope & Summary
            </button>
            <button
              onClick={() => setActiveTab('chain')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${activeTab === 'chain' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400 font-bold border border-slate-300 dark:border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Received Chain ({emailEntity.received_chain.length})
            </button>
            <button
              onClick={() => setActiveTab('iocs')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${activeTab === 'iocs' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400 font-bold border border-slate-300 dark:border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Artifacts & URLs ({emailEntity.url_ids.length + emailEntity.attachment_ids.length})
            </button>
            <button
              onClick={() => setActiveTab('headers')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${activeTab === 'headers' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-400 font-bold border border-slate-300 dark:border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Raw Headers
            </button>
          </div>

          {/* Tab 1: Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-[#0a0f1d] rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Header From / Sender</span>
                  <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5 break-all select-all font-semibold">{emailEntity.sender}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#0a0f1d] rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Recipients</span>
                  <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5 break-all select-all">{emailEntity.recipients.join(', ')}</p>
                </div>
              </div>

              {emailEntity.message_id && (
                <div className="p-2.5 bg-slate-50 dark:bg-[#0a0f1d] rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Message-ID</span>
                  <p className="font-mono text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 break-all select-all">{emailEntity.message_id}</p>
                </div>
              )}

              {emailEntity.body_text_sample && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Body Preview (Sanitized Text Extraction)</span>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#080d19] border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {emailEntity.body_text_sample}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Received Chain */}
          {activeTab === 'chain' && (
            <div className="space-y-3 text-xs">
              <p className="text-[11px] text-slate-500">MTA Relay Hops from origin network to mailbox:</p>
              <div className="space-y-2">
                {emailEntity.received_chain.map((hop, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1d] flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center font-bold text-[11px] font-mono flex-shrink-0 border border-slate-300 dark:border-slate-700">
                      {hop.hop_number}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{hop.ip}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${hop.auth_state === 'PASS' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
                          {hop.auth_state}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">From: {hop.from_host}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">By: {hop.by_host}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Timestamp: {hop.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Artifacts & URLs */}
          {activeTab === 'iocs' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-blue-500" />
                  <span>Embedded URLs ({emailEntity.url_ids.length})</span>
                </h4>
                {emailEntity.url_ids.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">No external hyperlinks found</p>
                ) : (
                  <div className="space-y-1.5">
                    {emailEntity.url_ids.map((url, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-rose-600 dark:text-rose-400 break-all select-all flex items-center justify-between">
                        <span>{url}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-transparent text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30 ml-2">Suspicious</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-amber-500" />
                  <span>MIME Attachments ({emailEntity.attachment_ids.length})</span>
                </h4>
                {emailEntity.attachment_ids.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">No file attachments extracted</p>
                ) : (
                  <div className="space-y-1.5">
                    {emailEntity.attachment_ids.map((att, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>{att}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-transparent text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">Quarantined</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Raw Headers */}
          {activeTab === 'headers' && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Full SMTP RFC 822 Headers</span>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-[10px] font-mono overflow-x-auto max-h-64 whitespace-pre-wrap leading-tight select-all">
                {emailEntity.raw_headers_snippet || 'Headers snippet unavailable.'}
              </pre>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => socStore.closeEmailEntity()}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            {selectedAlertId && (
              <button
                onClick={() => {
                  socStore.closeEmailEntity();
                  socStore.escalateToInvestigator(selectedAlertId);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 border border-rose-500/40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Escalate to Investigator</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
