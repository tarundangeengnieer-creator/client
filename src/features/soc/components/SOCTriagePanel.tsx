import React, { useState } from 'react';
import { useSOC, socStore } from '../../../stores/soc-store.ts';
import { 
  X, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  ShieldOff, 
  Flame, 
  Lock, 
  MessageSquare,
  Send,
  AlertOctagon
} from 'lucide-react';

export const SOCTriagePanel: React.FC = () => {
  const { alerts, selectedAlertId, isTriagePanelOpen } = useSOC();
  
  // Interactive modal/prompt states for sensitive actions
  const [showFpReason, setShowFpReason] = useState(false);
  const [fpReason, setFpReason] = useState('');
  
  const [showQuarantineConfirm, setShowQuarantineConfirm] = useState(false);
  const [showFraudConfirm, setShowFraudConfirm] = useState(false);
  const [fraudRationale, setFraudRationale] = useState('');

  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!isTriagePanelOpen || !selectedAlertId) return null;

  const alert = alerts.find(a => a.id === selectedAlertId);
  if (!alert) return null;

  const handleConfirmFP = () => {
    if (!fpReason.trim()) return;
    socStore.updateAlertStatus(alert.id, 'CLOSED_FALSE_POSITIVE', fpReason);
    setShowFpReason(false);
    setFpReason('');
  };

  const handleConfirmFraud = () => {
    if (!fraudRationale.trim()) return;
    socStore.escalateToFraudIR(alert.id, fraudRationale);
    setShowFraudConfirm(false);
    setFraudRationale('');
  };

  const handleConfirmQuarantine = () => {
    const domain = alert.sender.split('@')[1] || alert.sender;
    socStore.quarantineSenderOrDomain(domain, 'DOMAIN');
    setShowQuarantineConfirm(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    socStore.addNote(alert.id, noteText);
    setNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50/90 dark:bg-[#0a0f1d] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between select-none">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>{alert.id}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border ${
            alert.severity === 'CRITICAL' ? 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30' :
            alert.severity === 'HIGH' ? 'bg-transparent text-orange-600 dark:text-orange-400 border-orange-500/30' :
            'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/30'
          }`}>
            {alert.severity}
          </span>
          {alert.is_sla_breached && (
            <span className="px-1.5 py-0.5 rounded bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/40 text-[8px] font-bold tracking-wider">
              SLA BREACH
            </span>
          )}
        </h3>
        <button onClick={() => socStore.selectAlert(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Subject & Score Banner */}
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Subject</span>
            <span className="text-[11px] font-mono font-bold text-rose-600">Score: {alert.threat_score}/100</span>
          </div>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">{alert.subject}</p>
        </div>

        {/* Sender & Recipient */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Originating Sender</span>
            <p className="font-mono text-slate-800 dark:text-slate-200 truncate bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded border border-slate-200 dark:border-slate-800 select-all" title={alert.sender}>
              {alert.sender}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Recipient</span>
            <p className="font-mono text-slate-800 dark:text-slate-200 truncate bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded border border-slate-200 dark:border-slate-800 select-all" title={alert.recipient}>
              {alert.recipient}
            </p>
          </div>
        </div>

        {/* Threat context */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2 rounded bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Category</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{alert.threat_category}</span>
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Origin Geo / IP</span>
            <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">{alert.source_geo} ({alert.source_ip})</span>
          </div>
        </div>

        {/* Auth Verdict Grid */}
        <div className="p-2.5 rounded bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Authentication Telemetry</span>
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
            <div className={`py-1 rounded border ${alert.auth_signals.spf === 'PASS' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
              SPF: {alert.auth_signals.spf}
            </div>
            <div className={`py-1 rounded border ${alert.auth_signals.dkim === 'PASS' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
              DKIM: {alert.auth_signals.dkim}
            </div>
            <div className={`py-1 rounded border ${alert.auth_signals.dmarc === 'PASS' ? 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30'}`}>
              DMARC: {alert.auth_signals.dmarc}
            </div>
          </div>
        </div>

        {/* Email Entity Drilldown Button */}
        <button 
          onClick={() => socStore.openEmailEntity()}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-sky-400 transition-colors cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Open Email Entity View</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
        </button>

        {/* Analyst Note section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          {!isAddingNote ? (
            <button
              onClick={() => setIsAddingNote(true)}
              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Add triage note...</span>
            </button>
          ) : (
            <div className="space-y-1.5">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Log observation or indicator context..."
                className="w-full p-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070b14] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                rows={2}
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="px-2 py-1 text-[10px] text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-2.5 py-1 text-[10px] font-bold rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-2.5 h-2.5" />
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Surface */}
      <div className="p-3 bg-slate-50 dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-slate-800 space-y-2">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">Triage & Disposition</h4>
        
        {/* State 1: New Alert */}
        {alert.status === 'NEW' && (
          <button 
            onClick={() => socStore.acknowledgeAlert(alert.id)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Acknowledge & Assign to Me
          </button>
        )}

        {/* State 2: Active Alert Actions */}
        {alert.status !== 'NEW' && !showFpReason && !showQuarantineConfirm && !showFraudConfirm && (
          <div className="space-y-1.5">
            {/* Primary dispositions */}
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => socStore.updateAlertStatus(alert.id, 'CLOSED_TRUE_POSITIVE', 'Confirmed Threat')}
                className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-bold rounded border border-emerald-500/30 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                True Positive
              </button>
              <button 
                onClick={() => setShowFpReason(true)}
                className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0e1627] hover:bg-slate-100 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <ShieldOff className="w-3 h-3 text-slate-400" />
                False Positive
              </button>
            </div>

            {/* Quarantine */}
            <button
              onClick={() => setShowQuarantineConfirm(true)}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded border border-amber-500/30 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-600" />
              Quarantine Sender Domain
            </button>

            {/* Escalations */}
            <div className="pt-1 space-y-1">
              <button 
                onClick={() => setShowFraudConfirm(true)}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded border border-purple-500/30 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 cursor-pointer"
              >
                <Flame className="w-3 h-3 text-purple-600" />
                Escalate to Fraud / IR
              </button>
              <button 
                onClick={() => socStore.escalateToInvestigator(alert.id)}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded border border-rose-500/40 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 cursor-pointer shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Escalate to Investigator
              </button>
            </div>
          </div>
        )}

        {/* Modal Prompt 1: False Positive Reason */}
        {showFpReason && (
          <div className="p-2.5 rounded bg-white dark:bg-[#070b14] border border-amber-200 dark:border-amber-900 space-y-2">
            <span className="text-[10px] font-bold uppercase text-amber-600 block">False Positive Justification Required</span>
            <input
              type="text"
              placeholder="e.g. Legitimate vendor domain / simulated drill"
              value={fpReason}
              onChange={(e) => setFpReason(e.target.value)}
              className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200"
            />
            <div className="flex items-center justify-end gap-1.5">
              <button onClick={() => setShowFpReason(false)} className="px-2 py-1 text-[10px] text-slate-500 cursor-pointer">Cancel</button>
              <button onClick={handleConfirmFP} className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer">Confirm Close</button>
            </div>
          </div>
        )}

        {/* Modal Prompt 2: Quarantine Confirmation */}
        {showQuarantineConfirm && (
          <div className="p-2.5 rounded bg-white dark:bg-[#070b14] border border-rose-500/40 space-y-2">
            <div className="flex items-center gap-1.5 text-rose-500 font-bold text-[11px]">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Confirm Domain Quarantine</span>
            </div>
            <p className="text-[10px] text-slate-500">Block all incoming emails from sender domain across gateway:</p>
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{alert.sender.split('@')[1] || alert.sender}</p>
            <div className="flex items-center justify-end gap-1.5">
              <button onClick={() => setShowQuarantineConfirm(false)} className="px-2 py-1 text-[10px] text-slate-500 cursor-pointer">Cancel</button>
              <button onClick={handleConfirmQuarantine} className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer">Quarantine Domain</button>
            </div>
          </div>
        )}

        {/* Modal Prompt 3: Fraud/IR Escalation */}
        {showFraudConfirm && (
          <div className="p-2.5 rounded bg-white dark:bg-[#070b14] border border-sky-500/40 space-y-2">
            <span className="text-[10px] font-bold uppercase text-sky-400 block">Fraud / Incident Response Rationale</span>
            <input
              type="text"
              placeholder="e.g. Executive impersonation with wire routing modification"
              value={fraudRationale}
              onChange={(e) => setFraudRationale(e.target.value)}
              className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200"
            />
            <div className="flex items-center justify-end gap-1.5">
              <button onClick={() => setShowFraudConfirm(false)} className="px-2 py-1 text-[10px] text-slate-500 cursor-pointer">Cancel</button>
              <button onClick={handleConfirmFraud} className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 border border-sky-500/40 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 cursor-pointer">Escalate to IR</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
